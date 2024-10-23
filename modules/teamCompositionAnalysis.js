// teamCompositionAnalysis.js
export class TeamCompositionAnalysis {
    constructor(heroes) {
        this.heroes = heroes;
    }

    validateTeamComposition(picks) {
        const roles = {
            marksman: false,
            expLane: false, // Fighter for exp lane
            tankSupport: false, // Tank or Support
            mage: false,
            jungle: false // Assassin or Fighter for jungle
        };

        const heroes = picks.map(id => this.heroes.find(h => h.id === id));
        
        // First pass - check for required roles
        heroes.forEach(hero => {
            if (hero.role === 'Marksman') roles.marksman = true;
            if (hero.role === 'Fighter') {
                if (!roles.expLane) roles.expLane = true;
                else if (!roles.jungle) roles.jungle = true;
            }
            if (hero.role === 'Tank' || hero.role === 'Support') roles.tankSupport = true;
            if (hero.role === 'Mage') roles.mage = true;
            if (hero.role === 'Assassin' && !roles.jungle) roles.jungle = true;
        });

        const missingRoles = [];
        if (!roles.marksman) missingRoles.push('Marksman');
        if (!roles.expLane) missingRoles.push('Fighter (Exp Lane)');
        if (!roles.tankSupport) missingRoles.push('Tank/Support');
        if (!roles.mage) missingRoles.push('Mage');
        if (!roles.jungle) missingRoles.push('Jungler (Assassin/Fighter)');

        return {
            isValid: missingRoles.length === 0,
            missingRoles,
            composition: roles
        };
    }

    calculateTeamStats(picks) {
        const teamHeroes = picks.map(id => this.heroes.find(h => h.id === id));
        const compositionValidation = this.validateTeamComposition(picks);
        
        // Base stats calculation
        const baseStats = {
            damage: teamHeroes.reduce((sum, hero) => sum + hero.damage, 0) / picks.length,
            durability: teamHeroes.reduce((sum, hero) => sum + hero.durability, 0) / picks.length,
            cc: teamHeroes.reduce((sum, hero) => sum + hero.cc, 0) / picks.length
        };

        // Apply composition penalty if team is imbalanced
        const compositionPenalty = compositionValidation.missingRoles.length * 0.15; // 15% penalty per missing role
        
        return {
            ...baseStats,
            compositionPenalty,
            adjustedStats: {
                damage: baseStats.damage * (1 - compositionPenalty),
                durability: baseStats.durability * (1 - compositionPenalty),
                cc: baseStats.cc * (1 - compositionPenalty)
            },
            compositionValidation
        };
    }

    determineAdvantage(playerStats, enemyStats) {
        const weights = {
            damage: 0.4,
            durability: 0.3,
            cc: 0.3
        };

        const playerScore = (playerStats.adjustedStats.damage * weights.damage) +
            (playerStats.adjustedStats.durability * weights.durability) +
            (playerStats.adjustedStats.cc * weights.cc);

        const enemyScore = (enemyStats.adjustedStats.damage * weights.damage) +
            (enemyStats.adjustedStats.durability * weights.durability) +
            (enemyStats.adjustedStats.cc * weights.cc);

        return {
            winner: playerScore > enemyScore ? 'player' : 'enemy',
            advantage: Math.abs(playerScore - enemyScore) / 10,
            scores: {
                player: playerScore,
                enemy: enemyScore
            }
        };
    }

    generateStrategicAdvice(playerStats, enemyStats) {
        const advice = [];

        // Composition advice
        if (!playerStats.compositionValidation.isValid) {
            advice.push({
                type: 'critical',
                text: `Team composition is imbalanced. Missing: ${playerStats.compositionValidation.missingRoles.join(', ')}. This results in a ${(playerStats.compositionPenalty * 100).toFixed(0)}% performance penalty.`
            });
        }

        // Stats comparison
        if (playerStats.adjustedStats.damage > enemyStats.adjustedStats.damage) {
            advice.push({
                type: 'advantage',
                text: `Your team has superior damage output. Focus on creating opportunities for your damage dealers.`
            });
        } else {
            advice.push({
                type: 'weakness',
                text: `Enemy team has higher damage potential. Prioritize defensive itemization.`
            });
        }

        if (playerStats.adjustedStats.durability > enemyStats.adjustedStats.durability) {
            advice.push({
                type: 'advantage',
                text: `Your team is more durable. Use this to control longer fights.`
            });
        } else {
            advice.push({
                type: 'weakness',
                text: `Enemy team is more durable. Look for quick picks.`
            });
        }

        if (playerStats.adjustedStats.cc > enemyStats.adjustedStats.cc) {
            advice.push({
                type: 'advantage',
                text: `Your team has better crowd control. Chain your CC abilities.`
            });
        } else {
            advice.push({
                type: 'weakness',
                text: `Enemy has stronger CC. Consider buying purify or tough boots.`
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
            playerComposition: playerStats.compositionValidation,
            enemyComposition: enemyStats.compositionValidation,
            keyVictoryConditions: this.generateKeyVictoryConditions(playerStats, enemyStats, advantage)
        };
    }

    generateKeyVictoryConditions(playerStats, enemyStats, advantage) {
        const conditions = {
            player: [],
            enemy: []
        };

        // Add composition-based conditions
        if (!playerStats.compositionValidation.isValid) {
            conditions.player.push("Overcome team composition disadvantage by focusing on individual mechanical skill");
            conditions.enemy.push("Exploit enemy's incomplete team composition through objective control");
        }

        if (!enemyStats.compositionValidation.isValid) {
            conditions.player.push("Capitalize on enemy's incomplete team composition through organized teamfights");
            conditions.enemy.push("Compensate for composition weakness through superior map control");
        }

        // Add stat-based conditions
        if (playerStats.adjustedStats.damage > enemyStats.adjustedStats.damage) {
            conditions.player.push("Maximize damage output through proper positioning");
        }
        if (playerStats.adjustedStats.durability > enemyStats.adjustedStats.durability) {
            conditions.player.push("Force extended teamfights to utilize superior durability");
        }
        if (playerStats.adjustedStats.cc > enemyStats.adjustedStats.cc) {
            conditions.player.push("Initiate fights with coordinated CC chains");
        }

        if (enemyStats.adjustedStats.damage > playerStats.adjustedStats.damage) {
            conditions.enemy.push("Look for burst damage windows when enemy CC is on cooldown");
        }
        if (enemyStats.adjustedStats.durability > playerStats.adjustedStats.durability) {
            conditions.enemy.push("Engage in sustained fights to outlast the enemy");
        }
        if (enemyStats.adjustedStats.cc > playerStats.adjustedStats.cc) {
            conditions.enemy.push("Control key targets with superior CC abilities");
        }

        return conditions;
    }
}
