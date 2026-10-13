# Vidéos Plus — version web 3.3.0

`index.html` contient VideoStory 3.3.0 et charge `pastel-theme.css` : interface pastel tactile sur tous les écrans, accueil mobile avec mascotte 3D, cartes de projets assorties et icône PWA coordonnée. Les illustrations transparentes sont optimisées en WebP. Les correctifs antérieurs du personnage restent inclus : mouvements professionnels, mains adoucies, raccords sans fantôme et export 1080p/30 i/s lorsque l’appareil le permet. La résolution recommandée est 1080p; 720p reste disponible pour les appareils limités. Le domaine de production actuel reste `https://elka-jobnet.vercel.app/`.

## Déploiement et Speechify

Les changements poussés sur `main` sont déployés automatiquement par Vercel. La narration utilise `/api/speechify`; la clé est conservée uniquement côté serveur dans `SPEECHIFY_API_KEY`. Dans **Vercel → projet → Settings → Environment Variables**, vérifie que cette variable est configurée pour Production (et Preview si nécessaire), puis relance un déploiement après toute modification. Ne mets jamais la clé dans le HTML, le navigateur ou GitHub.

Dans l’app, ouvre **Paramètres → Charger mes voix** pour vérifier l’accès, puis **Tester la voix Speechify** pour valider la synthèse. `simba-3.0` est utilisé par défaut pour le français; `simba-3.2` est réservé à l’anglais. La route serverless limite le texte à 2 000 caractères et efface les anciennes clés locales pendant la migration.

Les exports sonores de **2 minutes ou plus** utilisent par prudence le chemin d’enregistrement compatible plutôt que le muxage AAC WebCodecs, afin d’éviter les pistes audio absentes ou coupées sur certains appareils. Le format final (MP4/WebM) dépend des capacités du navigateur. Pour un export long, garde l’application au premier plan jusqu’à la fin.

L’export haute qualité peut être plus lent et consommer davantage de mémoire sur téléphone. Le chemin de secours teste le coût du rendu, essaie le 720p puis peut passer en 540p si nécessaire pour éviter une vidéo saccadée; un message l’indique et la préférence enregistrée ne change pas. Sélectionne aussi **Paramètres → Qualité de l’export vidéo → 720p** si l’appareil chauffe, manque de mémoire ou interrompt l’export.

## Changer soi-même le lien Vercel

Le nom du projet et le domaine sont deux réglages distincts. Pour renommer le projet : Vercel → projet qui sert `elka-jobnet.vercel.app` → **Settings → General → Project Name**, puis **Save**. Pour définir une adresse précise, va dans **Settings → Domains**, ajoute le domaine s’il est disponible, et affecte-le au projet de production. Teste le nouveau domaine avant de retirer l’ancien; Vercel ne garantit pas que l’ancien `*.vercel.app` restera disponible après un renommage.

Documentation officielle : [renommer un projet Vercel](https://vercel.com/kb/guide/how-do-i-change-the-name-of-my-vercel-project) et [gérer les domaines](https://vercel.com/docs/domains/working-with-domains).
