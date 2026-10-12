# Vidéos Plus — version web 3.0.5

`index.html` contient VideoStory 3.0.5, avec des actions de course, chute, rire, saut, danse, pleurs, tremblement et sommeil liées au récit, un cerveau narratif capable de travailler sans histoire saisie, une lecture multi-domaines, une interface cartoon premium, des décors sans traces techniques, des gestes synchronisés à la parole, des transitions émotionnelles plus nuancées, l’édition des scènes et l’export vidéo dans le navigateur. Le domaine de production actuel reste `https://elka-jobnet.vercel.app/`.

## Déploiement et Speechify

Les changements poussés sur `main` sont déployés automatiquement par Vercel. La narration utilise `/api/speechify`; la clé est conservée uniquement côté serveur dans `SPEECHIFY_API_KEY`. Dans **Vercel → projet → Settings → Environment Variables**, vérifie que cette variable est configurée pour Production (et Preview si nécessaire), puis relance un déploiement après toute modification. Ne mets jamais la clé dans le HTML, le navigateur ou GitHub.

Dans l’app, ouvre **Paramètres → Charger mes voix** pour vérifier l’accès, puis **Tester la voix Speechify** pour valider la synthèse. `simba-3.0` est utilisé par défaut pour le français; `simba-3.2` est réservé à l’anglais. La route serverless limite le texte à 2 000 caractères et efface les anciennes clés locales pendant la migration.

L’export vidéo est entièrement local : un seul moteur WebCodecs produit du MP4 H.264, avec audio AAC lorsqu’une piste audio est présente. La sortie est limitée à 720p/30 i/s pour réduire la charge du téléphone et le poids du fichier. Si le navigateur ne fournit pas les encodeurs nécessaires, l’application refuse l’export plutôt que de créer un WebM ou un fichier MP4 sans son.

## Changer soi-même le lien Vercel

Le nom du projet et le domaine sont deux réglages distincts. Pour renommer le projet : Vercel → projet qui sert `elka-jobnet.vercel.app` → **Settings → General → Project Name**, puis **Save**. Pour définir une adresse précise, va dans **Settings → Domains**, ajoute le domaine s’il est disponible, et affecte-le au projet de production. Teste le nouveau domaine avant de retirer l’ancien; Vercel ne garantit pas que l’ancien `*.vercel.app` restera disponible après un renommage.

Documentation officielle : [renommer un projet Vercel](https://vercel.com/kb/guide/how-do-i-change-the-name-of-my-vercel-project) et [gérer les domaines](https://vercel.com/docs/domains/working-with-domains).
