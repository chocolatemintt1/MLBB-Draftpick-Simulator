import { database } from '../firebase-configuration-files/firebase-config.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

const leaderboardBody = document.getElementById('leaderboard-body');
const totalPlayersElement = document.getElementById('total-players');

// Function to create leaderboard row
function createLeaderboardRow(player, index) {
    const row = document.createElement('tr');
    const rankClass = index < 3 ? `rank-${index + 1} top-3` : '';

    row.innerHTML = `
                <td class="rank ${rankClass}">#${index + 1}</td>
                <td>${player.alias || 'N/A'}</td>
                <td>${player.username || 'N/A'}</td>
            `;

    return row;
}

// Listen for changes in the users data
const usersRef = ref(database, 'users');
onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    leaderboardBody.innerHTML = '<tr><td colspan="3" class="loading">Loading...</td></tr>';

    if (data) {
        // Convert object to array and sort alphabetically by username
        const players = Object.values(data)
            .sort((a, b) => (a.username || '').localeCompare(b.username || ''));

        // Update total players count
        totalPlayersElement.textContent = players.length;

        // Clear loading message
        leaderboardBody.innerHTML = '';

        // Populate leaderboard
        players.forEach((player, index) => {
            leaderboardBody.appendChild(createLeaderboardRow(player, index));
        });
    }
});