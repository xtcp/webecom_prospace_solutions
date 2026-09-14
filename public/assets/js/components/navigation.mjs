// navigation.mjs
// Met a jour la navigation actif

const container = document.getElementById("header-nav");
function normalizePath(path) {
// Rôle: Traiter "/", "/index.html" et "" comme équivalents (page d'accueil)
//   et retirer un éventuel slash final pour une comparaison fiable.
//
// Paramètres:
//      path - string - Le path/uri actuel (/index.html /contact.html ...)
//
// Retour:
//      string path filtrée

    let normalized = path.replace(/index\.html$/, '').replace(/\/$/, '');
    return normalized === '' ? '/' : normalized;
}

function markActiveLink() {

    const currentPath = normalizePath(window.location.pathname);
    const links = document.querySelectorAll('.header-nav-link');

    links.forEach((link) => {
        const linkUrl = new URL(link.href, window.location.origin);
        const linkPath = normalizePath(linkUrl.pathname);
        const isActive = linkPath === currentPath;

        link.classList.toggle('header-nav-link-active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Rôle: Initialisation du module, met a jour le compteur 
export function initNavigation() {
    if (container) {
        // Le header est déjà présent (ex: cache, ou ordre de chargement favorable)
        markActiveLink();
    }
}