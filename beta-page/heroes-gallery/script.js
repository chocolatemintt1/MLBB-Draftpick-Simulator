import heroesData from '../heroes-gallery/data/heroesData.js';

function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <div class="hero-details"></div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function showHeroDetails(hero) {
    const modal = document.querySelector('.modal') || createModal();
    const heroDetails = modal.querySelector('.hero-details');

    heroDetails.innerHTML = `
        <h2>${hero.name}</h2>
        <img src="${hero.image}" alt="${hero.name}">
        
        <div class="skills-section">
            <h3 class="section-title">Skills</h3>
            <div class="skills-grid">
                ${hero.skills.map(skill => `
                    <div class="skill-item">
                        <img src="${skill.image}" alt="${skill.name}">
                        <p>${skill.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="items-section">
            <h3 class="section-title">Best Items</h3>
            <div class="items-grid">
                ${hero.bestItems.map(item => `
                    <div class="item-card">
                        <img src="${item.image}" alt="${item.name}">
                        <p>${item.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="counters-section">
            <h3 class="section-title">Counters</h3>
            <div class="counters-grid">
                ${hero.counters.map(counter => `
                    <div class="counter-card">
                        <img src="${counter.image}" alt="${counter.name}">
                        <p>${counter.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    modal.style.display = 'block';

    const closeButton = modal.querySelector('.close-button');
    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function populateGallery(filteredHeroes = heroesData) {
    const container = document.querySelector('.container');
    container.innerHTML = ''; // Clear existing content

    // Group heroes by role
    const heroesByRole = filteredHeroes.reduce((acc, hero) => {
        if (!acc[hero.role]) {
            acc[hero.role] = [];
        }
        acc[hero.role].push(hero);
        return acc;
    }, {});

    // Create category for each role
    for (const [role, heroes] of Object.entries(heroesByRole)) {
        const category = document.createElement('div');
        category.className = 'category';
        category.innerHTML = `
            <h2 class="category-title">${role}</h2>
            <div class="heroes-row">
                ${heroes.map(hero => `
                    <div class="hero-card">
                        <img src="${hero.image}" alt="${hero.name}" class="hero-image">
                        <div class="hero-name">${hero.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(category);

        // Add click events to hero cards
        const heroCards = category.querySelectorAll('.hero-card');
        heroCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                showHeroDetails(heroes[index]);
            });
        });
    }
}

function setupSearch() {
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredHeroes = heroesData.filter(hero =>
            hero.name.toLowerCase().includes(searchTerm)
        );
        populateGallery(filteredHeroes);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateGallery();
    setupSearch();
});