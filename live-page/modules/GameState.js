export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.phase = 'setup';
        this.currentTurn = 'player';
        this.playerBans = [];
        this.enemyBans = [];
        this.playerPicks = [];
        this.enemyPicks = [];
        this.selectedEnemy = null;
        this.turnCount = 0;
    }

    isHeroAvailable(heroId) {
        const usedHeroes = [
            ...this.playerBans,
            ...this.enemyBans,
            ...this.playerPicks,
            ...this.enemyPicks
        ];
        return !usedHeroes.includes(heroId);
    }

    canSelectHero() {
        return this.phase !== 'setup' && this.currentTurn === 'player';
    }

    switchTurn() {
        this.currentTurn = this.currentTurn === 'player' ? 'enemy' : 'player';
    }
}
