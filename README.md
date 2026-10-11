# Vidéos Plus — créateur de vidéos

Vidéos Plus est l'application mobile-first fournie dans `onevo-explainer-rive-speechify.html`. Elle propose un éditeur de scènes, un personnage Rive, une narration Speechify optionnelle, une timeline et un export vidéo.

Le site contient maintenant les métadonnées SEO, Open Graph, Twitter Card, données structurées, URL canonique, sitemap et robots.txt associés à **Vidéos Plus**. Google doit encore recrawler la page : le changement de nom dans les résultats peut prendre de quelques jours à plusieurs semaines.

L’export social utilise le format vertical 9:16 en 1080×1920 par défaut. Le navigateur produit uniquement un flux intermédiaire WebM, puis le moteur FFmpeg déployé sur Render (`videos-plus-converter-live.onrender.com`) fabrique obligatoirement le MP4 H.264/AAC avec pixels `yuv420p`, audio AAC et `faststart`, pour une publication fiable sur TikTok, WhatsApp et les autres réseaux sociaux. Le téléphone ne charge donc pas FFmpeg et ne fabrique jamais le MP4 final ; si Render est indisponible, l’export est interrompu avec un message clair plutôt que de surcharger l’appareil.

Le parcours de création fonctionne en mode local sans clé IA. La narration Speechify passe par `/api/speechify` : la clé reste dans les variables d'environnement Vercel et n'est jamais enregistrée dans le navigateur, le HTML ou GitHub.

## Fonctions incluses

- Saisie d'une histoire en français.
- Découpage automatique en scènes à partir de la ponctuation.
- Détection locale d'actions : courir, tomber, sourire, parler, sauter.
- Personnage vectoriel dessiné sur Canvas : visage expressif, cheveux, vêtements, mains et chaussures.
- Poses animées locales synchronisées avec la scène : courir, tomber, sourire, parler et sauter.
- Rig 2D articulé avec os virtuels, épaules, coudes, hanches, genoux et interpolation de poses.
- Clignement, expressions, bouche rythmée et gestes indépendants du corps.
- Lecture, navigation scène par scène et export vidéo vertical pour les réseaux sociaux.
- Export vidéo robuste par capture image par image, envoi du WebM intermédiaire à Render et conversion obligatoire en MP4 H.264/AAC.
- Voix locale avec `SpeechSynthesis` en secours.
- Route serverless Speechify optionnelle : la clé reste côté serveur.
- Interface responsive pensée comme une application mobile.

## Architecture hybride Python + Canvas

Pour les animations avancées, Vidéos Plus charge Pyodide à la demande et exécute un petit moteur Python local. Python découpe l'histoire, détecte l'action, calcule le tempo, l'intensité et les battements de chaque scène. Canvas reste responsable du rendu image par image du personnage vectoriel. Il n'y a toujours aucune IA ni API nécessaire : Pyodide est un runtime local chargé uniquement quand l'utilisateur crée sa première histoire, avec un mode de secours JavaScript si le chargement échoue.

## Développement local

Le prototype statique peut être lancé avec n'importe quel serveur HTTP :

```bash
python3 -m http.server 4173
```

Puis ouvrir `http://localhost:4173`.

## Speechify sécurisé

Ne jamais écrire la clé dans `index.html`, dans un fichier JavaScript client ou dans un commit. Pour un déploiement avec fonctions serverless (par exemple Vercel), ajouter dans les variables d'environnement du projet :

- `SPEECHIFY_API_KEY`
- `SPEECHIFY_VOICE_ID` (optionnel, valeur par défaut `henry`)

La route `api/speechify.js` lit ces variables côté serveur. Si elle n'est pas disponible, le bouton utilise automatiquement la voix native du navigateur.

Pour GitHub Actions, enregistrer la clé dans **Settings → Secrets and variables → Actions**, jamais dans le dépôt. GitHub Pages peut héberger l'interface statique, mais il ne peut pas exécuter directement la route serverless Speechify ; il faudra alors garder la route sur un hébergeur de fonctions et configurer l'URL d'API côté déploiement.

## Déploiement GitHub + Vercel

GitHub reste le dépôt source et Vercel déploie automatiquement chaque push sur `main`. L'application est pensée pour Vercel : les fichiers statiques sont servis à la racine et `api/speechify.js` devient une fonction serverless.

Projet Vercel : https://videos-plus-elkalebanquier-engs-projects.vercel.app/

Dans **Vercel → Project Settings → Environment Variables**, ajouter `SPEECHIFY_API_KEY` et, facultativement, `SPEECHIFY_VOICE_ID`, pour les environnements Production et Preview. Ne jamais mettre la clé dans GitHub ou dans le navigateur. Après ajout d'une variable, relancer un déploiement Vercel. La clé déjà envoyée dans un message doit idéalement être révoquée puis remplacée après configuration, car un secret ne doit jamais circuler dans une conversation.

## Rendu complet côté Render — plan gratuit

L’export principal envoie maintenant le projet JSON à `POST /render`. Render ouvre l’interface dans Chromium headless, rend les scènes Canvas, capture le flux WebM, appelle FFmpeg côté serveur et renvoie le MP4 final. Le téléphone ne rend plus les scènes et ne lance plus `MediaRecorder` ni FFmpeg.

Le mode gratuit est volontairement limité pour tenir dans une instance Web Service de **0,1 CPU et 512 Mo de RAM** : un seul rendu simultané, 16 scènes maximum, 45 secondes maximum par export, sortie 720p et fichiers temporaires supprimés après 15 minutes. Les instances gratuites peuvent se mettre en veille après 15 minutes sans requête et leur système de fichiers est éphémère ; il ne faut donc pas utiliser ce stockage comme bibliothèque permanente.

Variables Render à configurer dans le service `video-converter` :

- `PUBLIC_APP_URL=https://videos-plus-elkalebanquier-engs-projects.vercel.app`
- `ALLOWED_ORIGIN=https://videos-plus-elkalebanquier-engs-projects.vercel.app`
- `MAX_RENDER_SECONDS=45`
- `CHROMIUM_PATH=/usr/bin/chromium` (image Debian Slim)

Le service conserve aussi `/convert` pour compatibilité, mais le bouton **Exporter sur Render** utilise désormais le nouveau flux asynchrone `/render` → `/render/:id` → `/render/:id/download`.
