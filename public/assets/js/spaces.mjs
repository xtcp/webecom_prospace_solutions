// spaces.mjs
// Gère la persistance des espaces favoris (Mes Espaces) via localStorage,
// le rendu de la page mes_espaces.html et les favorites (ajouter, effacer)

let allSpaces;
let spacesLoaded = false;
let spacesPromise = null;
let erreur = "";


async function getData() {
// Rôle: Recuperer les données JSON du fichier data des espaces
    const url = "/public/assets/data/spaces.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erreur reponse: " + response.status);
        }
        const result = await response.json();
        if (!result) {
            throw new Error("Erreur JSON: " + response.status);
        }
        return result;
    } catch (error) {
        erreur = error.message;
        return false;
    }
}
export async function getSpaces() {
// Rôle: Verifier si on a dejá recupérée les données ou si on est en train de les recuperer et retourner les donnés ou la promesse

    if (!spacesLoaded) {
        if (!spacesPromise) {
            spacesPromise = getData().then((data) => {
                if (data) {
                    allSpaces = data;
                    spacesLoaded = true;
                    return allSpaces;
                } else {
                    console.log(erreur);
                }
            });
        }
        return spacesPromise;
    } else {
        return allSpaces;
    }
}

export async function getSpace(id) {
// Rôle: Recuperer les données d'un espace par id 
// Paramètres:
//  id - Id de l'espace a recuperer
//
// Retour:
//  space - Objet de l'espace

    if (!spacesLoaded) {
        await getSpaces();
    }
    return allSpaces.find((item) => String(item.id) === String(id));    
}

export function initSpaces() {
// Rôle: Initialiser le module et recuperer les espaces
    getSpaces();
}
