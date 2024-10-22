export class UI {
    constructor(gameState, draftLogic, teamStrategies, roleOrder, teamAnalysis) {
        this.gameState = gameState;
        this.draftLogic = draftLogic;
        this.teamStrategies = teamStrategies;
        this.roleOrder = roleOrder;
        this.teamAnalysis = teamAnalysis;
        this.currentFilter = null;
        this.initializeElements();
        this.setupEventListeners();
        this.showDesktopViewNotice();
        this.hideHeroPool();
        this.addFloatingRefreshButton();
        this.updateTeamCompositionDisplay(); // New method
        this.countdownTimer = null;
        this.aiThinkingTime = { min: 3000, max: 8000 };


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

    updateTeamCompositionDisplay() {
        const playerComp = document.getElementById('playerComposition');
        const enemyComp = document.getElementById('enemyComposition');

        if (playerComp && enemyComp) {
            const strategy = this.teamStrategies[this.gameState.selectedEnemy];
            const playerRoles = this.draftLogic.getMissingRoles(this.gameState.playerPicks);
            const enemyRoles = this.draftLogic.getMissingRoles(this.gameState.enemyPicks);

            playerComp.innerHTML = `
                <div class="composition-info">
                    <h4>Missing Roles:</h4>
                    <ul>${playerRoles.map(role => `<li>${role}</li>`).join('')}</ul>
                </div>
            `;

            enemyComp.innerHTML = `
                <div class="composition-info">
                    <h4>Enemy Missing Roles:</h4>
                    <ul>${enemyRoles.map(role => `<li>${role}</li>`).join('')}</ul>
                </div>
            `;
        }
    }

    async processAITurn() {
        if (this.gameState.currentTurn === 'enemy') {
            this.showAIThinking();
            await this.simulateAIThinking();
            this.hideAIThinking();

            const selectedId = this.draftLogic.processAITurn();
            this.updateDisplay();

            if (!this.checkGameEnd()) {
                this.startCountdown();
            }
        }
    }

    showAIThinking() {
        const thinkingElement = document.createElement('div');
        thinkingElement.id = 'ai-thinking';
        thinkingElement.innerHTML = `
            <div class="thinking-indicator">
                <span>Opponent is thinking</span>
                <div class="dot-animation">
                    <span>.</span><span>.</span><span>.</span>
                </div>
            </div>
        `;
        document.body.appendChild(thinkingElement);
    }

    hideAIThinking() {
        const thinkingElement = document.getElementById('ai-thinking');
        if (thinkingElement) {
            thinkingElement.remove();
        }
    }

    simulateAIThinking() {
        const thinkingTime = Math.floor(
            Math.random() * (this.aiThinkingTime.max - this.aiThinkingTime.min + 1) + this.aiThinkingTime.min
        );
        return new Promise(resolve => setTimeout(resolve, thinkingTime));
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

    addFloatingRefreshButton() {
        const refreshButton = document.createElement('button');
        refreshButton.id = 'floatingRefreshButton';
        refreshButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>';
        refreshButton.title = "Refresh Game";
        refreshButton.addEventListener('click', () => this.refreshGame());
        document.body.appendChild(refreshButton);
    }

    refreshGame() {
        location.reload();
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

    async startDraft() {
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
        this.startCountdown();

        this.updateDisplay();
        if (this.gameState.currentTurn === 'enemy') {
            await this.processAITurn();
        } else {
            this.startCountdown();
        }
    }

    startCountdown() {
        this.timeLeft = 60;
        this.updateCountdownDisplay();
        this.countdownTimer = setInterval(() => {
            this.timeLeft--;
            this.updateCountdownDisplay();
            if (this.timeLeft <= 0) {
                this.handleTimeout();
            }
        }, 2500);
    }

    handleTimeout() {
        clearInterval(this.countdownTimer);
        if (this.gameState.currentTurn === 'player') {
            // Auto-select a hero for the player
            const availableHeroes = this.draftLogic.heroes.filter(hero =>
                this.gameState.isHeroAvailable(hero.id)
            );
            if (availableHeroes.length > 0) {
                const randomHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
                this.draftLogic.processPlayerSelection(randomHero.id);
            }
        }
        this.processAITurn();
        //this.draftLogic.processAITurn();
        this.updateDisplay();
        this.checkGameEnd();
        if (!this.checkGameEnd()) {
            this.startCountdown();
        }
    }

    updateCountdownDisplay() {
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = `Time left: ${this.timeLeft}s`;
    }

    handleHeroClick(event) {
        const heroElement = event.target.closest('.hero');
        if (!heroElement) return;

        const heroId = heroElement.dataset.heroId;
        if (this.draftLogic.processPlayerSelection(heroId)) {
            clearInterval(this.countdownTimer);
            this.processAITurn(); // Use the new async method
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
        this.updateCountdownDisplay();
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
        const existingResults = document.querySelector('.modal');
        if (existingResults) {
            existingResults.remove();
        }

        const analysisResult = this.teamAnalysis.analyzeDraft(
            this.gameState.playerPicks,
            this.gameState.enemyPicks
        );

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'draft-results';

        const formatStat = (stat) => (stat * 10).toFixed(1);
        const advantagePercentage = analysisResult.advantage.advantage * 100;

        // Generate the draft message based on advantage percentage
        let draftMessage = '';
        if (analysisResult.advantage.winner === 'enemy' && advantagePercentage > 2.5) {
            draftMessage = `<p class="draft-message draft-message-bad">You didn't draft well</p>`;
        } else if (analysisResult.advantage.winner === 'player' && advantagePercentage > 2.5) {
            draftMessage = `<p class="draft-message draft-message-good">Wow! You're a great coach/analyst</p>`;
        } else if (analysisResult.advantage.winner === 'player' && advantagePercentage < 2.5 || analysisResult.advantage.winner === 'enemy' && advantagePercentage < 2.5) {
            draftMessage = `<p class="draft-message draft-message-draw">It's an even draft, it's up to the mechanics of the players now..</p>`;
        }

        const playerRoles = this.draftLogic.getMissingRoles(this.gameState.playerPicks);
        const enemyRoles = this.draftLogic.getMissingRoles(this.gameState.enemyPicks);

        resultsDiv.innerHTML = `
        <div class="results-header">
            <div class="team-logos-container">
                <div class="draft-title">
                    <h2>Draft Analysis</h2>
                    <p class="advantage-text ${analysisResult.advantage.winner === 'player' ? 'advantage-player' : 'advantage-enemy'}">
                        ${analysisResult.advantage.winner === 'player' ?
                `Your team has an advantage of ${advantagePercentage.toFixed(1)}%` :
                `Enemy team has an advantage of ${advantagePercentage.toFixed(1)}%`}
                    </p>
                    ${draftMessage}
                </div>
            </div>
        </div>
        
        <div class="team-stats-container">
            <div class="team-stats-comparison">
                <div class="stats-column">
                    <h3>Your Team</h3>
                    <ul>
                        <li>
                            <span class="stat-label">Damage:</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${formatStat(analysisResult.playerStats.damage)}%"></div>
                                <span class="stat-value">${formatStat(analysisResult.playerStats.damage)}/100</span>
                            </div>
                        </li>
                        <li>
                            <span class="stat-label">Durability:</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${formatStat(analysisResult.playerStats.durability)}%"></div>
                                <span class="stat-value">${formatStat(analysisResult.playerStats.durability)}/100</span>
                            </div>
                        </li>
                        <li>
                            <span class="stat-label">CC:</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${formatStat(analysisResult.playerStats.cc)}%"></div>
                                <span class="stat-value">${formatStat(analysisResult.playerStats.cc)}/100</span>
                            </div>
                        </li>
                    </ul>
                </div>
                
                <div class="stats-column">
                    <h3>Enemy Team</h3>
                    <ul>
                        <li>
                            <span class="stat-label">Damage:</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${formatStat(analysisResult.enemyStats.damage)}%"></div>
                                <span class="stat-value">${formatStat(analysisResult.enemyStats.damage)}/100</span>
                            </div>
                        </li>
                        <li>
                            <span class="stat-label">Durability:</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${formatStat(analysisResult.enemyStats.durability)}%"></div>
                                <span class="stat-value">${formatStat(analysisResult.enemyStats.durability)}/100</span>
                            </div>
                        </li>
                        <li>
                            <span class="stat-label">CC:</span>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${formatStat(analysisResult.enemyStats.cc)}%"></div>
                                <span class="stat-value">${formatStat(analysisResult.enemyStats.cc)}/100</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="team-compositions">
            <div class="team-comp">
                <h3>Your Team Composition</h3>
                <div class="hero-images">
                    ${this.gameState.playerPicks.map(heroId => {
                    const hero = this.getHeroById(heroId);
                    return `
                            <div class="hero-card">
                                <img src="${hero.image}" alt="${hero.name}" title="${hero.name}" class="hero-image">
                                <span class="hero-name">${hero.name}</span>
                            </div>
                        `;
                }).join('')}
                </div>
            </div>
            <div class="team-comp">
                <h3>Enemy Team Composition</h3>
                <div class="hero-images">
                    ${this.gameState.enemyPicks.map(heroId => {
                    const hero = this.getHeroById(heroId);
                    return `
                            <div class="hero-card">
                                <img src="${hero.image}" alt="${hero.name}" title="${hero.name}" class="hero-image">
                                <span class="hero-name">${hero.name}</span>
                            </div>
                        `;
                }).join('')}
                </div>
            </div>
        </div>
        
        <div class="strategic-advice">
            <h3>Strategic Analysis</h3>
            <ul>
                ${analysisResult.advice.map(tip => `
                    <li class="advice-${tip.type}">${tip.text}</li>
                `).join('')}
            </ul>
        </div>

        <div class="victory-conditions">
            <div class="your-conditions">
                <h3>Your Victory Conditions</h3>
                <ul>
                    ${analysisResult.keyVictoryConditions.player.map(condition =>
                    `<li>${condition}</li>`
                ).join('')}
                </ul>
            </div>
            <div class="enemy-conditions">
                <h3>Enemy Victory Conditions</h3>
                <ul>
                    ${analysisResult.keyVictoryConditions.enemy.map(condition =>
                    `<li>${condition}</li>`
                ).join('')}
                </ul>
            </div>
        </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.appendChild(resultsDiv);
        document.body.appendChild(modal);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'close-button';
        closeButton.onclick = () => {
            modal.remove();
            this.hideHeroPool();
        };
        resultsDiv.appendChild(closeButton);
    }

    checkGameEnd() {
        if (this.gameState.playerPicks.length === 5 && this.gameState.enemyPicks.length === 5) {
            clearInterval(this.countdownTimer);
            const evaluation = this.draftLogic.evaluateDraft();
            this.displayDraftResults(evaluation);

            // Reset game state after showing results
            setTimeout(() => {
                this.gameState.reset();
                this.updateDisplay();
                this.startButton.style.display = 'block';
                this.teamSelect.style.display = 'block';
                this.hideHeroPool();
            }, 1000);
            return true;
        }
        return false;
    }
}
