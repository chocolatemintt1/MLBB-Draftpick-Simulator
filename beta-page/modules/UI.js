export class UI {
    constructor(gameState, draftLogic, teamStrategies, roleOrder, teamAnalysis) {
        this.gameState = gameState;
        this.draftLogic = draftLogic;
        this.teamStrategies = teamStrategies;
        this.roleOrder = ['ALL', ...roleOrder]; // Add ALL to the beginning of roleOrder
        this.teamAnalysis = teamAnalysis;
        this.currentFilter = 'ALL'; // Set ALL as default filter
        this.playerSide = 'blue'; // Default to blue side
        this.showDesktopViewNotice();
        this.initializeElements();
        this.setupEventListeners();
        this.hideHeroPool();
        this.addFloatingRefreshButton();
        this.updateTeamCompositionDisplay();
        this.countdownTimer = null;
        this.aiThinkingTime = { min: 3000, max: 8000 };
        this.maxBansPerTeam = 5; // Add this to track max bans

        this.teamLogos = {
            blacklist: '../assets/teams/blacklist.png',
            echo: '../assets/teams/tlph.png',
            onic: '../assets/teams/fnop.png',
            ap: '../assets/teams/apbren.png',
            tnc: '../assets/teams/tnc.png',
            aurora: '../assets/teams/aurora.png',
            rsg: '../assets/teams/rsg.png',
            omg: '../assets/teams/omg.png',
        };

        this.draftPhases = {
            FIRST_BAN: 'first_ban',
            FIRST_PICK: 'first_pick',
            SECOND_BAN: 'second_ban',
            SECOND_PICK: 'second_pick',
            LAST_BAN: 'last_ban',    // Added last ban phase
            LAST_PICK: 'last_pick'   // Added last pick phase
        };

        // Update phase counts to match MPL format
        this.maxBansFirstPhase = 2;  // Changed from 3 to 2 (first ban phase)
        this.maxPicksFirstPhase = 2; // Stays the same
        this.maxBansSecondPhase = 2; // Stays the same
        this.maxPicksSecondPhase = 2; // Changed from 3 to 2
        this.maxBansLastPhase = 1;   // Added last ban phase (1 ban each)
        this.maxPicksLastPhase = 1;  // Added last pick phase (1 pick each)
        
        this.gameState.phase = this.draftPhases.FIRST_BAN;

        this.isProcessingAI = false;
        this.thinkingOverlay = null;
        this.aiThinkingTime = {
            min: 2000,  // Reduced from 3000 to 2000
            max: 5000   // Reduced from 8000 to 5000
        };
    }

    getRoleColor(role) {
        const colors = {
            'ALL': 'rgba(128, 128, 128, 0.2)',  // Gray with transparency for ALL
            'Tank': 'rgba(255, 165, 0, 0.2)',     // Orange with transparency
            'Mage': 'rgba(0, 127, 255, 0.2)',     // Blue with transparency
            'Assassin': 'rgba(128, 0, 128, 0.2)', // Purple with transparency
            'Marksman': 'rgba(255, 215, 0, 0.2)', // Yellow with transparency
            'Support': 'rgba(0, 128, 0, 0.2)',    // Green with transparency
            'Fighter': 'rgba(255, 0, 0, 0.2)'     // Red with transparency
        };
        return colors[role] || 'transparent';
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
        if (this.gameState.currentTurn === 'enemy' && !this.isProcessingAI) {
            try {
                this.isProcessingAI = true;
                this.showAIThinking();
                
                // Check phase transitions
                this.checkAndTransitionPhase();

                // Simulate AI thinking with a timeout
                await this.simulateAIThinking();

                // Process the AI's selection
                const selectedId = this.draftLogic.processAITurn();
                this.currentFilter = 'ALL';
                this.updateDisplay();

                // Hide thinking indicator and cleanup
                this.hideAIThinking();
                this.isProcessingAI = false;

                // Check for game end or start countdown
                if (!this.checkGameEnd()) {
                    this.startCountdown();
                }
            } catch (error) {
                console.error('Error during AI turn:', error);
                this.hideAIThinking();
                this.isProcessingAI = false;
            }
        }
    }

    checkAndTransitionPhase() {
        const { playerBans, enemyBans, playerPicks, enemyPicks } = this.gameState;
        const totalBans = playerBans.length + enemyBans.length;
        const totalPicks = playerPicks.length + enemyPicks.length;

        switch (this.gameState.phase) {
            case this.draftPhases.FIRST_BAN:
                if (totalBans === this.maxBansFirstPhase * 2) { // After 4 bans (2 each)
                    this.gameState.phase = this.draftPhases.FIRST_PICK;
                    // First pick goes to blue side
                    this.gameState.currentTurn = this.playerSide === 'blue' ? 'player' : 'enemy';
                }
                break;

            case this.draftPhases.FIRST_PICK:
                if (totalPicks === this.maxPicksFirstPhase * 2) { // After 4 picks (2 each)
                    this.gameState.phase = this.draftPhases.SECOND_BAN;
                    // Second ban starts with red side
                    this.gameState.currentTurn = this.playerSide === 'red' ? 'player' : 'enemy';
                }
                break;

            case this.draftPhases.SECOND_BAN:
                if (totalBans === (this.maxBansFirstPhase + this.maxBansSecondPhase) * 2) { // After 8 bans (4 each)
                    this.gameState.phase = this.draftPhases.SECOND_PICK;
                    // Second pick starts with red side
                    this.gameState.currentTurn = this.playerSide === 'red' ? 'player' : 'enemy';
                }
                break;

            case this.draftPhases.SECOND_PICK:
                if (totalPicks === (this.maxPicksFirstPhase + this.maxPicksSecondPhase) * 2) { // After 8 picks (4 each)
                    this.gameState.phase = this.draftPhases.LAST_BAN;
                    // Last ban starts with blue side
                    this.gameState.currentTurn = this.playerSide === 'blue' ? 'player' : 'enemy';
                }
                break;

            case this.draftPhases.LAST_BAN:
                if (totalBans === (this.maxBansFirstPhase + this.maxBansSecondPhase + this.maxBansLastPhase) * 2) { // After 10 bans (5 each)
                    this.gameState.phase = this.draftPhases.LAST_PICK;
                    // Last pick starts with blue side
                    this.gameState.currentTurn = this.playerSide === 'blue' ? 'player' : 'enemy';
                }
                break;
        }
    }

    createThinkingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'ai-thinking-overlay';
        overlay.innerHTML = `
            <div class="thinking-container">
                <div class="thinking-content">
                    <div class="thinking-spinner"></div>
                    <div class="thinking-text">
                        <span>Opponent is thinking</span>
                        <div class="dot-animation">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return overlay;
    }

    showAIThinking() {
        if (this.thinkingOverlay) {
            this.hideAIThinking();
        }

        this.thinkingOverlay = this.createThinkingOverlay();
        document.body.appendChild(this.thinkingOverlay);

        // Add CSS styles dynamically if not already present
        if (!document.getElementById('ai-thinking-styles')) {
            const styles = document.createElement('style');
            styles.id = 'ai-thinking-styles';
            styles.textContent = `
                .ai-thinking-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    pointer-events: none;
                }

                .thinking-container {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 20px 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .thinking-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .thinking-spinner {
                    width: 24px;
                    height: 24px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .thinking-text {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 16px;
                    color: #333;
                }

                .dot-animation {
                    display: flex;
                    gap: 2px;
                }

                .dot-animation span {
                    animation: dots 1.4s infinite;
                    opacity: 0;
                }

                .dot-animation span:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .dot-animation span:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes dots {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    hideAIThinking() {
        if (this.thinkingOverlay) {
            this.thinkingOverlay.remove();
            this.thinkingOverlay = null;
        }
    }

    async simulateAIThinking() {
        // Generate a random thinking time within the specified range
        const thinkingTime = Math.floor(
            Math.random() * (this.aiThinkingTime.max - this.aiThinkingTime.min + 1) + 
            this.aiThinkingTime.min
        );

        return new Promise(resolve => {
            setTimeout(resolve, thinkingTime);
        });
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

        // Add side selection
        this.createSideSelection();
    }

    createSideSelection() {
        const sideSelectContainer = document.createElement('div');
        sideSelectContainer.className = 'side-select-container';

        const sideSelect = document.createElement('select');
        sideSelect.id = 'sideSelect';
        sideSelect.className = 'side-select';

        const blueOption = document.createElement('option');
        blueOption.value = 'blue';
        blueOption.textContent = 'Blue Side';

        const redOption = document.createElement('option');
        redOption.value = 'red';
        redOption.textContent = 'Red Side';

        sideSelect.appendChild(blueOption);
        sideSelect.appendChild(redOption);

        sideSelectContainer.appendChild(sideSelect);

        // Insert the side selection before the start button
        this.startButton.parentNode.insertBefore(sideSelectContainer, this.startButton);

        // Add event listener for side selection
        sideSelect.addEventListener('change', (e) => {
            this.playerSide = e.target.value;
            this.updateTeamDisplays(); // Update the display when side changes
        });
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

    showDesktopViewNotice() {
        const notice = document.createElement('div');
        notice.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; 
                        border-radius: 10px; text-align: center; z-index: 1000;">
                <p>This page is still under development, so you may encounter numerous bugs. In some cases, the web app may crash or freeze.</p>
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

        // If enemy starts (red side), show thinking popup and process their turn
        if (this.gameState.currentTurn === 'enemy') {
            this.showAIThinking();
            await this.processAITurn();
        } else {
            this.startCountdown();
        }
    }

    startCountdown() {
        // This will clear any existing timer
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }

        this.timeLeft = 40;
        this.updateCountdownDisplay();
        this.countdownTimer = setInterval(() => {
            this.timeLeft--;
            this.updateCountdownDisplay();
            if (this.timeLeft <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    }

    handleTimeout() {
        clearInterval(this.countdownTimer);

        if (this.gameState.currentTurn === 'player') {
            this.checkAndTransitionPhase();
            
            let processed = false;
            if (this.gameState.phase === this.draftPhases.FIRST_BAN || 
                this.gameState.phase === this.draftPhases.SECOND_BAN) {
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
                    // Show thinking popup when timeout leads to enemy turn
                    this.showAIThinking();
                    this.processAITurn();
                }
            }
        }
    }

    updateCountdownDisplay() {
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = `Time left: ${this.timeLeft}s`;
    }

    async handleHeroClick(event) {
        // Prevent click handling if AI is processing
        if (this.isProcessingAI) return;

        const heroElement = event.target.closest('.hero');
        if (!heroElement) return;

        const heroId = heroElement.dataset.heroId;

        if (this.draftLogic.processPlayerSelection(heroId)) {
            // Clear existing countdown
            if (this.countdownTimer) {
                clearInterval(this.countdownTimer);
            }

            // Update display immediately
            this.updateTeamDisplays();
            this.updatePhaseIndicator();
            this.renderHeroPool();

            // Check if game has ended after player's move
            if (!this.checkGameEnd()) {
                // Small delay before AI turn
                await new Promise(resolve => setTimeout(resolve, 500));
                await this.processAITurn();
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
        let phaseText = '';
        switch (this.gameState.phase) {
            case this.draftPhases.FIRST_BAN:
                phaseText = '1st Ban Phase (2 bans each)';
                break;
            case this.draftPhases.FIRST_PICK:
                phaseText = '1st Pick Phase (2 picks each)';
                break;
            case this.draftPhases.SECOND_BAN:
                phaseText = '2nd Ban Phase (2 bans each)';
                break;
            case this.draftPhases.SECOND_PICK:
                phaseText = '2nd Pick Phase (2 picks each)';
                break;
            case this.draftPhases.LAST_BAN:
                phaseText = 'Final Ban Phase (1 ban each)';
                break;
            case this.draftPhases.LAST_PICK:
                phaseText = 'Final Pick Phase (1 pick each)';
                break;
        }
        phaseText += ` - ${this.gameState.currentTurn === 'player' ? 'Your' : 'Enemy'} turn`;
        this.phaseIndicator.textContent = phaseText;
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
        } if (analysisResult.advantage.winner === 'enemy' && advantagePercentage > 10.0) {
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
        const totalPicks = this.gameState.playerPicks.length + this.gameState.enemyPicks.length;
        if (totalPicks === (this.maxPicksFirstPhase + this.maxPicksSecondPhase + this.maxPicksLastPhase) * 2) {
            clearInterval(this.countdownTimer);
            const evaluation = this.draftLogic.evaluateDraft();
            this.displayDraftResults(evaluation);
            return true;
        }
        return false;
    }
}
