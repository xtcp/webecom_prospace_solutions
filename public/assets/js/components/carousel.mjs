// card.mjs
// Gère le carousel des membres de l'equipe (chargement, rendu, navigation, responsive, aria-live)

import { e } from '../helpers.mjs';

const container = document.getElementById("carousel");

function createCard(member) {
// Rôle: Creation de card pour le carousel de l'equipe
//
// Paramètres:
//  member - Objet avec details du membre  

    const card = document.createElement("div");
    card.classList = "carousel-card";
    card.setAttribute("role", "group");
    card.setAttribute("aria-label", e(member.name) + ", "+e(member.role));
    const imageDiv = document.createElement("div");
    imageDiv.classList = "carousel-card-image";
    const image = document.createElement("img");
    image.setAttribute("src", e(member.image));
    image.setAttribute("alt", "Une photo de profil de " + e(member.name));
    image.setAttribute("loading", "lazy");
    const imageHover = document.createElement("div");
    imageHover.classList = "carousel-card-image-hover-gradiant";
    imageDiv.append(image, imageHover);

    const personName = document.createElement("p");
    personName.textContent = member.name;
    const personRole = document.createElement("p");
    personRole.textContent = member.role;

    const link = document.createElement("a");
    link.classList = "carousel-card-mail";
    link.setAttribute("aria-label", "Envoyer un e-mail à " + e(member.name));
    link.href = "mailto:" + e(member.email);
    link.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>';
    const linkText = document.createElement("span");
    linkText.textContent = "Contacter";
    link.appendChild(linkText);
    card.append(imageDiv, personName, personRole, link);

    return card;
}
function createDot(buttonIndex, currentIndex, total) {
// Rôle: Creation des points pour la navigation du carouse
//
// Paramètres:
//  buttonIndex - Index du point
//  currentIndex - Index actuel
//  total - Total de cards/points de navigation
//
// Retour:
//  button - Objet du button crée

    const button = document.createElement("button");
    button.classList = "btn-carousel-dot " + ((buttonIndex === currentIndex) ? "btn-carousel-dot-active" : "");
    button.setAttribute("data-carousel-dot", buttonIndex);
    button.setAttribute("aria-label", "Aller au groupe "+ (buttonIndex + 1) + " sur " + total);
    button.setAttribute("aria-current", (buttonIndex === currentIndex) ? "true" : "false");
    return button;
}
class TeamCarousel {

    constructor(container, members) {
        this.container = container;
        this.members = members;
        this.index = 0;

        this.grid = document.getElementById("carousel-grid");
        this.prevButton = document.getElementById("carousel-arrow-prev");
        this.nextButton = document.getElementById("carousel-arrow-next");
        this.liveRegion = document.getElementById("carousel-live");
        this.dotsContainer = document.getElementById("carousel-dots");

        this.render();
        this.bindEvents();
        window.addEventListener('resize', () => this.render());
    }

    getItemsPerView() {
        return window.matchMedia('(min-width: 640px)').matches ? 4 : 2;
    }

    getMaxIndex() {
        const itemsPerView = this.getItemsPerView();
        return Math.max(0, this.members.length - itemsPerView);
    }

    render() {
        if (!this.grid) return;

        this.index = Math.min(this.index, this.getMaxIndex());
        this.grid.replaceChildren();
        this.members.forEach(member => {
            const card = createCard(member);
            this.grid.appendChild(card);
        });
        this.grid.style.transform = '';

        this.updateVisibility();
        this.updateDots();
        this.updateControls();
        this.announceCurrentSlide();
    }

    updateVisibility() {
        const itemsPerView = this.getItemsPerView();
        const cards = Array.from(this.grid.children);
        cards.forEach((card, i) => {
            const visible = i >= this.index && i < this.index + itemsPerView;
            card.hidden = !visible;
        });
    }

    updateDots() {
        if (!this.dotsContainer) return;
        const itemsPerView = this.getItemsPerView();
        const total = Math.max(1, this.members.length - itemsPerView + 1);
        this.dotsContainer.replaceChildren();
        for (let i = 0; i < total; i++) {
            const dot = createDot(i, this.index, total);
            this.dotsContainer.appendChild(dot);
        }
    }

    updateControls() {
        if (this.prevButton) this.prevButton.disabled = this.index <= 0;
        if (this.nextButton) this.nextButton.disabled = this.index >= this.getMaxIndex();
    }

    announceCurrentSlide() {
        if (!this.liveRegion) return;
        const itemsPerView = this.getItemsPerView();
        const visibleMembers = this.members.slice(this.index, this.index + itemsPerView);
        const names = visibleMembers.map((member) => member.name).join(', ');
        this.liveRegion.textContent = "Affichage de : " + names;
    }

    goTo(index) {
        this.index = Math.max(0, Math.min(index, this.getMaxIndex()));
        this.updateVisibility();
        this.updateDots();
        this.updateControls();
        this.announceCurrentSlide();
    }

    bindEvents() {
        this.prevButton?.addEventListener('click', () => this.goTo(this.index - 1));
        this.nextButton?.addEventListener('click', () => this.goTo(this.index + 1));

        this.container.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                this.goTo(this.index - 1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                this.goTo(this.index + 1);
            }
        });

        this.dotsContainer?.addEventListener('click', (event) => {
            const dot = event.target.closest('[data-carousel-dot]');
            if (!dot) return;
            this.goTo(Number(dot.dataset.carouselDot));
        });
    }
}

// Initialiser le module et creation de la classe (TeamCarousel)
export async function initTeamCarousel() {
    
    if (!container) return;

    try {
        const response = await fetch("/public/assets/data/team.json");
        if (!response.ok) {
            throw new Error("Erreur de chargement: " + response.status);
        }
        const members = await response.json();

        new TeamCarousel(container, members);

    } catch (error) {
        console.error(error);
    }
}
