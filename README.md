# Vidéos Plus — VideoStory 3.3.4

VideoStory 3.3.4 transforme des histoires en vidéos animées avec plusieurs rendus de personnage, un réalisateur narratif, la narration Speechify et l’export vidéo. Son interface adopte désormais un style pastel tactile, inspiré du claymorphism, avec une mascotte 3D et des raccourcis adaptés au mobile. Le site de production est [elka-jobnet.vercel.app](https://elka-jobnet.vercel.app/).

Les brouillons hors ligne suivent désormais une progression claire — accroche, contexte, tension, déclic et conclusion — avec des modèles adaptés notamment aux sujets personnels, professionnels, technologiques, de santé, d’apprentissage et de voyage, en français, anglais et espagnol. Les récits complexes ou très spécifiques gagnent à être générés avec Gemini configuré : le mode local reste volontairement un brouillon et ne prétend pas connaître les faits propres à chaque histoire.

## Fonctionnalités

- Interface repensée de bout en bout : fonds pastel crème/pêche/bleu/lilas, cartes en relief, navigation basse translucide, formulaires et éditeur harmonisés; mascotte et icône 3D optimisées en WebP.
- Création locale d’histoires et découpage en scènes.
- Actions du personnage déclenchées par le récit : courir, tomber, rire, sauter, danser, pleurer, trembler et dormir, avec expressions, mouvements, effets visuels et bruitages associés.
- Compréhension sémantique renforcée : négations, contrastes, actions littérales et sujet de l’action sont pris en compte avant de choisir le jeu du personnage.
- Réalisateur IA contextuel : il modélise le sujet, l’action, la cause, la conséquence, l’hypothèse et l’arc émotionnel avant de choisir un geste, puis filtre les gestes corporels non littéraux, négatifs ou hypothétiques.
- Structure d’histoire plus captivante : accroche honnête, question résolue, progression sans scènes de remplissage et conclusion utile ; les consignes IA évitent les promesses invérifiables, le clickbait et la pression artificielle.
- Réactions d’attention : sourire profond, clin d’œil complice, retournement, regard caméra, célébration et changements d’expression synchronisés aux moments clés.
- Mise en scène des lieux : église, mosquée, marché et puits sont reconnus ; le personnage marche vers la destination, s’arrête devant elle et peut puiser de l’eau avec un geste et un bruitage synchronisés.
- Interface et décors cartoon premium : grille technique retirée, badge éditorial nettoyé, paysages doux, nuages, collines et profondeur visuelle autour du personnage.
- Création sans texte obligatoire : si l’idée et le script sont vides, le cerveau démarre avec une histoire universelle cohérente.
- Analyse multi-domaines : le réalisateur distingue sujet, action, cause, conséquence, négation, hypothèse, métaphore et arc émotionnel dans les histoires personnelles, éducatives, scientifiques, commerciales ou fictives.
- Personnage vectoriel expressif avec regard, respiration, clignements et gestes synchronisés au rythme de la parole, aux pauses et aux accents.
- Mains retravaillées : doigts plus fins et distincts, pouce placé du bon côté sur chaque main, ombrage léger de la paume et rotation du poignet moins extrême pour éviter les poses tordues.
- Profil « Présentation professionnelle » sélectionné par défaut : mouvements plus sobres, bras moins tendus, poignets stabilisés et gestes simples limités pour garder une posture lisible.
- Raccords de scènes continus sans fondu croisé du même personnage : une coupe courte remplace la superposition qui créait des bras et des mains fantômes.
- Export 1080p recommandé par défaut : rendu du personnage suréchantillonné et animé à 30 i/s, sans réduire la qualité à cause des ralentissements de l’aperçu.
- Débit d’encodage vidéo adapté à la résolution (jusqu’à environ 8 Mbit/s en 1080p portrait/paysage) et audio AAC WebCodecs amélioré à 128 kbit/s; choix 720p conservé pour les appareils limités.
- Si le chemin de secours mesure qu’un appareil ne peut pas suivre le rendu 1080p, il teste le 720p puis peut descendre à 540p si nécessaire pour éviter une vidéo saccadée; il l’indique à l’écran sans changer la préférence enregistrée.
- Trois rendus sélectionnables : Anime expressif, Cartoon doux aux traits plus arrondis, ou Classique.
- Personnage personnalisable : tenue, coiffure, couleur des cheveux, carnation et couleur de la tenue.
- Mouvements adaptés au confort : suivi des préférences « réduire les animations » du téléphone, réglage manuel pour mouvements doux, ou animation normale; les expressions et le synchronisme de parole restent actifs.
- Modèle « Pilote anime — émotions » pour tester une histoire courte qui passe de la peur à l’espoir puis à la fierté.
- Transitions émotionnelles liées aux retournements du récit et intensité des gestes modulée au fil des scènes.
- Narration Speechify et synchronisation avec le récit.
- Speechify renvoie des échantillons PCM bruts 16 bits à 24 kHz, convertis directement en AudioBuffer sans décodeur MP3/WAV natif. Si le service répond sans audio, l’application essaie une seule fois le WAV, reconnaît plusieurs enveloppes audio et affiche le motif/identifiant de requête si aucune piste exploitable n’arrive.
- Export audio renforcé : contrôle que chaque scène narrée possède un buffer vocal exploitable, normalisation du mix et blocage explicite d’un export muet.
- Export vidéo dans le navigateur; le conteneur (MP4/WebM) dépend des encodeurs disponibles sur l’appareil.
- Pour les vidéos sonores de 2 minutes ou plus, sélection automatique du chemin d’export compatible afin de préserver la piste audio sur les appareils concernés.
- Proxy Vercel sécurisé `/api/speechify` : la clé reste côté serveur et n’est pas stockée dans le navigateur ou le dépôt.

Les styles s’appuient sur le dessin Canvas et le cache de rendu existants : aucun fichier image distant ni moteur d’encodage serveur supplémentaire. En aperçu, le personnage reste optimisé pour les téléphones; l’export utilise des calques plus fins à 30 i/s. Les bras sont articulés par calcul procédural et les poses suivent le récit, mais ce personnage reste une animation vectorielle 2D — pas encore un rig professionnel image par image ni un personnage 3D.

Les pushes sur `main` déclenchent le déploiement Vercel. La configuration Speechify et les étapes pour modifier le domaine sont dans [README-WEB.md](README-WEB.md).
