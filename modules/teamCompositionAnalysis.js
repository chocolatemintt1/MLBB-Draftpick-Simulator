// teamCompositionAnalysis.js
export class TeamCompositionAnalysis {
    constructor(heroes) {
        this.heroes = heroes;
    }

    calculateTeamStats(picks) {
        const teamHeroes = picks.map(id => this.heroes.find(h => h.id === id));
        return {
            damage: teamHeroes.reduce((sum, hero) => sum + hero.damage, 0) / picks.length,
            durability: teamHeroes.reduce((sum, hero) => sum + hero.durability, 0) / picks.length,
            cc: teamHeroes.reduce((sum, hero) => sum + hero.cc, 0) / picks.length
        };
    }

    determineAdvantage(playerStats, enemyStats) {
        const weights = {
            damage: 0.4,      // 40% weight for damage
            durability: 0.3,  // 30% weight for durability
            cc: 0.3           // 30% weight for crowd control
        };

        const playerScore = (playerStats.damage * weights.damage) +
            (playerStats.durability * weights.durability) +
            (playerStats.cc * weights.cc);

        const enemyScore = (enemyStats.damage * weights.damage) +
            (enemyStats.durability * weights.durability) +
            (enemyStats.cc * weights.cc);

        return {
            winner: playerScore > enemyScore ? 'player' : 'enemy',
            advantage: Math.abs(playerScore - enemyScore) / 10
        };
    }

    generateStrategicAdvice(playerStats, enemyStats) {
        const advice = [];

        // Damage analysis
        if (playerStats.damage > enemyStats.damage) {
            advice.push({
                type: 'advantage',
                text: "Your team has superior damage output. Focus on creating opportunities for your damage dealers to safely deal damage."
            });
        } else {
            advice.push({
                type: 'weakness',
                text: "Enemy team has higher damage potential. Prioritize defensive itemization and careful engagement timing."
            });
        }

        // Durability analysis
        if (playerStats.durability > enemyStats.durability) {
            advice.push({
                type: 'advantage',
                text: "Your team is more durable. Use this advantage to control longer fights and outlast the enemy team."
            });
        } else {
            advice.push({
                type: 'weakness',
                text: "Enemy team is more durable. Look for quick picks and avoid extended engagements where possible."
            });
        }

        // CC analysis
        if (playerStats.cc > enemyStats.cc) {
            advice.push({
                type: 'advantage',
                text: "Your team has better crowd control. Chain your CC abilities for maximum impact and pick potential."
            });
        } else {
            advice.push({
                type: 'weakness',
                text: "Enemy has stronger CC. Consider buying purify or tough boots to counter their control abilities."
            });
        }

        return advice;
    }

    analyzeDraft(playerPicks, enemyPicks) {
        const playerStats = this.calculateTeamStats(playerPicks);
        const enemyStats = this.calculateTeamStats(enemyPicks);
        const advantage = this.determineAdvantage(playerStats, enemyStats);
        const advice = this.generateStrategicAdvice(playerStats, enemyStats);

        return {
            playerStats,
            enemyStats,
            advantage,
            advice,
            keyVictoryConditions: this.generateKeyVictoryConditions(playerStats, enemyStats, advantage)
        };
    }

    generateKeyVictoryConditions(playerStats, enemyStats, advantage) {
        const conditions = {
            player: [],
            enemy: []
        };

        // Player victory conditions
        if (playerStats.damage > enemyStats.damage) {
            conditions.player.push("Maximize damage output opportunities through proper positioning");
        }
        if (playerStats.durability > enemyStats.durability) {
            conditions.player.push("Force extended teamfights to utilize superior durability");
        }
        if (playerStats.cc > enemyStats.cc) {
            conditions.player.push("Initiate fights with coordinated CC chains");
        }

        // Enemy victory conditions
        if (enemyStats.damage > playerStats.damage) {
            conditions.enemy.push("Look for burst damage windows when enemy CC is on cooldown");
        }
        if (enemyStats.durability > playerStats.durability) {
            conditions.enemy.push("Engage in sustained fights to outlast the enemy");
        }
        if (enemyStats.cc > playerStats.cc) {
            conditions.enemy.push("Control key targets with superior CC abilities");
        }

        return conditions;
    }
}