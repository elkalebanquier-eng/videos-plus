# Vidéos Plus — version web 2.8

`index.html` contient VideoStory 2.8, avec un personnage plus vivant (regard, clignements, respiration, expressions et gestes), l’édition de scènes et l’export vidéo dans le navigateur. Le nom de domaine actuel reste `https://elka-jobnet.vercel.app/`.

## Déploiement

Le dépôt est lié à Vercel et les changements poussés sur `main` sont déployés automatiquement. La synthèse Speechify utilise `/api/speechify`, une fonction Vercel qui conserve la clé uniquement côté serveur.

Dans **Vercel → projet → Settings → Environment Variables**, configure `SPEECHIFY_API_KEY` pour Production (et Preview si nécessaire), puis relance un déploiement. Ne mets jamais cette clé dans `index.html`, dans GitHub, ni dans le navigateur. `.env.example` ne contient que le nom de variable.

## Vérifier Speechify

Dans l’app, ouvre **Paramètres → Charger mes voix** : l’affichage d’une liste confirme l’accès authentifié à Speechify. Choisis une voix française, puis utilise **Tester la voix Speechify** pour vérifier la génération et la lecture audio. `simba-3.0` est le modèle par défaut pour le français; `simba-3.2` est réservé à l’anglais.

La fonction serverless limite les textes à 2 000 caractères par requête. Aucun champ de clé Speechify n’est exposé dans l’interface; toute ancienne clé Speechify conservée dans les paramètres locaux est effacée lors du chargement.

## Changer soi-même le lien Vercel

Le nom du projet et le domaine sont deux réglages distincts. Pour renommer le projet : Vercel → projet qui sert `elka-jobnet.vercel.app` → **Settings → General → Project Name**, saisir un nom en minuscules (par exemple `videos-plus`), puis **Save**. Les nouvelles URL de déploiement suivent le nouveau nom, mais Vercel ne garantit pas que l’ancien lien `.vercel.app` reste disponible.

Pour définir un lien précis, ouvre **Settings → Domains**, ajoute le domaine voulu s’il est disponible et affecte-le au projet de production. Teste le nouveau lien avant de retirer l’ancien. Les noms `*.vercel.app` sont attribués selon le principe du premier arrivé, premier servi; si `videos-plus.vercel.app` n’est pas disponible, choisis un autre nom unique. Un domaine personnalisé (que tu possèdes) peut également être associé au projet.

Documentation officielle : [renommer un projet Vercel](https://vercel.com/kb/guide/how-do-i-change-the-name-of-my-vercel-project) et [gérer les domaines](https://vercel.com/docs/domains/working-with-domains).

## Accès mobile

Ouvre l’URL HTTPS dans Safari ou Chrome. Sur iPhone, choisis **Partager → Sur l’écran d’accueil** pour créer un raccourci plein écran. Le navigateur exige une interaction utilisateur pour démarrer le son.
