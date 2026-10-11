# Vidéos Plus — version web

`index.html` contient l’application web VideoStory 2.7, optimisée pour mobile et ordinateur. L’export MP4 se fait dans le navigateur. Le point d’entrée `/api/speechify` permet la narration vocale sans exposer la clé Speechify dans le HTML ni dans le stockage local du navigateur.

## Déploiement

Le dépôt est configuré pour Vercel. La version statique peut être consultée ailleurs, mais la synthèse Speechify nécessite l’endpoint serveur `/api/speechify` et n’est donc pas disponible sur un hébergement statique seul comme GitHub Pages.

Dans les paramètres Vercel du projet, ajoute la variable d’environnement `SPEECHIFY_API_KEY` avec une clé créée dans Speechify, puis redéploie. Ne colle jamais cette clé dans `index.html`, dans un commit GitHub ou dans les paramètres du navigateur. Le fichier `.env.example` indique le nom de la variable sans contenir de secret.

## Vérifier Speechify

Dans l’application, ouvre les paramètres puis utilise **Charger mes voix**. La liste renvoyée confirme que l’API et l’authentification répondent. Choisis une voix disponible en français, puis utilise **Tester la voix Speechify** pour vérifier la synthèse audio. Le modèle `simba-3.0` est sélectionné par défaut pour le français; `simba-3.2` est réservé à l’anglais.

L’API limite les textes de synthèse à 2 000 caractères par requête. Une clé manquante ou refusée produit un message de diagnostic dans l’application; aucune clé n’est demandée côté navigateur.

## Utilisation sur iPhone

Ouvre l’URL HTTPS du site dans Safari. Pour l’accès plein écran, choisis **Partager → Sur l’écran d’accueil**. Les fonctionnalités audio du navigateur exigent une interaction utilisateur pour démarrer la lecture.
