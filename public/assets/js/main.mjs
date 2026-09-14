// main.mjs
// Fichier principale ou sont chargées les modules de JavaScript

import { initSpaces } from './spaces.mjs';
import { initImages } from './images.mjs';

import { initMySpaces } from './my-spaces.mjs';
import { initSearch } from './search.mjs';
import { initContactForm } from './form.mjs';
import { initTeamCarousel } from './carousel.mjs';
import { initSpace } from './space.mjs';
import { initBreadcrumb } from './breadcrumb.mjs';

// Mode deboggage pour afficher les roues de chargement, desactiver en mode production
window.DEBUG = true;

async function init() {

    // fil d'ariane: gère les fils d'ariane (breadcrumb)
    initBreadcrumb();

    // Spaces: gère les espaces (spaces)
    initSpaces();
    
    // Images: gère le chargement des images et attribues
    initImages();

    // Favoris / compteur d'en-tête : utile sur toutes les pages.
    initMySpaces();

    // Recherche dynamique : uniquement si le conteneur de résultats existe (index.html).
    await initSearch();

    // Fiche espace détaillée : uniquement sur espace.html.
    await initSpace();

    // Formulaire de contact : uniquement sur contact.html.
    initContactForm();

    // Carrousel de l'équipe : uniquement sur contact.html.
    await initTeamCarousel();
    
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
