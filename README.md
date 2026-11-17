# Studio animé — VideoStory 3.4.3

VideoStory 3.4.3 transforme des histoires en vidéos animées avec plusieurs rendus de personnage, un réalisateur narratif, la narration Speechify et l’export vidéo. Son interface adopte désormais un style pastel tactile, inspiré du claymorphism, avec une mascotte 3D et des raccourcis adaptés au mobile. Le site de production est [videos-plus.vercel.app](https://videos-plus.vercel.app/). L’ancienne adresse [elka-jobnet.vercel.app](https://elka-jobnet.vercel.app/) reste active comme alias.

Les brouillons hors ligne suivent désormais une progression claire — accroche, contexte, tension, déclic et conclusion — avec des modèles adaptés notamment aux sujets personnels, professionnels, technologiques, de santé, d’apprentissage et de voyage, en français, anglais et espagnol. Les récits complexes ou très spécifiques gagnent à être générés avec Gemini configuré : le mode local reste volontairement un brouillon et ne prétend pas connaître les faits propres à chaque histoire.

## Fonctionnalités

- Intégration visuelle des personnages : lumière et ombre harmonisées avec le décor, nettoyage des liserés clairs des découpes, rebond et écrasement plus naturels à la marche, pivot plus fluide des invités.
- Plans photo cinématiques et sprites 3D pré-rendus intégrés au HTML pour certaines scènes compatibles; les images se déplacent et se fondent sans ressource distante.
- Les sprites 3D ne s’activent que pour les scènes compatibles : les réglages d’apparence, le protagoniste féminin, les tenues narratives et les préférences de mouvement réduit conservent le moteur de personnage habituel.
- Les ajouts visuels préservent les profils Speechify par langue, l’inférence du genre principal et les callbacks sécurisés Modal/Render.

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

Les images photo et sprites 3D sont intégrés au HTML (25 ressources WebP, sans chargement distant). Les sprites sont pré-rendus, pas un nouveau rig 3D temps réel : ils s’appliquent à quelques compositions et poses compatibles; le moteur de personnage habituel reprend la main pour préserver personnalisation, costumes narratifs et accessibilité. L’export, le mix audio et les traitements d’image continuent d’utiliser les moteurs existants.

Les pushes sur `main` déclenchent le déploiement Vercel. La configuration Speechify et les étapes pour modifier le domaine sont dans [README-WEB.md](README-WEB.md).
