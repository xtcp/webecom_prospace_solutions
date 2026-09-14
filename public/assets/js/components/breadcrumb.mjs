// breadcrumb.mjs
// Gère la creation des fil d'Ariane (breadcrumb) present sur les pages


const nav = document.querySelector('.breadcrumb');

const CHEVRON_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6"></path></svg>';

export function renderBreadcrumb(items = []) {
// Contruit le fil d'Ariane a partir d'une list d'étapes
//
// Paramètres:
//  items - Array - Liste d'etapes

    if (!nav) return;

    const ol = document.createElement('ol');
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '/index.html';
    a.textContent = 'Accueil';
    li.appendChild(a);
    ol.appendChild(li);

    items.forEach((item, index) => {
        const separator = document.createElement('li');
        separator.className = 'breadcrumb-separator';
        separator.setAttribute('aria-hidden', 'true');
        separator.innerHTML = CHEVRON_ICON;
        ol.appendChild(separator);

        const li = document.createElement('li');
        const isLast = index === items.length - 1;

        if (isLast) {
            const span = document.createElement('span');
            span.textContent = item.label;
            span.setAttribute('aria-current', 'page');
            li.appendChild(span);
        } else if (item.href) {
            const link = document.createElement('a');
            link.href = item.href;
            link.textContent = item.label;
            li.appendChild(link);
        } else {
            const span = document.createElement('span');
            span.textContent = item.label;
            li.appendChild(span);
        }

        ol.appendChild(li);
    });

    nav.replaceChildren(ol);
}


export function initBreadcrumb() {
// Initiation de module et creation de fil d'Ariane pour une page statique si present 
    if (!nav) return;

    const staticLabel = nav.dataset.breadcrumbLabel;
    if (staticLabel) {
        renderBreadcrumb([{ label: staticLabel }]);
    }
}