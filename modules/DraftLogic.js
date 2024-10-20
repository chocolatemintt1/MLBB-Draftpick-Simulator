// modules/DraftLogic.js
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
            hero.name.toLowerCase() === name.toLowerCase() ||
            hero.id.toLowerCase() === name.toLowerCase().replace(' ', '-')
        );
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

    getAIBanSelection(strategy) {
        // Try to find a preferred ban that's available
        for (const banName of strategy.commonBans) {
            const hero = this.findHeroByName(banName);
            if (hero && this.gameState.isHeroAvailable(hero.id)) {
                return hero.id;
            }
        }
        // Fallback to random available hero
        return this.getRandomAvailableHeroId();
    }

    getAIPickSelection(strategy) {
        // Try to find a preferred pick that's available
        for (const pickName of strategy.preferredPicks) {
            const hero = this.findHeroByName(pickName);
            if (hero && this.gameState.isHeroAvailable(hero.id)) {
                return hero.id;
            }
        }
        // Fallback to random available hero
        return this.getRandomAvailableHeroId();
    }

    getRandomAvailableHeroId() {
        const availableHeroes = this.heroes.filter(hero => 
            this.gameState.isHeroAvailable(hero.id)
        );
        if (availableHeroes.length === 0) return null;
        return availableHeroes[Math.floor(Math.random() * availableHeroes.length)].id;
    }

    evaluateDraft() {
        return "Draft completed! Thanks for playing!";
    }
}