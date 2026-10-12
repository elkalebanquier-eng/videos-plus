# Vidéos Plus — VideoStory 3.0.9

VideoStory 3.0.9 transforme des histoires en vidéos animées avec une direction artistique cartoon, un mode Anime pilote, un cerveau narratif universel, la narration Speechify et l’export vidéo. Le site de production est [elka-jobnet.vercel.app](https://elka-jobnet.vercel.app/).

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
- Mode Anime pilote (activé par défaut) : yeux agrandis avec iris et reflets, mèches frontales en couches, accents de costume et lueur de scène teintée selon l’émotion; le rendu Classique reste sélectionnable dans Paramètres.
- Modèle « Pilote anime — émotions » pour tester une histoire courte qui passe de la peur à l’espoir puis à la fierté.
- Transitions émotionnelles liées aux retournements du récit et intensité des gestes modulée au fil des scènes.
- Narration Speechify et synchronisation avec le récit.
- Export vidéo dans le navigateur; le conteneur (MP4/WebM) dépend des encodeurs disponibles sur l’appareil.
- Pour les vidéos sonores de 2 minutes ou plus, sélection automatique du chemin d’export compatible afin de préserver la piste audio sur les appareils concernés.
- Proxy Vercel sécurisé `/api/speechify` : la clé reste côté serveur et n’est pas stockée dans le navigateur ou le dépôt.

Le pilote Anime s’appuie sur le dessin Canvas et le cache de rendu existants : aucun fichier image distant ni moteur d’encodage serveur supplémentaire. Il améliore le style 2D sans prétendre remplacer une production d’anime image par image ou un rig professionnel complet.

Les pushes sur `main` déclenchent le déploiement Vercel. La configuration Speechify et les étapes pour modifier le domaine sont dans [README-WEB.md](README-WEB.md).
