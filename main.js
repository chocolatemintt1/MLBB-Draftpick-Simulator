import { heroes, roleOrder } from './data/heroes.js';
import { teamStrategies } from './data/teamStrategies.js';
import { GameState } from './modules/GameState.js';
import { DraftLogic } from './modules/DraftLogic.js';
import { UI } from './modules/UI.js';
import { PopupManager } from './modules/PopupManager.js';
import { TeamCompositionAnalysis } from './modules/teamCompositionAnalysis.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameState = new GameState();
    const teamAnalysis = new TeamCompositionAnalysis(heroes);
    const draftLogic = new DraftLogic(gameState, heroes, teamStrategies);
    const ui = new UI(gameState, draftLogic, teamStrategies, roleOrder, teamAnalysis);
    const popupManager = new PopupManager();
});
