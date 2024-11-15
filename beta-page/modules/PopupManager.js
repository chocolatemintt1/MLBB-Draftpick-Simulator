// PopupManager.js
export class PopupManager {
    constructor() {
        this.overlay = document.getElementById('overlay');
        this.howToPlayPopup = document.getElementById('howToPlayPopup');
        this.setupEventListeners();
    }

    setupEventListeners() {
        const howToPlayLink = document.getElementById('howToPlayLink');
        if (howToPlayLink) {
            howToPlayLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPopup();
            });
        }

        const closeButton = this.howToPlayPopup.querySelector('.popup-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closePopup());
        }

        this.overlay.addEventListener('click', () => this.closePopup());
    }

    showPopup() {
        this.overlay.style.display = 'block';
        this.howToPlayPopup.style.display = 'block';
    }

    closePopup() {
        this.overlay.style.display = 'none';
        this.howToPlayPopup.style.display = 'none';
    }
}