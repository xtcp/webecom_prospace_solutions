// index.mjs
// Gere la recherche de la page d'accueil, charge les espaces, filtre par URLSearchParams, affiche les animations de chargement,
// met a jour le script JSON-LD selon le result, affiche les messages

import { renderCards } from '../components/card.mjs';
import { bindFavoriteButtons } from './my-spaces.mjs';
import { setLoading } from '../components/loading.mjs';
import { wait } from '../helpers.mjs';

let allSpacesCache = null;
const container = document.getElementById("spaces-card-container");

const selectCity = document.getElementById("search-city");
const selectCapacity = document.getElementById("search-capacity");

const checkboxFiber = document.getElementById("search-option-fiber");
const checkboxPMR = document.getElementById("search-option-pmr");
const checkbox4K = document.getElementById("search-option-4k");

const jsonLd = document.getElementById("jsonld-catalog");

const errorElement = document.getElementById("spaces-error");
const emptyElement = document.getElementById("spaces-empty");

let filters = {}

async function loadAllSpaces() {
// Rôle: Charger les données des espaces
//
// Paramètres: Néant
//
// Retour:
//      allSpacesCache - Données en cache ou données recuperèes du fichier json
    if (allSpacesCache) return allSpacesCache;

    const response = await fetch('/public/assets/data/spaces.json');
    if (!response.ok) {
        throw new Error("Erreur lors du chargement des espaces: " + response.status);
    }
    allSpacesCache = await response.json();
    return allSpacesCache;
}


function updateURL(filters) {
// Rôle: Met a jour l'URL avec les filtres de recherche
//
// Paramètres:
//      filters - L'objet des filtres de recherche

    const params = new URLSearchParams();
    if (filters.city) params.set('ville', filters.city);
    if (filters.capacityTier) params.set('capacite', String(filters.capacityTier));
    if (filters.features.length) params.set('features', filters.features.join(','));

    const query = params.toString();
    const newUrl = window.location.pathname+(query ? `?${query}` : '');
    window.history.replaceState({}, '', newUrl);
}

export function filterSpaces(spaces, filters) {
// Rôle: Filtrer les données de l'objet des espaces avec les filtres indiquées
//
// Paramètres:
//      spaces - L'objet des données des espaces
//      filters - L'objet des filtres de recherche

    return spaces.filter((space) => {
        if (filters.city && space.city !== filters.city) return false;
        if (filters.capacityTier && space.capacityTier !== filters.capacityTier) return false;
        if (filters.features?.length) {
            const hasAll = filters.features.every((code) => space.features?.includes(code));
            if (!hasAll) return false;
        }
        return true;
    });
}

function hasActiveFilters(filters) {
// Rôle: Verifie si les filtres sont vides et retourne true ou false
    return Boolean(filters.city) || Boolean(filters.capacityTier) || (filters.features?.length ?? 0) > 0;
}

function spaceToJSONLDProduct(space) {
// Rôle: Créer les données JSON LD d'un espace
//
// Paramètres:
//      space - L'objet des données de l'espace
//
// Retour:
//      Les données JSON LD en objet

    return {
        '@type': 'Product',
        name: space.name,
        image: space.image,
        description: space.description,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: String(space.pricing?.hour ?? ''),
            priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: String(space.pricing?.hour ?? ''),
                priceCurrency: 'EUR',
                unitText: 'HOUR'
            }
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(space.rating ?? ''),
            reviewCount: String(space.reviewCount ?? '')
        }
    };
}


function updateJSONLD(spaces) {
// Rôle: Mettre a jour le script JSON LD pour le SEO
//
// Paramètres:
//      spaces - L'objet des données des espaces

    if (!jsonLd) return;

    let data;
    try {
        data = JSON.parse(jsonLd.textContent);
    } catch (error) {
        console.error('JSON-LD illisible, mise à jour ignorée :', error);
        return;
    }

    data.hasOfferCatalog = data.hasOfferCatalog ?? { '@type': 'OfferCatalog', name: 'Espaces ProSpace Solutions' };
    data.hasOfferCatalog.itemListElement = spaces.map(spaceToJSONLDProduct);
    jsonLd.textContent = JSON.stringify(data, null, 4);
}

function showError(message) {
// Rôle: Affichee le message d'erreur pour l'accessibilité
//
// Paramètres:
//      message - Le message d'erreur
    if (!errorElement) return;
    errorElement.textContent = message;
    errorElement.hidden = false;
}

function showEmpty(filters) {
// Rôle: Affichee le message d'information de resultats vides pour l'accessibilité
//
// Paramètres:
//      filters - Les filtres de recherche

    if (!emptyElement) return;
    emptyElement.textContent = hasActiveFilters(filters)
        ? "Aucun espace ne correspond à votre recherche. Essayez d'élargir vos critères."
        : "Aucun espace disponible pour le moment.";
    emptyElement.hidden = false;
}


function updateAvailableCount(count) {
// Rôle: Actualise le titre h2 avec les espaces disponibles
//
// Paramètres:
//      count - Le numéro d'espaces
//
// Retour:
//      Néant
    const h2 = document.querySelector(".spaces h2");
    if (!h2) return;
    if (count == 0) {
        h2.textContent = "Aucun espace disponible";
    } else if (count == 1) {
        h2.textContent = count +" espace disponible";
    } else {
        h2.textContent = count +" espaces disponibles";
    }
}

async function runSearch(updateHistory = true) {
// Rôle: Effectue la recherche
//
// Paramètres:
//      count - Le numéro d'espaces
//
// Retour:
//      Néant
    if (!container) return;

    const city = selectCity?.value ?? '';
    const capacityTier = Number(selectCapacity?.value) ?? 0;
    const features = [];

    if (checkboxFiber?.checked) features.push('Fibre');
    if (checkboxPMR?.checked) features.push('PMR');
    if (checkbox4K?.checked) features.push('4K');

    filters = { city, capacityTier, features };
    
    errorElement.setAttribute('hidden', '');
    emptyElement.setAttribute('hidden', '');
    setLoading(container, true);
    if (DEBUG) await wait(800);
    try {
        let spaces = await loadAllSpaces();
        if (hasActiveFilters(filters)) {
            spaces = filterSpaces(spaces, filters);
        }

        if (updateHistory) updateURL(filters);
        updateJSONLD(spaces);
        updateAvailableCount(spaces.length);

        if (spaces.length === 0) {
            container.replaceChildren();
            showEmpty(filters);
            return;
        }

        await renderCards(container, spaces, false);
        bindFavoriteButtons();
    } catch (error) {
        console.error(error);
        container.replaceChildren();
        showError("Une erreur est survenue lors de la recherche des espaces. Merci de réessayer dans un instant.");
    } finally {
        setLoading(container, false);
    }
}

export async function initIndex() {
// Rôle: Initialiser le module: Recuperer les filtres de l'URL et appliquer aux options de recherche
    if (!container) return;

    // Recuperer les filtres de l'URL
    const params = new URLSearchParams(window.location.search);
    const city = params.get("ville") ?? '';
    const capacityTier = Number(params.get("capacite")) || 0;
    const featuresParam = params.get("features");
    const features = featuresParam ? featuresParam.split(',').filter(Boolean) : [];

    filters = { city, capacityTier, features };

    // Appliquer les filtres de l'URL visuelement aux options de recherche
    if (params.toString().length > 0) {
        if (selectCity && city) selectCity.value = city;
        if (selectCapacity && capacityTier) selectCapacity.value = String(capacityTier);

        if (features.includes("Fibre")) {
            const box = checkboxFiber;
            if (box) box.checked = true;
        }
        if (features.includes("PMR")) {
            const box = checkboxPMR;
            if (box) box.checked = true;
        }
        if (features.includes("4K")) {
            const box = checkbox4K;
            if (box) box.checked = true;
        }
    }

    selectCity?.addEventListener('change', () => runSearch());
    selectCapacity?.addEventListener('change', () => runSearch());
    checkboxFiber?.addEventListener('change', () => runSearch());
    checkboxPMR?.addEventListener('change', () => runSearch());
    checkbox4K?.addEventListener('change', () => runSearch());

    await runSearch(false);
}
