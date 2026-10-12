# Vidéos Plus — VideoStory 3.0.2

VideoStory 3.0.2 transforme des histoires en vidéos animées avec des actions de course, chute et rire, un personnage expressif, la narration Speechify et l’export vidéo. Le site de production est [elka-jobnet.vercel.app](https://elka-jobnet.vercel.app/).

## Fonctionnalités

- Création locale d’histoires et découpage en scènes.
- Actions du personnage déclenchées par le récit : courir, tomber, rire, avec expressions, mouvements, effets visuels et bruitages associés.
- Personnage vectoriel expressif avec regard, respiration, clignements et gestes synchronisés au rythme de la parole, aux pauses et aux accents.
- Transitions émotionnelles liées aux retournements du récit et intensité des gestes modulée au fil des scènes.
- Narration Speechify et synchronisation avec le récit.
- Export vidéo dans le navigateur; le conteneur (MP4/WebM) dépend des encodeurs disponibles sur l’appareil.
- Pour les vidéos sonores de 2 minutes ou plus, sélection automatique du chemin d’export compatible afin de préserver la piste audio sur les appareils concernés.
- Proxy Vercel sécurisé `/api/speechify` : la clé reste côté serveur et n’est pas stockée dans le navigateur ou le dépôt.

Les pushes sur `main` déclenchent le déploiement Vercel. La configuration Speechify et les étapes pour modifier le domaine sont dans [README-WEB.md](README-WEB.md).
