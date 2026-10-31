const serverRender = new URLSearchParams(window.location.search).get('serverRender') === '1';
const accountButton = document.getElementById('accountButton');
const accountAvatar = document.getElementById('accountButtonAvatar');
const accountLabel = document.getElementById('accountButtonLabel');
const accountMenu = document.getElementById('accountMenu');
const accountMenuName = document.getElementById('accountMenuName');
const accountMenuEmail = document.getElementById('accountMenuEmail');

let auth = null;
let GoogleAuthProviderClass = null;
let signInWithPopupFn = null;
let signOutFn = null;
let resolveReady;
const ready = new Promise(resolve => { resolveReady = resolve; });

function notify(message, type) {
    if (typeof window.showToast === 'function') window.showToast(message, type);
    else console.info(message);
}

function closeAccountMenu() {
    if (!accountMenu) return;
    accountMenu.hidden = true;
    accountButton?.setAttribute('aria-expanded', 'false');
}

function renderAccount(user, error = null) {
    if (!accountButton) return;
    accountButton.disabled = false;
    accountButton.removeAttribute('aria-busy');

    if (error) {
        if (accountAvatar) accountAvatar.textContent = '!';
        if (accountLabel) accountLabel.textContent = 'Indisponible';
        accountButton.title = 'Connexion Firebase indisponible';
        accountButton.setAttribute('aria-label', 'Connexion Firebase indisponible');
        closeAccountMenu();
        return;
    }

    if (!user) {
        if (accountAvatar) accountAvatar.textContent = '👤';
        if (accountLabel) accountLabel.textContent = 'Connexion';
        accountButton.title = 'Se connecter avec Google';
        accountButton.setAttribute('aria-label', 'Se connecter avec Google');
        closeAccountMenu();
        return;
    }

    const displayName = String(user.displayName || '').trim();
    const initials = displayName
        ? displayName.split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase()
        : String(user.email || 'C').trim().charAt(0).toUpperCase();
    if (accountAvatar) accountAvatar.textContent = initials || 'C';
    if (accountLabel) accountLabel.textContent = displayName.split(/\s+/)[0] || 'Compte';
    if (accountMenuName) accountMenuName.textContent = displayName || 'Compte Google';
    if (accountMenuEmail) accountMenuEmail.textContent = user.email || '';
    accountButton.title = `Connecté à ${displayName || user.email || 'votre compte Google'}`;
    accountButton.setAttribute('aria-label', `Compte connecté : ${displayName || user.email || 'Google'}`);
}

window.VideoPlusAuth = {
    ready,
    get currentUser() { return auth?.currentUser || null; },
    getCurrentUser() { return auth?.currentUser || null; },
    async getIdToken(forceRefresh = false) {
        const user = auth?.currentUser;
        if (!user) throw new Error('Une connexion est nécessaire pour obtenir un jeton Firebase.');
        return user.getIdToken(Boolean(forceRefresh));
    },
    async handleAccountAction() {
        if (serverRender) return;
        if (!auth || !signInWithPopupFn) {
            notify('Le service de connexion n’est pas encore prêt. Réessaie dans quelques secondes.', 'error');
            return;
        }
        if (auth.currentUser) {
            if (accountMenu) {
                accountMenu.hidden = !accountMenu.hidden;
                accountButton?.setAttribute('aria-expanded', String(!accountMenu.hidden));
            }
            return;
        }
        const provider = new GoogleAuthProviderClass();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const result = await signInWithPopupFn(auth, provider);
            notify(`Connexion réussie${result.user.displayName ? ` : bienvenue ${result.user.displayName}` : '.'}`, 'success');
            return result.user;
        } catch (error) {
            console.warn('Firebase Google Sign-In a échoué', error);
            if (error?.code === 'auth/popup-closed-by-user') return;
            if (error?.code === 'auth/popup-blocked') {
                notify('La fenêtre Google a été bloquée. Autorise les fenêtres contextuelles, puis réessaie.', 'error');
            } else {
                notify(`Connexion Google impossible${error?.code ? ` (${error.code})` : ''}. Réessaie.`, 'error');
            }
        }
    },
    async signOut() {
        if (!auth || !signOutFn || !auth.currentUser) return;
        try {
            await signOutFn(auth);
            closeAccountMenu();
            notify('Déconnexion effectuée.', 'success');
        } catch (error) {
            console.warn('Déconnexion Firebase impossible', error);
            notify('La déconnexion a échoué. Réessaie.', 'error');
        }
    }
};

if (serverRender) {
    if (accountButton) accountButton.disabled = true;
    closeAccountMenu();
    resolveReady(null);
} else {
    if (accountButton) {
        accountButton.disabled = true;
        accountButton.setAttribute('aria-busy', 'true');
    }

    document.addEventListener('click', event => {
        if (!accountMenu || accountMenu.hidden) return;
        if (!accountButton?.contains(event.target) && !accountMenu.contains(event.target)) closeAccountMenu();
    });

    try {
        const [{ initializeApp, getApps, getApp }, authModule] = await Promise.all([
            import('https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js'),
            import('https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js')
        ]);
        const {
            getAuth,
            GoogleAuthProvider,
            signInWithPopup,
            signOut,
            onAuthStateChanged,
            setPersistence,
            browserLocalPersistence
        } = authModule;

        const firebaseConfig = {
            apiKey: 'AIzaSyBtZi5TQ_NXH-v_Rcm0XGH881gQyMg_uUI',
            authDomain: 'devconect-e6a5d.firebaseapp.com',
            projectId: 'devconect-e6a5d',
            appId: '1:236553916467:web:cbf66d4b17ac7c96031346'
        };
        const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
        auth = getAuth(app);
        auth.languageCode = 'fr';
        GoogleAuthProviderClass = GoogleAuthProvider;
        signInWithPopupFn = signInWithPopup;
        signOutFn = signOut;

        setPersistence(auth, browserLocalPersistence).catch(error => {
            console.info('La persistance locale Firebase n’est pas disponible dans ce navigateur.', error);
        });
        onAuthStateChanged(auth, user => {
            renderAccount(user);
            resolveReady(user);
        }, error => {
            console.error('État Firebase Auth indisponible', error);
            renderAccount(null, error);
            resolveReady(null);
        });
    } catch (error) {
        console.error('Chargement de Firebase Auth impossible', error);
        renderAccount(null, error);
        resolveReady(null);
    }
}
