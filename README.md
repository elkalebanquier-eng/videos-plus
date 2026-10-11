# Vidéos Plus — VideoStory 2.8

VideoStory 2.8 crée des vidéos verticales à partir d’histoires, avec un personnage animé plus expressif, des scènes éditables, la narration Speechify et l’export vidéo. Le point d’entrée web est `index.html`; le domaine de production actuel est [elka-jobnet.vercel.app](https://elka-jobnet.vercel.app/).

## Fonctionnalités

- Création locale d’histoires et découpage en scènes.
- Personnage vectoriel avec expressions, respiration, clignements, regard et gestes plus naturels.
- Narration Speechify avec synchronisation des mots, de la bouche et des gestes.
- Export vidéo dans le navigateur, avec mode de compatibilité selon les capacités de l’appareil.
- Proxy Vercel sécurisé `/api/speechify` : la clé API reste côté serveur et n’est pas stockée dans le navigateur ou le dépôt.

## Déploiement Vercel

Le dépôt GitHub est la source du projet et les pushes sur `main` déclenchent le déploiement. Dans **Vercel → Settings → Environment Variables**, configure `SPEECHIFY_API_KEY` pour Production (et Preview si nécessaire), puis relance un déploiement. Ne commite jamais la clé.

Les tests et les étapes de configuration figurent dans [README-WEB.md](README-WEB.md).
