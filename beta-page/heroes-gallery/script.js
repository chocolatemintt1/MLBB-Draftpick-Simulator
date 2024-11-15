// Import hero data
import heroesData from '../heroes-gallery/data/heroesData.js';

// Touch/mouse tracking variables
let startX;
let isDragging = false;

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

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function createNavigationButtons(heroesRow) {
    const prevButton = document.createElement('button');
    prevButton.className = 'nav-button prev hidden md:flex';
    prevButton.innerHTML = '❮';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'nav-button next hidden md:flex';
    nextButton.innerHTML = '❯';
    
    prevButton.addEventListener('click', () => {
        heroesRow.scrollBy({ left: -heroesRow.offsetWidth * 0.8, behavior: 'smooth' });
    });
    
    nextButton.addEventListener('click', () => {
        heroesRow.scrollBy({ left: heroesRow.offsetWidth * 0.8, behavior: 'smooth' });
    });
    
    // Show/hide buttons based on scroll position
    heroesRow.addEventListener('scroll', () => {
        prevButton.style.display = heroesRow.scrollLeft > 0 ? 'flex' : 'none';
        nextButton.style.display = 
            heroesRow.scrollLeft < (heroesRow.scrollWidth - heroesRow.clientWidth - 10) 
            ? 'flex' : 'none';
    });
    
    return { prevButton, nextButton };
}

function handleStart(e) {
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    isDragging = true;
}

function handleMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const diffX = startX - currentX;
    
    if (Math.abs(diffX) > 50) {
        const heroesRow = e.currentTarget;
        if (diffX > 0) {
            // Swipe left
            heroesRow.scrollBy({ left: heroesRow.offsetWidth * 0.8, behavior: 'smooth' });
        } else {
            // Swipe right
            heroesRow.scrollBy({ left: -heroesRow.offsetWidth * 0.8, behavior: 'smooth' });
        }
        isDragging = false;
    }
}

function handleEnd() {
    isDragging = false;
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
        heroesRowContainer.className = 'heroes-row-container relative';

        const heroesRow = document.createElement('div');
        heroesRow.className = 'heroes-row';

        // Create hero cards
        heroesRow.innerHTML = heroes.map(hero => `
            <div class="hero-card">
                <img src="${hero.image}" alt="${hero.name}" class="hero-image">
                <div class="hero-name">${hero.name}</div>
            </div>
        `).join('');

        // Create and add navigation buttons
        const { prevButton, nextButton } = createNavigationButtons(heroesRow);
        heroesRowContainer.appendChild(prevButton);
        heroesRowContainer.appendChild(heroesRow);
        heroesRowContainer.appendChild(nextButton);

        category.innerHTML = `<h2 class="category-title">${role}</h2>`;
        category.appendChild(heroesRowContainer);
        container.appendChild(category);

        // Add touch events for mobile
        heroesRow.addEventListener('touchstart', handleStart, { passive: false });
        heroesRow.addEventListener('touchmove', handleMove, { passive: false });
        heroesRow.addEventListener('touchend', handleEnd);

        // Add mouse events for desktop drag
        heroesRow.addEventListener('mousedown', handleStart);
        heroesRow.addEventListener('mousemove', handleMove);
        heroesRow.addEventListener('mouseup', handleEnd);
        heroesRow.addEventListener('mouseleave', handleEnd);

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