import { heroes, roleOrder } from './data/heroes.js';
import { teamStrategies } from './data/teamStrategies.js';
import { GameState } from './modules/GameState.js';
import { DraftLogic } from './modules/DraftLogic.js';
import { UI } from './modules/UI.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameState = new GameState();
    const draftLogic = new DraftLogic(gameState, heroes, teamStrategies);
    const ui = new UI(gameState, draftLogic, teamStrategies, roleOrder);
});
