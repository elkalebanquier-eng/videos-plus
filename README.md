# Vidéos Plus — VideoStory 3.0.8

VideoStory 3.0.8 transforme des histoires en vidéos animées avec une direction artistique cartoon professionnelle, un cerveau narratif universel, un personnage expressif, la narration Speechify et l’export vidéo. Le site de production est [elka-jobnet.vercel.app](https://elka-jobnet.vercel.app/).

## Fonctionnalités

- Création locale d’histoires et découpage en scènes.
- Actions du personnage déclenchées par le récit : courir, tomber, rire, sauter, danser, pleurer, trembler et dormir, avec expressions, mouvements, effets visuels et bruitages associés.
- Compréhension sémantique renforcée : négations, contrastes, actions littérales et sujet de l’action sont pris en compte avant de choisir le jeu du personnage.
- Réalisateur IA contextuel : il modélise le sujet, l’action, la cause, la conséquence, l’hypothèse et l’arc émotionnel avant de choisir un geste, puis filtre les gestes corporels non littéraux, négatifs ou hypothétiques.
- Réactions d’attention : sourire profond, clin d’œil complice, retournement, regard caméra, célébration et changements d’expression synchronisés aux moments clés.
- Mise en scène des lieux : église, mosquée, marché et puits sont reconnus ; le personnage marche vers la destination, s’arrête devant elle et peut puiser de l’eau avec un geste et un bruitage synchronisés.
- Interface et décors cartoon premium : grille technique retirée, badge éditorial nettoyé, paysages doux, nuages, collines et profondeur visuelle autour du personnage.
- Création sans texte obligatoire : si l’idée et le script sont vides, le cerveau démarre avec une histoire universelle cohérente.
- Analyse multi-domaines : le réalisateur distingue sujet, action, cause, conséquence, négation, hypothèse, métaphore et arc émotionnel dans les histoires personnelles, éducatives, scientifiques, commerciales ou fictives.
- Personnage vectoriel expressif avec regard, respiration, clignements et gestes synchronisés au rythme de la parole, aux pauses et aux accents.
- Transitions émotionnelles liées aux retournements du récit et intensité des gestes modulée au fil des scènes.
- Narration Speechify et synchronisation avec le récit.
- Export vidéo uniquement sur le téléphone avec un seul moteur WebCodecs : MP4 H.264, AAC si une piste audio est utilisée, 720p maximum et 30 i/s. Aucun rendu serveur ni export WebM de secours. Les navigateurs sans encodeur H.264 requis affichent un message au lieu de générer un fichier d’un autre format.
- Pour les vidéos sonores de 2 minutes ou plus, sélection automatique du chemin d’export compatible afin de préserver la piste audio sur les appareils concernés.
- Proxy Vercel sécurisé `/api/speechify` : la clé reste côté serveur et n’est pas stockée dans le navigateur ou le dépôt.

Les pushes sur `main` déclenchent le déploiement Vercel. La configuration Speechify et les étapes pour modifier le domaine sont dans [README-WEB.md](README-WEB.md).
