export class UI {
    constructor(gameState, draftLogic, teamStrategies, roleOrder) {
        this.gameState = gameState;
        this.draftLogic = draftLogic;
        this.teamStrategies = teamStrategies;
        this.roleOrder = roleOrder;
        this.currentFilter = null;
        this.initializeElements();
        this.setupEventListeners();
        this.showDesktopViewNotice();
        this.hideHeroPool();

        this.teamLogos = {
            blacklist: 'assets/teams/blacklist.png',
            echo: 'assets/teams/tlph.png',
            onic: 'assets/teams/fnop.png',
            ap: 'assets/teams/apbren.png',
            tnc: 'assets/teams/tnc.png',
            aurora: 'assets/teams/aurora.png',
            rsg: 'assets/teams/rsg.png',
            omg: 'assets/teams/omg.png',
        };
    }

    hideHeroPool() {
        this.heroPool.style.display = 'none';
        this.roleFilters.style.display = 'none';
    }

    showHeroPool() {
        this.heroPool.style.display = 'grid';
        this.roleFilters.style.display = 'flex';
    }

    initializeElements() {
        this.heroPool = document.getElementById('heroPool');
        this.teamSelect = document.getElementById('teamSelect');
        this.startButton = document.getElementById('startGame');
        this.phaseIndicator = document.querySelector('.phase-indicator');
        this.enemyTeamName = document.getElementById('enemyTeamName');
        this.roleFilters = document.getElementById('roleFilters');
        this.heroPool = document.getElementById('heroPool');
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startDraft());
        this.heroPool.addEventListener('click', (e) => this.handleHeroClick(e));
        this.roleFilters.addEventListener('click', (e) => this.handleRoleFilter(e));
    }

    handleRoleFilter(event) {
        const role = event.target.dataset.role;
        if (role) {
            this.currentFilter = this.currentFilter === role ? null : role;
            this.updateRoleFilters();
            this.renderHeroPool();
        }
    }

    updateRoleFilters() {
        const buttons = this.roleFilters.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.dataset.role === this.currentFilter) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    renderRoleFilters() {
        this.roleFilters.innerHTML = '';
        this.roleOrder.forEach(role => {
            const button = document.createElement('button');
            button.textContent = role;
            button.dataset.role = role;
            this.roleFilters.appendChild(button);
        });
    }

    showDesktopViewNotice() {
        const notice = document.createElement('div');
        notice.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; 
                        border-radius: 10px; text-align: center; z-index: 1000;">
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

        const enemyLogo = document.getElementById('enemyTeamLogo');
        enemyLogo.src = this.teamLogos[this.gameState.selectedEnemy];

        this.startButton.style.display = 'none';
        this.teamSelect.style.display = 'none';
        this.showHeroPool();
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

        const heroesToRender = this.currentFilter
            ? this.draftLogic.heroes.filter(hero => hero.role === this.currentFilter)
            : this.draftLogic.heroes;

        heroesToRender.forEach(hero => {
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
        this.renderRoleFilters();
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

    displayDraftResults(evaluation) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'draft-results';
        
        const formatStat = (stat) => (stat * 10).toFixed(1);
        
        resultsDiv.innerHTML = `
            <div class="results-header">
                <h2>Draft Analysis</h2>
                <p>${evaluation.winner === 'player' ? 
                    `Your team has an advantage of ${(evaluation.advantage * 10).toFixed(1)}%` : 
                    `Enemy team has an advantage of ${(evaluation.advantage * 10).toFixed(1)}%`}</p>
            </div>
            
            <div class="team-stats-comparison">
                <div class="stats-column">
                    <h3>Your Team</h3>
                    <ul>
                        <li>Early-Mid Game: ${formatStat(evaluation.playerStats.earlyMidGame)}/10</li>
                        <li>Late Game: ${formatStat(evaluation.playerStats.lateGame)}/10</li>
                        <li>Damage Potential: ${formatStat(evaluation.playerStats.damage)}/10</li>
                        <li>Survival Potential: ${formatStat(evaluation.playerStats.survival)}/10</li>
                        <li>Crowd Control: ${formatStat(evaluation.playerStats.crowdControl)}/10</li>
                        <li>Push Potential: ${formatStat(evaluation.playerStats.push)}/10</li>
                        <li>Team Coordination: ${formatStat(evaluation.playerStats.coordination)}/10</li>
                    </ul>
                </div>
                
                <div class="stats-column">
                    <h3>Enemy Team</h3>
                    <ul>
                        <li>Early-Mid Game: ${formatStat(evaluation.enemyStats.earlyMidGame)}/10</li>
                        <li>Late Game: ${formatStat(evaluation.enemyStats.lateGame)}/10</li>
                        <li>Damage Potential: ${formatStat(evaluation.enemyStats.damage)}/10</li>
                        <li>Survival Potential: ${formatStat(evaluation.enemyStats.survival)}/10</li>
                        <li>Crowd Control: ${formatStat(evaluation.enemyStats.crowdControl)}/10</li>
                        <li>Push Potential: ${formatStat(evaluation.enemyStats.push)}/10</li>
                        <li>Team Coordination: ${formatStat(evaluation.enemyStats.coordination)}/10</li>
                    </ul>
                </div>
            </div>
            
            <div class="analysis-tips">
                <h3>Strategic Analysis</h3>
                <ul>
                    ${evaluation.analysis.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `;

        // Show the results in a modal or dedicated section
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.appendChild(resultsDiv);
        document.body.appendChild(modal);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.onclick = () => modal.remove();
        resultsDiv.appendChild(closeButton);
    }

    checkGameEnd() {
        if (this.gameState.playerPicks.length === 5 && this.gameState.enemyPicks.length === 5) {
            const evaluation = this.draftLogic.evaluateDraft();
            this.displayDraftResults(evaluation);
            
            // Reset game state after showing results
            setTimeout(() => {
                this.gameState.reset();
                this.updateDisplay();
                this.startButton.style.display = 'block';
                this.teamSelect.style.display = 'block';
            }, 1000);
        }
    }
}
