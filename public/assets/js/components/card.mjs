// card.mjs
//
// Gere la creation et mis en place des cards des espaces en construisant le HTML
// avec les methodes createCard et createCardHorizontal
//

import { e, FEATURE_SVG } from '../helpers.mjs';
import { getImage } from '../models/images.mjs';
import { isFavorite } from '../pages/my-spaces.mjs';
import { createStars } from './stars.mjs'

const LOCATION_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>';
const CAPACITY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
const HEART_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>';
const TRASH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>';


export async function createCard(fragment, space) {
// Rôle: Construit le HTML d'une carte espace (Page Principale)
//
// Paramètres:
//  fragment (objet) - Le fragment a ajouter la card
//  space (objet) - Donnée d'un espace (voir data/spaces.json)

    const url = "/public/pages/espace.html?id="+encodeURIComponent(space.id);
    const isFavoriteCheck = isFavorite(space.id);
    const card = document.createElement("article");
    card.classList = "space-card";

    const imageDiv = document.createElement("div");
    imageDiv.classList = "space-card-image";
    const imageData = await getImage(space.image);
    const image = document.createElement("img");
    image.setAttribute("src", imageData.path);
    image.setAttribute("loading", "lazy");
    image.setAttribute("alt", imageData.alt);
    const imageButton = document.createElement("button");
    imageButton.classList = "space-card-image-favorite "+ (isFavoriteCheck ? "space-card-image-favorite-active" : "") + " toggle-favorite";
    const imageButtonAriaLabel = isFavoriteCheck ? `Retirer ${e(space.name)} de mes espaces` : `Ajouter ${e(space.name)} aux favoris`;
    imageButton.setAttribute("aria-label", imageButtonAriaLabel);
    imageButton.setAttribute("aria-pressed", isFavoriteCheck ? 'true' : 'false');
    imageButton.setAttribute("data-id", e(space.id));
    imageButton.innerHTML = HEART_ICON;
    imageDiv.append(image, imageButton);

    const info = document.createElement("div");
    info.classList = "space-card-info";
    const infoH3 = document.createElement("h3");
    infoH3.textContent = space.name;

    const location = document.createElement("div");
    location.classList = "space-card-location";
    location.innerHTML = LOCATION_ICON;
    const locationText = document.createElement("span");
    locationText.textContent = space.district;
    location.appendChild(locationText);
    const reviews = document.createElement("div");
    reviews.classList = "space-card-reviews";
    const starContainer = createStars(space.rating);
    const reviewsValue = document.createElement("div");
    reviewsValue.classList = "space-card-reviews__value";
    reviewsValue.textContent = space.rating.toFixed(1);
    const reviewsQuant = document.createElement("div");
    reviewsQuant.classList = "space-card-reviews__quant";
    reviewsQuant.textContent = "("+e(space.reviewCount)+" avis)";
    reviews.append(starContainer, reviewsValue, reviewsQuant);
    const features = document.createElement("div");
    features.classList = "space-card-features";
    const featuresCapacity = document.createElement("div");
    featuresCapacity.classList = "space-card-features-capacity";
    featuresCapacity.innerHTML = CAPACITY_ICON;
    const featuresCapacityText = document.createElement("span");
    featuresCapacityText.innerHTML = e(space.capacity)+" pers.";
    const featuresCapacityDot = document.createElement("span");
    featuresCapacityDot.innerHTML = "·";
    featuresCapacity.append(featuresCapacityText, featuresCapacityDot);
    const featuresTags = document.createElement("div");
    featuresTags.classList = "space-card-features-tags";
    
    space.features.forEach((feature) => {
        const featuresTag = document.createElement("div");
        featuresTag.classList = "space-card-features-tag";
        const featuresTagText = document.createElement("span");
        featuresTagText.textContent = feature;
        featuresTag.innerHTML = FEATURE_SVG[feature];
        featuresTag.appendChild(featuresTagText);
        featuresTags.appendChild(featuresTag);
    });
    const priceCTA = document.createElement("div");
    priceCTA.classList = "space-card-price-cta";
    const price = document.createElement("div");
    price.classList = "space-card-price";
    const priceText = document.createElement("span");
    priceText.textContent = space.pricing.hour;
    const priceTextUnit = document.createElement("span");
    priceTextUnit.textContent = "/heure";
    price.append(priceText, priceTextUnit);
    const CTA = document.createElement("div");
    CTA.classList = "space-card-cta";
    const CTAButton = document.createElement("button");
    CTAButton.classList = "btn-primary";
    CTAButton.setAttribute("onclick", "location.href='" +url +"'");
    CTAButton.textContent = "Voir la fiche";
    CTA.appendChild(CTAButton);
    priceCTA.append(price, CTA);


    features.append(featuresCapacity, featuresTags, priceCTA);
    info.append(infoH3, location, reviews, features, priceCTA);
    card.append(imageDiv, info);

    fragment.appendChild(card);

}
export async function createCardHorizontal(fragment, space) {
// Rôle: Construit le HTML d'une carte espace horizontal (Mes Espaces)
//
// Paramètres:
//  fragment (objet) - Le fragment a ajouter la card
//  space (objet) - Donnée d'un espace (voir data/spaces.json)

    const url = "/public/pages/espace.html?id="+encodeURIComponent(space.id);

    const card = document.createElement("article");
    card.classList = "space-card space-card-horizontal";
    const imageDiv = document.createElement("div");
    imageDiv.classList = "space-card-image";
    const imageData = await getImage(space.image);
    const image = document.createElement("img");
    image.setAttribute("src", imageData.path);
    image.setAttribute("loading", "lazy");
    image.setAttribute("alt", imageData.alt);
    imageDiv.appendChild(image);
    const infoContainer = document.createElement("div");
    infoContainer.classList = "space-card-horizontal-info-container";
    const info = document.createElement("div");
    info.classList = "space-card-info";
    const infoH3 = document.createElement("h3");
    infoH3.textContent = space.name;

    const location = document.createElement("div");
    location.classList = "space-card-location";
    location.innerHTML = LOCATION_ICON;
    const locationText = document.createElement("span");
    locationText.textContent = space.district;
    location.appendChild(locationText);

    const features = document.createElement("div");
    features.classList = "space-card-features";
    const featuresCapacity = document.createElement("div");
    featuresCapacity.classList = "space-card-features-capacity";
    featuresCapacity.innerHTML = CAPACITY_ICON;
    const featuresCapacityText = document.createElement("span");
    featuresCapacityText.innerHTML = e(space.capacity)+" pers.";
    featuresCapacity.appendChild(featuresCapacityText);
    const price = document.createElement("div");
    price.classList = "space-card-price space-card-price-small";
    const priceText = document.createElement("span");
    priceText.textContent = space.pricing.hour;
    const priceTextUnit = document.createElement("span");
    priceTextUnit.textContent = "/h";
    price.append(priceText, priceTextUnit);
    const reviews = document.createElement("div");
    reviews.classList = "space-card-reviews";
    const starContainer = createStars(space.rating);
    const reviewsQuant = document.createElement("div");
    reviewsQuant.classList = "space-card-reviews__quant space-card-reviews__quant-small";
    reviewsQuant.textContent = "("+e(space.reviewCount)+")";
    reviews.append(starContainer, reviewsQuant);

    features.append(featuresCapacity, price, reviews);
    const CTA = document.createElement("div");
    CTA.classList = "space-card-horizontal-cta";
    const CTAButton = document.createElement("button");
    CTAButton.classList = "btn-secondary btn-secondary-blue";
    CTAButton.setAttribute("onclick", "location.href='" +url +"'");
    CTAButton.textContent = "Voir la fiche";
    CTA.appendChild(CTAButton);
    const removeButton = document.createElement("button");
    removeButton.classList = "btn-secondary btn-secondary-delete remove-space";
    removeButton.setAttribute("data-id", e(space.id));
    removeButton.setAttribute("aria-label", `Retirer ${e(space.name)} de mes espaces`)
    removeButton.innerHTML = TRASH_ICON;
    const removeButtonText = document.createElement("span");
    removeButtonText.textContent = "Retirer";
    removeButton.appendChild(removeButtonText);
    CTA.appendChild(removeButton);

    info.append(infoH3, location, features);
    infoContainer.append(info, CTA);
    card.append(imageDiv, infoContainer);

    fragment.appendChild(card);
}



export async function renderCards(container, spaces, mySpaces) {
// Rôle: Vide et rend les cards d'espace dans le contenu
//
// Paramètres:
//  container (objet) - Le container (div) ou les cartes seront ajoutées
//  spaces (objet) - Données des espaces (voir data/spaces.json)
//  mySpaces (bool) - Est une card dans la page des favorites (Mes Espaces)
 
    if (!container) return;
    const fragment = document.createDocumentFragment();
    await Promise.all(spaces.map((space) => {

        if (mySpaces) {
            return createCardHorizontal(fragment, space);
        } else {
            return createCard(fragment, space);
        }
    }));
    container.replaceChildren(fragment);
}

