// images.mjs
// Gère les images, ces paths et attribue recuperès d'un fichier JSON

let allImages;
let imagesLoaded = false;
let imagesPromise = null;
let erreur = "";

// Recuperer les données JSON du fichier data des images
async function getData() {
// Rôle: Recuperer les données JSON des images
    const url = "/public/assets/data/images.json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur reponse: ${response.status}`);
        }
        const result = await response.json();
        if (!result) {
            throw new Error(`Erreur JSON: ${response.status}`);
        }
        return result;
    } catch (error) {
        erreur = error.message;
        return false;
    }
}

export async function getImage(id) {
// Rôle: Recuperer les données d'une image par id 
//
// Paramètres:
//  id - Id de l'image
//
// Retour:
//  image - Objet image

    if (!imagesLoaded) { await getImages() }
    const image = allImages.find((item) => item.id === id);
    return image;
}

// Verifier si on a dejá recupérée les données ou si on est en train de les recuperer et retourner les donnés ou la promesse
export async function getImages() {
    if (!imagesLoaded) {
        if (!imagesPromise) {
            imagesPromise = getData().then((data) => {
                if (data) {
                    allImages = data;
                    imagesLoaded = true;
                    return allImages;
                } else {
                    console.log(erreur);
                }
            });
        }
        return imagesPromise;
    } else {
        return allImages;
    }
}

export function initImages() {
// Rôle: Initialiser le module et recuperer les images
    getImages();
}