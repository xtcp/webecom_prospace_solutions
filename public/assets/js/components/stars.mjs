// Gère la creations des etoiles pour un rating

const STAR_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>';

export function createStars(rating) {
// Rôle: Construire le container avec les etoiles du rating
//
// Paramètres:
//  rating (Number) - Le rating de 0 a 5 de l'espace
//
// Retour:
//  starContainer - objet element div container

    const rounded = Math.round(rating || 0);
    const starContainer = document.createElement("div");
    starContainer.classList = "star-container"
    for (let i = 0; i < 5; i++) {
        const star = document.createElement("span");
        star.classList = "star " + ((i < rounded) ? "star-filled" : "star-empty");
        star.innerHTML = STAR_ICON;
        starContainer.appendChild(star);
    }
    return starContainer;
}
