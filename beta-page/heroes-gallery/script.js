import heroesData from '../heroes-gallery/data/heroesData.js';

let startX; // Variable to store the starting X position of the touch or mouse
let isDragging = false; // Flag to check if the user is currently dragging

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

function handleStart(e) {
    startX = e.touches ? e.touches[0].clientX : e.clientX; // Get the initial touch or mouse position
    isDragging = true; // Set dragging to true
}

function handleMove(e) {
    if (!isDragging) return; // If not dragging, exit

    const currentX = e.touches ? e.touches[0].clientX : e.clientX; // Get current position
    const diffX = startX - currentX; // Calculate the difference

    // If the difference is significant enough, we consider it a swipe
    if (Math.abs(diffX) > 50) {
        const heroesRow = e.currentTarget;
        if (diffX > 0) {
            // Swiped left
            heroesRow.scrollBy({ left: heroesRow.offsetWidth * 0.8, behavior: 'smooth' });
        } else {
            // Swiped right
            heroesRow.scrollBy({ left: -heroesRow.offsetWidth * 0.8, behavior: 'smooth' });
        }
        isDragging = false; // Reset dragging
    }
}

function handleEnd() {
    isDragging = false; // Reset dragging on touch or mouse end
}

function populateGallery(filteredHeroes = heroesData) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    const heroesByRole = filteredHeroes.reduce((acc, hero) => {
        if (!acc[hero.role]) {
            acc[hero.role] = [];
        }
        acc[hero.role].push(hero);
        return acc;
    }, {});

    for (const [role, heroes] of Object.entries(heroesByRole)) {
        const category = document.createElement('div');
        category.className = 'category';
        
        const heroesRowContainer = document.createElement('div');
        heroesRowContainer.className = 'heroes-row-container';

        const heroesRow = document.createElement('div');
 //```javascript
        heroesRow.className = 'heroes-row';

        heroesRow.innerHTML = heroes.map(hero => `
            <div class="hero-card">
                <img src="${hero.image}" alt="${hero.name}" class="hero-image">
                <div class="hero-name">${hero.name}</div>
            </div>
        `).join('');

        category.innerHTML = `<h2 class="category-title">${role}</h2>`;
        heroesRowContainer.appendChild(heroesRow);
        category.appendChild(heroesRowContainer);
        container.appendChild(category);

        // Add touch and mouse event listeners for swipe functionality
        heroesRow.addEventListener('touchstart', handleStart);
        heroesRow.addEventListener('touchmove', handleMove);
        heroesRow.addEventListener('touchend', handleEnd);
        heroesRow.addEventListener('mousedown', handleStart);
        heroesRow.addEventListener('mousemove', handleMove);
        heroesRow.addEventListener('mouseup', handleEnd);
        heroesRow.addEventListener('mouseleave', handleEnd); // Handle mouse leaving the area

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