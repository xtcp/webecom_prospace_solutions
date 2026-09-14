// main.mjs
// Fichier principale ou sont chargées les modules de JavaScript

// Les modeles
import { initSpaces } from './models/spaces.mjs';
import { initImages } from './models/images.mjs';

// Les pages
import { initMySpaces } from './pages/my-spaces.mjs';
import { initIndex } from './pages/index.mjs';
import { initSpace } from './pages/space.mjs';

// Les composants
import { initContactForm } from './components/form.mjs';
import { initTeamCarousel } from './components/carousel.mjs';
import { initBreadcrumb } from './components/breadcrumb.mjs';
import { initNavigation } from './components/navigation.mjs';

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
    await initIndex();

    // Fiche espace détaillée : uniquement sur espace.html.
    await initSpace();

    // Formulaire de contact : uniquement sur contact.html.
    initContactForm();

    // Gestion de navigation de header.html
    initNavigation();

    // Carrousel de l'équipe : uniquement sur contact.html.
    await initTeamCarousel();
    
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
