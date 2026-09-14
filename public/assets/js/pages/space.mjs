// espace.mjs
//
// Gere les pages Espace (Fiche espace: espace.html?id=..)


import { e } from '../helpers.mjs';
import { getImage } from '../models/images.mjs';
import { getSpace } from '../models/spaces.mjs';
import { isFavorite, bindFavoriteButtons } from './my-spaces.mjs'
import { createStars } from '../components/stars.mjs'
import { renderBreadcrumb } from '../components/breadcrumb.mjs';


const container = document.getElementById("space-page");
const errorDiv = document.getElementById("space-error");
let space = {};

const CHECK_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>';

function updateTitle(space) {
// Rôle: Met a jour le titre et description de la page
//
// Paramètres:
//  space - L'espace chargée dans la page
    document.title = `${space.name} - Salle de Réunion ${space.capacity} p. | ProSpace Solutions`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', space.description);
}


async function render(space) {
// Rôle: Creation/modifications des elements HTML de la page d'un espace
//
// Paramètres:
//  space - L'espace chargée dans la page

    // fil d'ariane
    renderBreadcrumb([
        { label: space.district, href: `/index.html?ville=${encodeURIComponent(space.city)}` },
        { label: space.name }
    ]);
    let isCurrentlyFavorite = isFavorite(space.id);
    // Title and heading
    updateTitle(space);

    const spaceTitle = document.getElementById("space-title");
    spaceTitle.textContent = space.name;
    const locationText = document.querySelector(".space-card-location span");
    locationText.textContent = space.address;

     // Reviews
    const starsContainer = document.getElementById("star-container");
    const stars = createStars(space.rating);
    if (starsContainer) starsContainer.replaceWith(stars);
    const reviewSpan = document.querySelectorAll('.space-card-reviews > span');
    
    reviewSpan[0].textContent = space.rating.toFixed(1);
    reviewSpan[1].textContent = "· " + space.reviewCount + " avis vérifiés";

    // Images
    const primaryImg = document.querySelector('.space-images-primary img');
    const sideImg = document.querySelectorAll('.space-images-side img');

    const primary = await getImage(space.images[0]);
    const side1 = await getImage(space.images[1]);
    const side2 = await getImage(space.images[2]);

    if (primaryImg) { primaryImg.src = primary.path; primaryImg.alt = primary.alt; }
    if (sideImg[0]) { sideImg[0].src = side1.path; sideImg[0].alt = side1.alt; }
    if (sideImg[1]) { sideImg[1].src = side2.path; sideImg[1].alt = side2.alt; }

    // Description
    const descriptionText = document.querySelector(".space-details-info div h2");
    descriptionText.textContent = space.description;

    // Features
    const featureList = document.querySelector(".space-details-features-list");
    space.features_extended.forEach((feature) => {
        const li = document.createElement("li");
        li.innerHTML = CHECK_ICON;
        li.append(feature);
        featureList.appendChild(li);
    });
    // Capacity
    const capacitySpan = document.getElementById("space-details-capacity");
    capacitySpan.textContent = space.capacity + " personnes";

    // CTA
    const favoriteButton = document.getElementById("toggle-favorite");
    if (favoriteButton) {
        favoriteButton.dataset.id = space.id;
        favoriteButton.setAttribute('aria-pressed', isCurrentlyFavorite ? 'true' : 'false');
        favoriteButton.setAttribute(
            'aria-label',
            isCurrentlyFavorite ? `Retirer ${space.name} de mes espaces favoris` : `Sauvegarder ${space.name} dans mes espaces favoris`
        );
        const favoriteButtonText = document.querySelector("#toggle-favorite span");
        favoriteButtonText.textContent = isCurrentlyFavorite ? "Retirer de mes Favoris" : "Sauvegarder en Favoris";
        bindFavoriteButtons();
    }

    const contactButton = document.getElementById("contact-team");
    if (contactButton) {
        contactButton.addEventListener("click", () => {
            window.location.href = "/public/pages/contact.html?espace=" + encodeURIComponent(space.id);
        });
    }

    // Pricing
    const priceHourText = document.getElementById("space-details-princing-hour");
    const priceHalfDayText = document.getElementById("space-details-princing-half_day");
    const priceDayText = document.getElementById("space-details-princing-day");

    priceHourText.textContent = space.pricing.hour + "€";
    priceHalfDayText.textContent = space.pricing.halfDay + "€";
    priceDayText.textContent = space.pricing.day + "€";

}

function showError(message) {
// Rôle: Affiche un message d'erreur et cache les elements de la page 
//
// Paramètres:
//  message - Le message d'erreur
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.hidden = false;
    }
    document.querySelectorAll('.page-info, .space-images, .space-details').forEach((el) => el.replaceChildren());
}

export async function initSpace() {
// Rôle: Initialisation du module, recupère les donnés de l'url avec URLSearchParams
    if (!container) return;

    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
        showError("Aucun espace demandé: Id manquant.");
        return;
    }

    try {
        space = await getSpace(id);
        if (!space) {
            showError("Cet espace n''existe pas ou n'est plus disponible.");
            return;
        }
        render(space);
    } catch (error) {
        console.error(error);
        showError("Une erreur est survenue lors du chargement de cet espace. Merci de réessayer.");
    }
}
