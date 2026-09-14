// my-spaces.mjs
// Gère les espaces favoris ("Mes Espaces") via localStorage, et le rendu
// de la page mes_espaces.html, ainsi que l'ajout/retrait d'un
// espace depuis n'importe quelle page (boutons "favoris" sur les cartes).


import { renderCards } from './card.mjs';
import { getSpaces } from './spaces.mjs';
import { wait } from './helpers.mjs';
import { setLoading } from './loading.mjs';


let mySpaceIds;

/** Ajoute un espace aux favoris (idempotent). @param {string} id */
export function addSpace(id) {
// Rôle: Ajouter un espace aux favoris
//
// Paramètres:
//  id - L'id de l'espace a ajouter

    id = Number(id);
    if (!mySpaceIds.includes(id)) {
        mySpaceIds.push(id);
        localStorage.setItem("my-spaces", JSON.stringify(mySpaceIds));
        updateCount();
    }
}
export function isFavorite(id) {
// Rôle: Verifie si un espace est dans mes favoris
//
// Paramètres:
//  id - L'id de l'espace
// 
// Retour
//  Boolean - true si cette espace est dans "mes favoris"
    id = Number(id);
    return mySpaceIds.includes(id);
}
export function removeSpace(id) {
// Rôle: Retirer un espace des favoris
//
// Paramètres:
//  id - L'id de l'espace a retirer

    id = Number(id);
    mySpaceIds = mySpaceIds.filter((temp_id) => temp_id !== id);
    localStorage.setItem("my-spaces", JSON.stringify(mySpaceIds));
    updateCount();
    renderMySpaces();
}

export function toggleSpace(id) {
// Rôle: Ajouter ou retire un espace des favoris selon l'etat (est favorite ou pas)
//
// Paramètres:
//  id - L'id de l'espace
    if (isFavorite(id)) {
        removeSpace(id);
    } else {
        addSpace(id);
    }
}

export function clearSpaces() {
// Rôle: Vider les espaces favoris
    mySpaceIds = [];
    localStorage.setItem("my-spaces", JSON.stringify(mySpaceIds));
}

/* ---------------------------------------------------------------------- */
/* En-tête : compteur "Mes Espaces"                                       */
/* ---------------------------------------------------------------------- */

function updateCount() {
// Mis a jour des compteurs des favorites en Header et page Mes Espaces

    const count = mySpaceIds.length;
    
    // Mis a jour du badge des favorites dans le lien de navigation du header
    const badge = document.getElementById("my_spaces-link-quant");
    if (badge) {
        badge.textContent = count;
    }
    // Mis a jour de aria-label sur le lien Mes Espace du header
    const link = document.getElementById("my_spaces-link");
    if (link) {
        let messageAria = count > 1 ? `Mes Espaces, ${count} espaces enregistrés` : "Mes Espaces, aucun espace enregistré en favorite";
        link.setAttribute('aria-label', messageAria);
    }
    // Mis a jour du span en "page-info"
    const countSpan = document.querySelector("#my_spaces-quant");
    if (!countSpan) return;
    countSpan.textContent = count > 1 ? `${count} espaces dans votre sélection` : "Aucun espace enregistré en favorite";    
}


export function bindFavoriteButtons() {
// Mis a jour des "binds" des boutons favorites (page d'accueil et page Mes Espaces)

    document.querySelectorAll(".toggle-favorite").forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            if (!id) return;
            toggleSpace(id);
            const active = isFavorite(id);
            button.classList.toggle('space-card-image-favorite-active', active);
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
            const isSpace = document.getElementById("space");
            if (isSpace) {
                const favoriteButtonText = document.querySelector("#toggle-favorite span");
                favoriteButtonText.textContent = isFavorite(id) ? "Retirer de mes Favoris" : "Sauvegarder en Favoris";
            }
            return;
        });
    });
    document.querySelectorAll(".remove-space").forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            if (!id) return;
            removeSpace(id);
            return;
        });
    });
}


const container = document.getElementById("space-card-horizontal-container");



export async function renderMySpaces() {
// Rôle: Afficher les espaces en favoris (Mes Espaces
    if (!container) return;

    setLoading(container, true);
    if (DEBUG) await wait(800);
    try {

        if (mySpaceIds.length === 0) {
            container.replaceChildren();
            empty?.removeAttribute('hidden');
            return;
        }
        const allSpaces = await getSpaces();
        const mySpaces = mySpaceIds
            .map((id) => allSpaces.find((space) => space.id === id))
            .filter(Boolean);
        if (mySpaces.length === 0) {
            container.replaceChildren();
            empty?.removeAttribute('hidden');
            return;
        }
        await renderCards(container, mySpaces, true);
        bindFavoriteButtons();
    } catch (err) {
        console.error(err);
        container.replaceChildren();
    } finally {
        setLoading(container, false);
    }
}

export function initMySpaces() {
// Rôle: Initialisation du module, met a jour le compteur 
    mySpaceIds = JSON.parse(localStorage.getItem("my-spaces")) ?? [];
    updateCount();

    const emptyButton = document.getElementById("empty-favorites");
    if (emptyButton) {
        emptyButton.addEventListener('click', () => {
            if (mySpaceIds.length === 0) return;
            const confirmed = window.confirm("Voulez-vous vraiment effacer tous vos espaces enregistrés ?");
            if (confirmed) {
                clearSpaces();
            }
        });
    }
    
    if (container) {
        renderMySpaces();
    }
}
