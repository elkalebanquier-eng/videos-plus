# Vidéos Plus — version web 3.3.4

`index.html` contient VideoStory 3.3.4 et charge `pastel-theme.css` : interface pastel tactile sur tous les écrans, accueil mobile avec mascotte 3D, cartes de projets assorties et icône PWA coordonnée. Les illustrations transparentes sont optimisées en WebP. Le mix audio est normalisé; chaque narration est vérifiée avant planification. Speechify est demandé en PCM brut signé 16 bits à 24 kHz; le client convertit directement les échantillons en `AudioBuffer` sans décodeur de conteneur du navigateur. Si une réponse HTTP réussie ne contient pas d’audio, l’application essaie une seule fois le WAV et accepte plusieurs enveloppes; si l’audio manque encore, elle affiche le motif/identifiant Speechify pour faciliter le diagnostic. L’export reste bloqué si une voix manque ou est silencieuse. Le domaine de production actuel reste `https://elka-jobnet.vercel.app/`.

## Sous-titres automatiques

Les sous-titres sont incrustés dans les vidéos exportées. Depuis l’éditeur, le bouton **CC** télécharge aussi un fichier `.srt` UTF‑8 autonome, découpé comme les sous-titres affichés et synchronisé avec les repères de parole Speechify lorsqu’ils sont disponibles (sinon, le minutage estimé des mots est utilisé). Le fichier porte le même nom de base que la vidéo et peut être importé séparément sur les plateformes qui acceptent les pistes de sous-titres.

## Déploiement et Speechify

Les changements poussés sur `main` sont déployés automatiquement par Vercel. La narration utilise `/api/speechify`; la clé est conservée uniquement côté serveur dans `SPEECHIFY_API_KEY`. Dans **Vercel → projet → Settings → Environment Variables**, vérifie que cette variable est configurée pour Production (et Preview si nécessaire), puis relance un déploiement après toute modification. Ne mets jamais la clé dans le HTML, le navigateur ou GitHub.

Dans l’app, ouvre **Paramètres → Charger mes voix** pour vérifier l’accès, puis **Tester la voix Speechify** pour valider la synthèse. `simba-3.0` est utilisé par défaut pour le français; `simba-3.2` est réservé à l’anglais. La route serverless limite le texte à 2 000 caractères et efface les anciennes clés locales pendant la migration.

## Rendu serveur Modal CPU

Le rendu mobile de 18 à 180 secondes utilise le worker Modal `videos-plus-renderer`. Il fonctionne sans GPU, avec 2 vCPU et 4 Gio de mémoire, un seul conteneur au maximum, et une réduction à zéro après 60 secondes d’inactivité. La formule Starter du workspace observée au déploiement affichait 1 $ de crédit gratuit disponible; aucun moyen de paiement n’a été ajouté. Modal peut refuser les nouvelles tâches lorsque le crédit gratuit est épuisé. Les rendus plus courts ou hors mobile restent locaux. Render est conservé provisoirement comme solution de retour arrière; ne le supprimer qu’après validation d’exports réels sur Modal.

Pour redéployer le worker depuis ce dépôt, installe le CLI Modal puis exécute `modal deploy modal-worker/modal_app.py` après authentification. L’image utilise Node 22, Chromium et FFmpeg; Playwright exige Node 20 ou plus. Le worker reste CPU-only : l’ajout d’un GPU n’accélérerait pas son encodage FFmpeg actuel.

Les exports sonores de **2 minutes ou plus** utilisent par prudence le chemin d’enregistrement compatible plutôt que le muxage AAC WebCodecs. Le format final (MP4/WebM) dépend des capacités du navigateur. Pour un export long, garde l’application au premier plan jusqu’à la fin. Si une vidéo contient une narration, l’application ne valide plus un fichier tant que toutes les scènes n’ont pas une piste vocale préparée.

L’export haute qualité peut être plus lent et consommer davantage de mémoire sur téléphone. Le chemin de secours teste le coût du rendu, essaie le 720p puis peut passer en 540p si nécessaire pour éviter une vidéo saccadée; un message l’indique et la préférence enregistrée ne change pas. Sélectionne aussi **Paramètres → Qualité de l’export vidéo → 720p** si l’appareil chauffe, manque de mémoire ou interrompt l’export.

## Changer soi-même le lien Vercel

Le nom du projet et le domaine sont deux réglages distincts. Pour renommer le projet : Vercel → projet qui sert `elka-jobnet.vercel.app` → **Settings → General → Project Name**, puis **Save**. Pour définir une adresse précise, va dans **Settings → Domains**, ajoute le domaine s’il est disponible, et affecte-le au projet de production. Teste le nouveau domaine avant de retirer l’ancien; Vercel ne garantit pas que l’ancien `*.vercel.app` restera disponible après un renommage.

Documentation officielle : [renommer un projet Vercel](https://vercel.com/kb/guide/how-do-i-change-the-name-of-my-vercel-project) et [gérer les domaines](https://vercel.com/docs/domains/working-with-domains).
