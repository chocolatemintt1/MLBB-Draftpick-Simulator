export class UI {
    constructor(gameState, draftLogic, teamStrategies) {
        this.gameState = gameState;
        this.draftLogic = draftLogic;
        this.teamStrategies = teamStrategies;
        this.initializeElements();
        this.setupEventListeners();
        this.showDesktopViewNotice();
    }

    initializeElements() {
        this.heroPool = document.getElementById('heroPool');
        this.teamSelect = document.getElementById('teamSelect');
        this.startButton = document.getElementById('startGame');
        this.phaseIndicator = document.querySelector('.phase-indicator');
        this.enemyTeamName = document.getElementById('enemyTeamName');
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startDraft());
        this.heroPool.addEventListener('click', (e) => this.handleHeroClick(e));
    }

    showDesktopViewNotice() {
        const notice = document.createElement('div');
        notice.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; 
                        border-radius: 10px; text-align: center; z-index: 1000;">
                        <p>Coding still in progress, you might experience some buttons are not functioning</p>
                <p>For the best viewing experience, please switch to desktop view.</p>
                <button onclick="this.parentElement.style.display='none';" 
                        style="background-color: #ffd700; color: black; border: none; 
                               padding: 10px 20px; margin-top: 10px; cursor: pointer;">
                    Got it!
                </button>
            </div>
        `;
        document.body.appendChild(notice);
    }

    startDraft() {
        this.gameState.selectedEnemy = this.teamSelect.value;
        if (this.gameState.selectedEnemy === 'player') {
            alert('Please select an enemy team!');
            return;
        }

        this.gameState.phase = 'ban';
        this.enemyTeamName.textContent = this.teamStrategies[this.gameState.selectedEnemy].name;
        this.startButton.style.display = 'none';
        this.teamSelect.style.display = 'none';
        this.updateDisplay();
    }

    handleHeroClick(event) {
        const heroElement = event.target.closest('.hero');
        if (!heroElement) return;

        const heroId = heroElement.dataset.heroId;
        if (this.draftLogic.processPlayerSelection(heroId)) {
            this.draftLogic.processAITurn();
            this.updateDisplay();
            this.checkGameEnd();
        }
    }

    getHeroById(heroId) {
        return this.draftLogic.heroes.find(hero => hero.id === heroId);
    }

    renderHeroPool() {
        this.heroPool.innerHTML = '';
        const sortedHeroes = this.sortHeroesByRole(this.draftLogic.heroes);

        sortedHeroes.forEach(hero => {
            const heroElement = document.createElement('div');
            heroElement.className = 'hero';
            heroElement.dataset.heroId = hero.id;

            const isUnavailable = !this.gameState.isHeroAvailable(hero.id);
            if (isUnavailable) {
                heroElement.classList.add('banned');
            }

            heroElement.innerHTML = `
                    <div class="hero-card ${isUnavailable ? 'banned' : ''}">
                        <img src="${hero.image}" alt="${hero.name}" class="hero-image">
                        <div class="hero-info">
                            <div class="hero-name">${hero.name}</div>
                            <div class="hero-role">${hero.role}</div>
                        </div>
                    </div>
                `;

            this.heroPool.appendChild(heroElement);
        });
    }

    sortHeroesByRole(heroes) {
        const roleOrder = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
        return heroes.sort((a, b) => {
            const roleA = roleOrder.indexOf(a.role);
            const roleB = roleOrder.indexOf(b.role);
            if (roleA !== roleB) {
                return roleA - roleB;
            }
            return a.name.localeCompare(b.name);
        });
    }

    renderSlot(heroId, type) {
        if (!heroId) return `<div class="${type}-slot empty"></div>`;

        const hero = this.getHeroById(heroId);
        if (!hero) return `<div class="${type}-slot empty"></div>`;

        return `
                <div class="${type}-slot">
                    <img src="${hero.image}" alt="${hero.name}" class="slot-image">
                    <div class="slot-name">${hero.name}</div>
                </div>
            `;
    }

    updateTeamDisplays() {
        document.getElementById('playerBans').innerHTML =
            this.gameState.playerBans.map(heroId => this.renderSlot(heroId, 'ban')).join('');

        document.getElementById('enemyBans').innerHTML =
            this.gameState.enemyBans.map(heroId => this.renderSlot(heroId, 'ban')).join('');

        document.getElementById('playerPicks').innerHTML =
            this.gameState.playerPicks.map(heroId => this.renderSlot(heroId, 'pick')).join('');

        document.getElementById('enemyPicks').innerHTML =
            this.gameState.enemyPicks.map(heroId => this.renderSlot(heroId, 'pick')).join('');
    }

    updateDisplay() {
        this.renderHeroPool();
        this.updatePhaseIndicator();
        this.updateTeamDisplays();
    }

    updatePhaseIndicator() {
        let phase = '';
        if (this.gameState.phase === 'ban') {
            phase = `Banning Phase - ${this.gameState.currentTurn === 'player' ? 'Your' : 'Enemy'} turn`;
        } else if (this.gameState.phase === 'pick') {
            phase = `Picking Phase - ${this.gameState.currentTurn === 'player' ? 'Your' : 'Enemy'} turn`;
        }
        this.phaseIndicator.textContent = phase;
    }

    checkGameEnd() {
        if (this.gameState.playerPicks.length === 5 && this.gameState.enemyPicks.length === 5) {
            const result = this.draftLogic.evaluateDraft();
            alert(result);
            this.gameState.reset();
            this.updateDisplay();
            this.startButton.style.display = 'block';
            this.teamSelect.style.display = 'block';
        }
    }
}
