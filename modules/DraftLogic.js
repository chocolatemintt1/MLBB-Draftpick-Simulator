export class DraftLogic {
    constructor(gameState, heroes, teamStrategies) {
        this.gameState = gameState;
        this.heroes = heroes;
        this.teamStrategies = teamStrategies;

        // Role composition weights
        this.idealComposition = {
            Tank: 1,
            Fighter: 1,
            Assassin: 1,
            Mage: 1,
            Marksman: 1,
            Support: 0.5
        };

        // Synergy scores between roles
        this.synergies = {
            Tank: { Support: 0.8, Marksman: 0.7, Mage: 0.6 },
            Fighter: { Assassin: 0.6, Mage: 0.5 },
            Assassin: { Mage: 0.6, Support: 0.4 },
            Mage: { Support: 0.7, Marksman: 0.6 },
            Marksman: { Support: 0.9, Tank: 0.7 },
            Support: { Marksman: 0.9, Tank: 0.8, Mage: 0.7 }
        };

        // Counter relationships
        this.counters = {
            Assassin: ['Marksman', 'Mage'],
            Tank: ['Assassin', 'Fighter'],
            Fighter: ['Marksman', 'Support'],
            Mage: ['Fighter', 'Support'],
            Marksman: ['Tank', 'Fighter'],
            Support: ['Assassin', 'Fighter']
        };
    }

    findHeroById(heroId) {
        return this.heroes.find(hero => hero.id === heroId);
    }

    findHeroByName(name) {
        return this.heroes.find(hero =>
            hero.name.toLowerCase() === name.toLowerCase()
        );
    }

    getTeamComposition(picks) {
        const composition = {
            Tank: 0,
            Fighter: 0,
            Assassin: 0,
            Mage: 0,
            Marksman: 0,
            Support: 0
        };

        picks.forEach(heroId => {
            const hero = this.findHeroById(heroId);
            if (hero) {
                composition[hero.role]++;
            }
        });

        return composition;
    }

    calculateSynergyScore(hero, currentPicks) {
        let synergyScore = 0;
        const currentComposition = this.getTeamComposition(currentPicks);

        Object.entries(this.synergies[hero.role] || {}).forEach(([role, value]) => {
            if (currentComposition[role] > 0) {
                synergyScore += value;
            }
        });

        return synergyScore;
    }

    calculateCounterScore(hero, enemyPicks) {
        let counterScore = 0;
        const enemyComposition = this.getTeamComposition(enemyPicks);

        (this.counters[hero.role] || []).forEach(counteredRole => {
            if (enemyComposition[counteredRole] > 0) {
                counterScore += 0.5;
            }
        });

        return counterScore;
    }

    calculateHeroScore(hero, currentPicks, enemyPicks) {
        const currentComposition = this.getTeamComposition(currentPicks);

        // Base score from hero attributes
        let score = (hero.damage + hero.durability + hero.cc) / 30;

        // Role necessity score
        const roleCount = currentComposition[hero.role] || 0;
        const roleNecessity = this.idealComposition[hero.role] - roleCount;
        score += roleNecessity;

        // Add synergy score
        score += this.calculateSynergyScore(hero, currentPicks);

        // Add counter score
        score += this.calculateCounterScore(hero, enemyPicks);

        return score;
    }

    getAIBanSelection(strategy) {
        const availableHeroes = this.heroes.filter(hero =>
            this.gameState.isHeroAvailable(hero.id)
        );

        // Prioritize banning heroes that counter the team's playstyle
        const counterPlaystyleBans = availableHeroes.filter(hero =>
            this.countersPlaystyle(hero, strategy.playstyle)
        );

        if (counterPlaystyleBans.length > 0) {
            return this.getRandomHero(counterPlaystyleBans).id;
        }

        // Fall back to common bans
        for (const banName of strategy.commonBans) {
            const hero = this.findHeroByName(banName);
            if (hero && this.gameState.isHeroAvailable(hero.id)) {
                return hero.id;
            }
        }

        // If all else fails, ban a random strong hero
        const strongHeroes = availableHeroes.filter(hero =>
            (hero.damage + hero.durability + hero.cc) / 3 > 7
        );
        return this.getRandomHero(strongHeroes).id;
    }

    getAIPickSelection(strategy) {
        const availableHeroes = this.heroes.filter(hero =>
            this.gameState.isHeroAvailable(hero.id)
        );

        // Calculate current team composition
        const currentPicks = this.gameState.enemyPicks.map(id => this.findHeroById(id));
        const composition = this.getTeamComposition(currentPicks);

        // Prioritize preferred picks that fit the team composition
        const preferredPicks = strategy.preferredPicks
            .map(name => this.findHeroByName(name))
            .filter(hero => hero && this.gameState.isHeroAvailable(hero.id));

        const suitablePicks = preferredPicks.filter(hero =>
            this.fitsTeamComposition(hero, composition, strategy)
        );

        if (suitablePicks.length > 0) {
            return this.getRandomHero(suitablePicks).id;
        }

        // If no suitable preferred picks, choose based on team needs
        const teamNeeds = this.getTeamNeeds(composition, strategy);
        const suitableHeroes = availableHeroes.filter(hero =>
            teamNeeds.includes(hero.role) && this.fitsPlaystyle(hero, strategy.playstyle)
        );

        if (suitableHeroes.length > 0) {
            return this.getRandomHero(suitableHeroes).id;
        }

        // If all else fails, pick a random available hero
        return this.getRandomHero(availableHeroes).id;
    }

    countersPlaystyle(hero, playstyle) {
        if (playstyle === 'aggressive' && (hero.role === 'Tank' || hero.role === 'Support')) {
            return true;
        }
        if (playstyle === 'defensive' && (hero.role === 'Assassin' || hero.damage > 8)) {
            return true;
        }
        return false;
    }

    fitsTeamComposition(hero, composition, strategy) {
        const roleCount = composition[hero.role] || 0;
        if (roleCount >= 2) return false;

        if (strategy.lateGameFocus && (hero.role === 'Marksman' || hero.role === 'Mage')) {
            return true;
        }
        if (!strategy.lateGameFocus && (hero.role === 'Assassin' || hero.role === 'Fighter')) {
            return true;
        }

        return roleCount === 0;
    }

    getTeamNeeds(composition, strategy) {
        const needs = [];
        if (!composition['Tank']) needs.push('Tank');
        if (!composition['Support']) needs.push('Support');
        if (!composition['Marksman'] && !composition['Mage']) needs.push('Marksman', 'Mage');
        if (strategy.lateGameFocus && !composition['Marksman']) needs.push('Marksman');
        if (!strategy.lateGameFocus && !composition['Assassin']) needs.push('Assassin');
        return needs;
    }

    fitsPlaystyle(hero, playstyle) {
        if (playstyle === 'aggressive' && (hero.damage > 7 || hero.mobility > 7)) {
            return true;
        }
        if (playstyle === 'defensive' && (hero.durability > 7 || hero.cc > 7)) {
            return true;
        }
        return false;
    }

    getRandomHero(heroes) {
        return heroes[Math.floor(Math.random() * heroes.length)];
    }

    processPlayerSelection(heroId) {
        if (!this.gameState.canSelectHero()) return false;
        if (!this.gameState.isHeroAvailable(heroId)) return false;

        if (this.gameState.phase === 'ban' && this.gameState.playerBans.length < 5) {
            this.gameState.playerBans.push(heroId);
            this.gameState.currentTurn = 'enemy';
            return true;
        } else if (this.gameState.phase === 'pick' && this.gameState.playerPicks.length < 5) {
            this.gameState.playerPicks.push(heroId);
            this.gameState.currentTurn = 'enemy';
            return true;
        }
        return false;
    }

    processAITurn() {
        const strategy = this.teamStrategies[this.gameState.selectedEnemy];
        let selectedId;

        if (this.gameState.phase === 'ban') {
            selectedId = this.getAIBanSelection(strategy);
            this.gameState.enemyBans.push(selectedId);

            if (this.gameState.playerBans.length === 5 && this.gameState.enemyBans.length === 5) {
                this.gameState.phase = 'pick';
            }
        } else if (this.gameState.phase === 'pick') {
            selectedId = this.getAIPickSelection(strategy);
            this.gameState.enemyPicks.push(selectedId);
        }

        this.gameState.currentTurn = 'player';
        this.gameState.turnCount++;
        return selectedId;
    }

    evaluateDraft() {
        const playerStats = this.calculateTeamStats(this.gameState.playerPicks);
        const enemyStats = this.calculateTeamStats(this.gameState.enemyPicks);

        const playerTotal = Object.values(playerStats).reduce((a, b) => a + b, 0);
        const enemyTotal = Object.values(enemyStats).reduce((a, b) => a + b, 0);

        return {
            winner: playerTotal > enemyTotal ? 'player' : 'enemy',
            advantage: Math.abs(playerTotal - enemyTotal) / 7, // Average difference per category
            playerStats,
            enemyStats,
            analysis: this.generateAnalysis(playerStats, enemyStats)
        };
    }

    calculateTeamStats(picks) {
        const heroes = picks.map(heroId => this.findHeroById(heroId));

        return {
            earlyMidGame: this.calculateEarlyMidGamePotential(heroes),
            lateGame: this.calculateLateGamePotential(heroes),
            damage: this.calculateDamagePotential(heroes),
            survival: this.calculateSurvivalPotential(heroes),
            crowdControl: this.calculateCrowdControlPotential(heroes),
            push: this.calculatePushPotential(heroes),
            coordination: this.calculateTeamCoordination(heroes)
        };
    }

    calculateEarlyMidGamePotential(heroes) {
        let score = 0;
        heroes.forEach(hero => {
            if (hero.role === 'Assassin' || hero.role === 'Fighter') score += 2;
            if (hero.role === 'Mage') score += 1.5;
            score += hero.damage * 0.3;
            score += hero.mobility * 0.2;
        });
        return Math.min(10, score);
    }

    calculateLateGamePotential(heroes) {
        let score = 0;
        heroes.forEach(hero => {
            if (hero.role === 'Marksman') score += 2.5;
            if (hero.role === 'Mage') score += 2;
            score += hero.damage * 0.4;
            score += hero.durability * 0.2;
        });
        return Math.min(10, score);
    }

    calculateDamagePotential(heroes) {
        let score = 0;
        heroes.forEach(hero => {
            score += hero.damage * 0.6;
            if (hero.role === 'Marksman' || hero.role === 'Mage') score += 2;
            if (hero.role === 'Assassin') score += 1.5;
        });
        return Math.min(10, score);
    }

    calculateSurvivalPotential(heroes) {
        let score = 0;
        heroes.forEach(hero => {
            score += hero.durability * 0.7;
            if (hero.role === 'Tank') score += 2.5;
            if (hero.role === 'Support') score += 1.5;
        });
        return Math.min(10, score);
    }

    calculateCrowdControlPotential(heroes) {
        let score = 0;
        heroes.forEach(hero => {
            score += hero.cc * 0.8;
            if (hero.role === 'Tank' || hero.role === 'Support') score += 2;
            if (hero.role === 'Mage') score += 1.5;
        });
        return Math.min(10, score);
    }

    calculatePushPotential(heroes) {
        let score = 0;
        heroes.forEach(hero => {
            if (hero.role === 'Marksman') score += 2.5;
            if (hero.role === 'Fighter') score += 2;
            score += hero.damage * 0.3;
            score += hero.mobility * 0.2;
        });
        return Math.min(10, score);
    }

    calculateTeamCoordination(heroes) {
        let score = 0;
        const composition = this.getTeamComposition(heroes.map(h => h.id));

        Object.entries(this.synergies).forEach(([role, synergies]) => {
            if (composition[role]) {
                Object.entries(synergies).forEach(([synRole, value]) => {
                    if (composition[synRole]) {
                        score += value * 2;
                    }
                });
            }
        });

        const hasCore = composition.Marksman > 0 || composition.Mage > 0;
        const hasTank = composition.Tank > 0;
        const hasSupport = composition.Support > 0;
        if (hasCore && hasTank && hasSupport) score += 2;

        return Math.min(10, score);
    }

    generateAnalysis(playerStats, enemyStats) {
        let analysis = [];

        if (playerStats.earlyMidGame > enemyStats.earlyMidGame) {
            analysis.push("Your team has stronger early-mid game presence. Focus on aggressive early plays.");
        } else {
            analysis.push("Enemy team has early game advantage. Play safe and focus on farming.");
        }

        if (playerStats.lateGame > enemyStats.lateGame) {
            analysis.push("Your team scales better into late game. Extend the game if behind.");
        }

        if (playerStats.crowdControl > enemyStats.crowdControl) {
            analysis.push("Superior crowd control. Look for team fight opportunities.");
        }

        if (playerStats.push > enemyStats.push) {
            analysis.push("Better pushing potential. Consider split-push strategies.");
        }

        if (playerStats.survival > enemyStats.survival) {
            analysis.push("Higher survival potential. You can play more aggressively in teamfights.");
        }

        if (playerStats.damage > enemyStats.damage) {
            analysis.push("Superior damage output. Focus on engaging in favorable teamfights.");
        }

        if (playerStats.coordination > enemyStats.coordination) {
            analysis.push("Better team synergy. Look for opportunities to group and take objectives.");
        }

        return analysis;
    }
}
