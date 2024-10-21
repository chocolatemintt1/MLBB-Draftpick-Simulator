export class DraftLogic {
    constructor(gameState, heroes, teamStrategies) {
        this.gameState = gameState;
        this.heroes = heroes;
        this.teamStrategies = teamStrategies;
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

    calculateTeamStats(picks) {
        const heroes = picks.map(heroId => this.findHeroById(heroId));
        
        const totalStats = heroes.reduce((acc, hero) => {
            acc.damage += hero.damage;
            acc.durability += hero.durability;
            acc.cc += hero.cc;
            return acc;
        }, { damage: 0, durability: 0, cc: 0 });

        // Calculate average and ensure it doesn't exceed 10
        return {
            damage: Math.min(10, totalStats.damage / heroes.length),
            durability: Math.min(10, totalStats.durability / heroes.length),
            cc: Math.min(10, totalStats.cc / heroes.length)
        };
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
        if (playstyle === 'aggressive' && (hero.damage > 7 || hero.cc > 7)) {
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
            advantage: Math.abs(playerTotal - enemyTotal) / 3, // Average difference per category
            playerStats,
            enemyStats,
            analysis: this.generateAnalysis(playerStats, enemyStats)
        };
    }

    generateAnalysis(playerStats, enemyStats) {
        let analysis = [];

        if (playerStats.damage > enemyStats.damage) {
            analysis.push("Your team has higher damage potential. Look for opportunities to engage in teamfights.");
        } else {
            analysis.push("Enemy team has higher damage output. Be cautious in extended fights.");
        }

        if (playerStats.durability > enemyStats.durability) {
            analysis.push("Your team is more durable. You can withstand more damage in teamfights.");
        } else {
            analysis.push("Enemy team is more durable. Consider building defensive items.");
        }

        if (playerStats.cc > enemyStats.cc) {
            analysis.push("Your team has better crowd control. Coordinate your CC abilities for maximum impact.");
        } else {
            analysis.push("Enemy team has stronger CC. Be prepared to dodge or use purify against their control abilities.");
        }

        return analysis;
    }
}
