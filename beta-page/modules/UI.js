export class UI {
    constructor(gameState, draftLogic, teamStrategies, roleOrder, teamAnalysis) {
        this.gameState = gameState;
        this.draftLogic = draftLogic;
        this.teamStrategies = teamStrategies;
        this.roleOrder = ['ALL', ...roleOrder];
        this.teamAnalysis = teamAnalysis;
        this.currentFilter = 'ALL';
        this.playerSide = 'blue';
        this.countdownTimer = null;
        this.timeLeft = 40;
        this.aiThinkingTime = { min: 3000, max: 8000 };
        this.maxBansPerTeam = 5;
        this.notificationTimeout = null;
        this.floatingTimer = null;
        this.lastScrollY = 0;
        this.draftAreaObserver = null;

        // Define static properties
        this.roleColors = {
            'ALL': 'rgba(128, 128, 128, 0.2)',
            'Tank': 'rgba(255, 165, 0, 0.2)',
            'Mage': 'rgba(0, 127, 255, 0.2)',
            'Assassin': 'rgba(128, 0, 128, 0.2)',
            'Marksman': 'rgba(255, 215, 0, 0.2)',
            'Support': 'rgba(0, 128, 0, 0.2)',
            'Fighter': 'rgba(255, 0, 0, 0.2)'
        };

        this.teamLogos = {
            blacklist: '../assets/teams/blacklist.png',
            echo: '../assets/teams/tlph.png',
            onic: '../assets/teams/fnop.png',
            ap: '../assets/teams/apbren.png',
            tnc: '../assets/teams/tnc.png',
            aurora: '../assets/teams/aurora.png',
            rsg: '../assets/teams/rsg.png',
            omg: '../assets/teams/omg.png'
        };

        this.initializeElements();
        this.setupEventListeners();
        this.hideHeroPool();
        this.addFloatingRefreshButton();
        this.updateTeamCompositionDisplay();
        this.showNotice();
    }

    // DOM Element Getters
    get heroPool() { return document.getElementById('heroPool'); }
    get teamSelect() { return document.getElementById('teamSelect'); }
    get startButton() { return document.getElementById('startGame'); }
    get phaseIndicator() { return document.querySelector('.phase-indicator'); }
    get enemyTeamName() { return document.getElementById('enemyTeamName'); }
    get roleFilters() { return document.getElementById('roleFilters'); }

    getRoleColor(role) {
        return this.roleColors[role] || 'transparent';
    }

    showTurnNotification() {
        // Clear any existing notification
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
            const existingNotification = document.querySelector('.turn-notification');
            if (existingNotification) {
                existingNotification.remove();
            }
        }

        const notification = document.createElement('div');
        notification.className = 'turn-notification';
        
        const phase = this.gameState.phase === 'ban' ? 'BAN' : 'PICK';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-text">YOUR TURN TO ${phase}!</div>
            </div>
        `;

        document.body.appendChild(notification);

        // Add CSS animation class after a brief delay
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove the notification after 3 seconds
        this.notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500); // Wait for fade out animation
        }, 3000);
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
        if (this.gameState.currentTurn !== 'enemy') return;

        this.clearCountdown();

        if (this.shouldTransitionToPick()) {
            this.transitionToPick();
            if (this.gameState.currentTurn === 'player') {
                this.showTurnNotification(); // Add notification when transitioning to player's turn
                this.startCountdown();
                return;
            }
        }

        this.startCountdown();
        await this.simulateAIThinking();

        const selectedId = this.draftLogic.processAITurn();

        if (this.gameState.phase === 'ban') {
            this.currentFilter = 'ALL';
        }

        this.updateDisplay();
        this.scrollToDraftBoard();

        if (!this.checkGameEnd()) {
            if (this.gameState.currentTurn === 'player') {
                this.showTurnNotification(); // Add notification after AI's turn
            }
            this.startCountdown();
        }
    }

    // Add new method to handle scrolling
    scrollToDraftBoard() {
        const draftBoard = document.querySelector('.phase-indicator');
        if (draftBoard) {
            draftBoard.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        const element = document.getElementById('ai-thinking');
        if (element) element.remove();
    }

    async simulateAIThinking() {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.showAIThinking();

        const thinkingTime = Math.floor(
            Math.random() * (this.aiThinkingTime.max - this.aiThinkingTime.min + 1) +
            this.aiThinkingTime.min
        );

        await new Promise(resolve => setTimeout(resolve, thinkingTime));
        this.hideAIThinking();
    }

    hideHeroPool() {
        this.heroPool.style.display = 'none';
        this.roleFilters.style.display = 'none';
    }

    showHeroPool() {
        this.heroPool.style.display = 'grid';
        this.roleFilters.style.display = 'flex';
    }

    createFloatingTimer() {
        // Create floating timer element if it doesn't exist
        if (!this.floatingTimer) {
            this.floatingTimer = document.createElement('div');
            this.floatingTimer.id = 'floatingTimer';
            this.floatingTimer.className = 'floating-timer hidden';
            document.body.appendChild(this.floatingTimer);
        }
    }

    setupScrollHandler() {
        // Create an Intersection Observer to watch the draft area
        const draftArea = document.querySelector('.phase-indicator').parentElement;
        
        this.draftAreaObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // Only show timer when draft area is not visible
                    if (!entry.isIntersecting && this.timeLeft > 0) {
                        this.floatingTimer?.classList.add('visible');
                    } else {
                        this.floatingTimer?.classList.remove('visible');
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: '-100px 0px' // Adds a small buffer zone
            }
        );

        // Start observing the draft area
        this.draftAreaObserver.observe(draftArea);
    }

    initializeElements() {
        this.createSideSelection();
        this.createFloatingTimer();
        this.setupScrollHandler();
    }

    createSideSelection() {
        const sideSelectContainer = document.createElement('div');
        sideSelectContainer.className = 'side-select-container';

        const sideSelect = document.createElement('select');
        sideSelect.id = 'sideSelect';
        sideSelect.className = 'side-select';

        const options = [
            { value: 'blue', text: 'Team First Pick' },
            { value: 'red', text: 'Enemy First Pick' }
        ];

        sideSelect.innerHTML = options.map(opt =>
            `<option value="${opt.value}">${opt.text}</option>`
        ).join('');

        sideSelectContainer.appendChild(sideSelect);
        this.startButton.parentNode.insertBefore(sideSelectContainer, this.startButton);

        sideSelect.addEventListener('change', (e) => {
            this.playerSide = e.target.value;
            this.updateTeamDisplays();
        });
    }

    setupEventListeners() {
        const events = [
            [this.startButton, 'click', () => this.startDraft()],
            [this.heroPool, 'click', (e) => this.handleHeroClick(e)],
            [this.roleFilters, 'click', (e) => this.handleRoleFilter(e)]
        ];

        events.forEach(([element, event, handler]) => {
            element.addEventListener(event, handler);
        });
    }

    addFloatingRefreshButton() {
        const refreshButton = document.createElement('button');
        refreshButton.id = 'floatingRefreshButton';
        refreshButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>';
        refreshButton.title = "Refresh Game";
        refreshButton.addEventListener('click', () => location.reload());
        document.body.appendChild(refreshButton);
    }

    refreshGame() {
        location.reload();
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

    handleRoleFilter(event) {
        const role = event.target.dataset.role;
        if (role) {
            this.currentFilter = role; // Always set the clicked role as filter, no deselection
            this.updateRoleFilters();
            this.renderHeroPool();
        }
    }

    renderRoleFilters() {
        this.roleFilters.innerHTML = '';
        this.roleOrder.forEach(role => {
            const button = document.createElement('button');
            button.textContent = role;
            button.dataset.role = role;
            if (role === this.currentFilter) { // Set current filter as active
                button.classList.add('active');
            }
            this.roleFilters.appendChild(button);
        });
    }

    renderRoleFilters() {
        this.roleFilters.innerHTML = '';
        this.roleOrder.forEach(role => {
            const button = document.createElement('button');
            button.textContent = role;
            button.dataset.role = role;
            if (role === 'ALL') { // Set Tank button as active by default
                button.classList.add('active');
            }
            this.roleFilters.appendChild(button);
        });
    }

    showNotice() {
        const notice = document.createElement('div');
        notice.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; 
                        border-radius: 10px; text-align: center; z-index: 1000;">
                <p>This webpage is being used for developers testing and experimentation, so you may encounter numerous bugs. In some cases, the web app may crash or freeze.</p>
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
        this.setupScrollHandler();
        this.gameState.selectedEnemy = this.teamSelect.value;
        if (this.gameState.selectedEnemy === 'player') {
            alert('Please select an enemy team!');
            return;
        }

        // Set up the initial game state based on selected side
        this.gameState.playerSide = this.playerSide;
        this.gameState.currentTurn = this.playerSide === 'blue' ? 'player' : 'enemy';
        this.gameState.phase = 'ban';

        this.enemyTeamName.textContent = this.teamStrategies[this.gameState.selectedEnemy].name;

        const enemyLogo = document.getElementById('enemyTeamLogo');
        enemyLogo.src = this.teamLogos[this.gameState.selectedEnemy];

        this.startButton.style.display = 'none';
        this.teamSelect.style.display = 'none';
        document.getElementById('sideSelect').style.display = 'none';
        this.showHeroPool();

        this.currentFilter = 'ALL';
        this.updateDisplay();

        // If enemy starts (red side), process their turn
        if (this.gameState.currentTurn === 'enemy') {
            await this.processAITurn();
        } else {
            this.startCountdown();
        }
        if (this.gameState.currentTurn === 'player') {
            this.showTurnNotification();
            this.startCountdown();
        } else {
            await this.processAITurn();
        }
    }

    clearCountdown() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
        
        // Hide floating timer when countdown is cleared
        if (this.floatingTimer) {
            this.floatingTimer.classList.remove('visible');
        }

        // Disconnect the observer when the draft ends
        if (this.draftAreaObserver) {
            this.draftAreaObserver.disconnect();
        }
    }

    startCountdown() {
        this.clearCountdown();
        this.timeLeft = 40;
        this.updateCountdownDisplay();

        this.countdownTimer = setInterval(() => {
            this.timeLeft--;
            this.updateCountdownDisplay();

            if (this.timeLeft <= 0) {
                if (this.gameState.currentTurn === 'player') {
                    this.handleTimeout();
                } else {
                    this.clearCountdown();
                }
            }
        }, 1000);
    }

    handleTimeout() {
        this.clearCountdown();

        if (this.gameState.currentTurn !== 'player') return;

        let processed = false;

        if (this.gameState.phase === 'ban') {
            processed = this.draftLogic.processPlayerSelection(null);
        } else {
            const availableHeroes = this.draftLogic.heroes.filter(hero =>
                this.gameState.isHeroAvailable(hero.id)
            );

            if (availableHeroes.length > 0) {
                const randomHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
                processed = this.draftLogic.processPlayerSelection(randomHero.id);
            }
        }

        if (processed) {
            this.updateTeamDisplays();
            this.updatePhaseIndicator();
            this.renderHeroPool();

            if (!this.checkGameEnd()) {
                this.processAITurn();
            }
        }
    }

    updateCountdownDisplay() {
        // Update both the regular countdown and floating timer
        const countdownElement = document.getElementById('countdown');
        const turnText = this.gameState.currentTurn === 'player' ? 'Your' : 'Enemy';
        const timerText = `${turnText} turn: ${this.timeLeft}s`;
        
        // Update regular countdown
        countdownElement.textContent = timerText;
        countdownElement.className = `${this.gameState.currentTurn}-turn`;

        // Update floating timer
        if (this.floatingTimer) {
            this.floatingTimer.textContent = timerText;
            this.floatingTimer.className = `floating-timer ${this.gameState.currentTurn}-turn`;
            
            // Let the Intersection Observer handle visibility
            const draftArea = document.querySelector('.phase-indicator').parentElement;
            const draftAreaRect = draftArea.getBoundingClientRect();
            
            if (this.timeLeft > 0 && draftAreaRect.top < 0) {
                this.floatingTimer.classList.add('visible');
            } else {
                this.floatingTimer.classList.remove('visible');
            }
        }
    }

    shouldTransitionToPick() {
        return this.gameState.phase === 'ban' &&
            this.gameState.playerBans.length >= this.maxBansPerTeam &&
            this.gameState.enemyBans.length >= this.maxBansPerTeam;
    }

    transitionToPick() {
        this.gameState.phase = 'pick';
        this.gameState.currentTurn = this.playerSide === 'blue' ? 'player' : 'enemy';
        this.updatePhaseIndicator();
        this.scrollToDraftBoard();
    }

    handleHeroClick(event) {
        const heroElement = event.target.closest('.hero');
        if (!heroElement) return;

        const heroId = heroElement.dataset.heroId;

        if (this.shouldTransitionToPick()) {
            this.transitionToPick();
            if (this.gameState.currentTurn === 'enemy') {
                this.processAITurn();
                return;
            }
        }

        if (this.draftLogic.processPlayerSelection(heroId)) {
            this.clearCountdown();
            this.updateDisplay();
            this.scrollToDraftBoard();

            if (!this.checkGameEnd()) {
                this.processAITurn();
            }
        }
    }

    getHeroById(heroId) {
        return this.draftLogic.heroes.find(hero => hero.id === heroId);
    }

    renderHeroPool() {
        this.heroPool.innerHTML = '';

        const heroesToRender = this.currentFilter === 'ALL'
            ? this.draftLogic.heroes
            : this.draftLogic.heroes.filter(hero => hero.role === this.currentFilter);

        heroesToRender.forEach(hero => {
            const heroElement = document.createElement('div');
            heroElement.className = 'hero';
            heroElement.dataset.heroId = hero.id;

            const isUnavailable = !this.gameState.isHeroAvailable(hero.id);
            if (isUnavailable) {
                heroElement.classList.add('banned');
            }

            const roleColor = this.getRoleColor(hero.role);

            heroElement.innerHTML = `
                <div class="hero-card ${isUnavailable ? 'banned' : ''}" style="background: ${roleColor}">
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
        // Handle null/blank bans
        if (heroId === null && type === 'ban') {
            return `<div class="${type}-slot blank-ban">
                <div class="blank-ban-indicator">-</div>
            </div>`;
        }

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
        const playerBansContainer = document.getElementById('playerBans');
        const enemyBansContainer = document.getElementById('enemyBans');
        const playerPicksContainer = document.getElementById('playerPicks');
        const enemyPicksContainer = document.getElementById('enemyPicks');
        const playerTeamContainer = document.querySelector('#playerTeam');
        const enemyTeamContainer = document.querySelector('#enemyTeam');

        // Swap containers based on side selection
        if (this.playerSide === 'blue') {
            // Blue side (left side)
            playerTeamContainer.style.order = '1';
            enemyTeamContainer.style.order = '2';
        } else {
            // Red side (right side)
            playerTeamContainer.style.order = '2';
            enemyTeamContainer.style.order = '1';
        }

        // Update the bans and picks
        playerBansContainer.innerHTML = this.gameState.playerBans.map(heroId => this.renderSlot(heroId, 'ban')).join('');
        enemyBansContainer.innerHTML = this.gameState.enemyBans.map(heroId => this.renderSlot(heroId, 'ban')).join('');
        playerPicksContainer.innerHTML = this.gameState.playerPicks.map(heroId => this.renderSlot(heroId, 'pick')).join('');
        enemyPicksContainer.innerHTML = this.gameState.enemyPicks.map(heroId => this.renderSlot(heroId, 'pick')).join('');
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
            draftMessage = `<p class="draft-message draft-message-bad">You didn't draft well</p>`;//when the AI outdrafted the player
        } if (analysisResult.advantage.winner === 'enemy' && advantagePercentage > 10) {
            draftMessage = `<p class="draft-message draft-message-bad">Oh my! Are you for real? You're so bad at this game lol</p>`;//when the player is trolling
        }
        else if (analysisResult.advantage.winner === 'player' && advantagePercentage > 2.5) {
            draftMessage = `<p class="draft-message draft-message-good">Wow! You're a great coach/analyst</p>`;//when the player outdrafted the enemy AI
        } else if (analysisResult.advantage.winner === 'player' && advantagePercentage < 2.5 || analysisResult.advantage.winner === 'enemy' && advantagePercentage < 2.5) {
            draftMessage = `<p class="draft-message draft-message-draw">It's an even draft, it's up to the mechanics of the players now..</p>`;//if it's even
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
                    <div class="team-logo-section">
                        <img src="../assets/teams/mpl.png" alt="Your Team" class="team-logo">
                        <h3>Your Team</h3>
                    </div>
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
                    <div class="team-logo-section">
                        <img src="${this.teamLogos[this.gameState.selectedEnemy]}" alt="Enemy Team" class="team-logo">
                        <h3>Enemy Team</h3>
                    </div>
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
            // Refresh the page when close button is clicked
            location.reload();
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
