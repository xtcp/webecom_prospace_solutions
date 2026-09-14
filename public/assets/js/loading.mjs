// Module Javascript pour affichage de chargement

let spinner = document.querySelector(".spinner");

export function setLoading(container, isLoading) {
// Rôle: Affiche ou cache la roue de chargement et define le container comme en chargement pour l'accessibilité
//  
// Paramètres:
//      container - objet - L'element container a apliquer le chargement
//      isLoading - Boolean - L'etat de chargement, true = en chargement

    if (!container) return;
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.className = 'spaces-loading';
        spinner.setAttribute('role', 'status');
        spinner.innerHTML = `<span class="spinner" aria-hidden="true"></span><span>Chargement…</span>`;
        container.insertAdjacentElement('beforebegin', spinner);
    }
    spinner.style.display = isLoading ? 'flex' : 'none';
    container.setAttribute('aria-busy', isLoading ? 'true' : 'false');
    container.classList.toggle('is-loading', isLoading);
}