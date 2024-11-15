import { database } from '../firebase-configuration-files/firebase-config.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

const leaderboardBody = document.getElementById('leaderboard-body');
const totalPlayersElement = document.getElementById('total-players');

// Pagination state
let currentPage = 1;
const playersPerPage = 10;
let allPlayers = [];

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

// Function to create pagination controls
function createPaginationControls(totalPages) {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-button';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => changePage(currentPage - 1));
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-button';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => changePage(currentPage + 1));
    
    paginationContainer.appendChild(prevButton);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || // First page
            i === totalPages || // Last page
            (i >= currentPage - 1 && i <= currentPage + 1) // Adjacent pages
        ) {
            const pageButton = document.createElement('button');
            pageButton.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => changePage(i));
            paginationContainer.appendChild(pageButton);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            // Add ellipsis
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    paginationContainer.appendChild(nextButton);
    return paginationContainer;
}

// Function to display current page of players
function displayCurrentPage() {
    const start = (currentPage - 1) * playersPerPage;
    const end = start + playersPerPage;
    const currentPlayers = allPlayers.slice(start, end);
    
    leaderboardBody.innerHTML = '';
    currentPlayers.forEach((player, index) => {
        const globalIndex = start + index;
        leaderboardBody.appendChild(createLeaderboardRow(player, globalIndex));
    });
    
    // Update pagination
    const totalPages = Math.ceil(allPlayers.length / playersPerPage);
    
    // Remove existing pagination if it exists
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    // Add new pagination if there's more than one page
    if (totalPages > 1) {
        const paginationControls = createPaginationControls(totalPages);
        document.querySelector('.leaderboard-content').appendChild(paginationControls);
    }
}

// Function to handle page changes
function changePage(newPage) {
    currentPage = newPage;
    displayCurrentPage();
    
    // Smooth scroll to top of table
    document.querySelector('.table-container').scrollIntoView({ behavior: 'smooth' });
}

// Listen for changes in the users data
const usersRef = ref(database, 'users');
onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    leaderboardBody.innerHTML = '<tr><td colspan="3" class="loading">Loading...</td></tr>';
    
    if (data) {
        // Convert object to array and sort alphabetically by username
        allPlayers = Object.values(data)
            .sort((a, b) => (a.username || '').localeCompare(b.username || ''));
        
        // Update total players count
        totalPlayersElement.textContent = allPlayers.length;
        
        // Display first page
        displayCurrentPage();
    }
});