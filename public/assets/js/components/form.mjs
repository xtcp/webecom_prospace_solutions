// form.mjs
//
// Gère le formulaire dynamique (validation, messages d'erreur et confirmation, pré-remplissage)


import { e, wait } from '../helpers.mjs';

const form = document.getElementById("contact-form");
const confirmationElement = document.getElementById("contact-form-confirmation");
// La validation des champs
const VALIDATORS = {
    name: (value) => {
        if (!value.trim()) return "Merci d'indiquer votre nom complet.";
        if (value.trim().length < 2) return "Le nom complet doit contenir au moins 2 caractères.";
        return '';
    },
    email: (value) => {
        if (!value.trim()) return "Merci d'indiquer votre e-mail professionnel.";
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(value.trim())) return "Merci d'indiquer une adresse e-mail valide.";
        return '';
    },
    company: (value) => {
        if (!value.trim()) return "Merci d'indiquer le nom de votre entreprise.";
        return '';
    },
    message: (value) => {
        if (!value.trim()) return "Merci de décrire votre demande.";
        if (value.trim().length < 10) return "Votre message doit contenir au moins 10 caractères.";
        return '';
    },
    subject: (value) => {
        if (!value.trim()) return "Merci de choisir un sujet.";
        return '';
    },
    politique: (checked) => {
        if (!checked) return "Merci d'accepter la politique de confidentialité pour continuer.";
    }
};


function setFieldError(field, message) {
// Rôle: Modifier le message d'erreur d'un champ et le aria-invalid 
//
// Paramètres:
//  field - L'element du champ
//  message - Le message d'erreur

    const errorElement = document.getElementById(field.name+"-error")

    if (message) {
        errorElement.textContent = message;
        errorElement.hidden = false;
        field.setAttribute('aria-invalid', 'true');
    } else {
        errorElement.textContent = '';
        errorElement.hidden = true;
        field.removeAttribute('aria-invalid');
    }

}

function validateField(name) {
// Rôle: Validation d'un champ (en utilisant VALIDATORS)
//
// Paramètres:
//  name - Nom du champ
//
// Retour:
//  !message - True si message vide, false si message contient une erreur
    const field = document.getElementById(name);
    if (!field) return true;

    const isCheckbox = field.type === 'checkbox';
    if (!VALIDATORS[name]) return true;
    const validator = VALIDATORS[name];
    const message = validator(isCheckbox ? field.checked : field.value ?? '');
    setFieldError(field, message);

    // Retourne true si le message est vide
    return !message;
}

function validateAll() {
// Valider toute les champs du formulaire au moment d'envoyer (en utilisant VALIDATORS)
    let isValid = true;
    let firstInvalidField = null;
    const allFieldNames = [...Object.keys(VALIDATORS)];

    allFieldNames.forEach((name) => {
        const fieldIsValid = validateField(name);
        if (!fieldIsValid && !firstInvalidField) {
            firstInvalidField = document.getElementById(name);
        }
        isValid = isValid && fieldIsValid;
    });

    if (firstInvalidField) {
        firstInvalidField.focus();
    }

    return isValid;
}

function bindValidation() {
    
// Les binds des evenement 'change' ou 'input' pour lancer les validations
// au moment de modification des champs du formulaire

    const allFieldNames = [...Object.keys(VALIDATORS)];

    allFieldNames.forEach((name) => {
        const field = document.getElementById(name);

        if (!field) return;

        const revalidate = () => validateField(name);
        field.addEventListener('blur', revalidate);
        field.addEventListener(field.type === 'checkbox' ? 'change' : 'input', () => {
            // Une fois qu'une erreur est affichée, on revalide en direct
            // dès que l'utilisateur corrige le champ.
            if (field.getAttribute('aria-invalid') === 'true') {
                revalidate();
            }
        });
    });
}


async function submitContactForm(payload) {
    if (DEBUG) await wait(600);
    // Envoi du formulaire a ajouter ici
    return;
}

async function handleSubmit(event) {
    
// Event listener submit de formulaire, traite les données et validation au
//  clique sur Envoyer
    event.preventDefault();

    if (!validateAll()) {
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.dataset.originalLabel = submitButton.dataset.originalLabel ?? submitButton.textContent;
            submitButton.textContent = "Envoi en cours…";
        }

        await submitContactForm(payload);

        form.reset();
        [...Object.keys(VALIDATORS)].forEach((name) => {
            const field = document.getElementById(name);
            if (field) setFieldError(field, '');
        });
    } catch (error) {
        console.error(error);
        confirmationElement.textContent = "Une erreur est survenue lors de l'envoi. Merci de réessayer.";
        confirmationElement.classList = "form-confirmation form-confirmation-error";
        confirmationElement.hidden = false;
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = submitButton.dataset.originalLabel ?? "Envoyer";
        }
        
        confirmationElement.textContent = `Merci ${e(name)}, votre message a bien été envoyé. Notre équipe vous recontactera très rapidement.`;
        confirmationElement.classList = "form-confirmation";
        confirmationElement.hidden = false;
    }
}

export function initContactForm() {
    if (!form) return;

    // Evite la validation de HTML5/navigateur
    form.setAttribute('novalidate', '');
    
    // Rempli l'input caché avec l'id de l'espace concernant le contact
    const params = new URLSearchParams(window.location.search);
    const spaceId = params.get('espace');
    if (spaceId) {
        const space = document.getElementById('space');
        if (space) space.value = spaceId;
    }
    bindValidation();
    form.addEventListener('submit', handleSubmit);
}
