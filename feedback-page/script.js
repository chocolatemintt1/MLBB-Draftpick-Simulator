import { database } from './firebase-config.js';
import { ref, push, set, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.querySelector('.name-input');
    const feedbackInput = document.querySelector('.feedback-input');
    const submitButton = document.querySelector('.submit-btn');
    const feedbackList = document.querySelector('.feedback-list');
    const statusMessage = document.querySelector('.status-message');
    const starRating = document.querySelector('.star-rating');
    let currentRating = 0;
    
    // Pagination state
    const itemsPerPage = 5;
    let currentPage = 1;
    let allFeedbacks = [];

    // Star rating functionality
    starRating.addEventListener('click', (e) => {
        if (e.target.tagName === 'I') {
            const rating = parseInt(e.target.dataset.rating);
            currentRating = rating;
            updateStars(rating);
        }
    });

    starRating.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'I') {
            const rating = parseInt(e.target.dataset.rating);
            updateStars(rating);
        }
    });

    starRating.addEventListener('mouseout', () => {
        updateStars(currentRating);
    });

    function updateStars(rating) {
        const stars = starRating.querySelectorAll('i');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }

    // Pagination controls
    function createPaginationControls(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn';
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderFeedbacks();
            }
        });
        
        // Page numbers
        const pageNumbers = document.createElement('div');
        pageNumbers.className = 'page-numbers';
        
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `page-number ${currentPage === i ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderFeedbacks();
            });
            pageNumbers.appendChild(pageButton);
        }
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn';
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderFeedbacks();
            }
        });
        
        paginationDiv.appendChild(prevButton);
        paginationDiv.appendChild(pageNumbers);
        paginationDiv.appendChild(nextButton);
        
        return paginationDiv;
    }

    // Show status message
    const showStatus = (message, isError = false) => {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message ' + (isError ? 'error' : 'success');
        setTimeout(() => {
            statusMessage.className = 'status-message';
        }, 3000);
    };

    // Render feedbacks with pagination
    function renderFeedbacks() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedFeedbacks = allFeedbacks.slice(startIndex, endIndex);
        
        // Clear existing content
        feedbackList.innerHTML = '';
        
        // Create feedback items container
        const feedbackItems = document.createElement('div');
        feedbackItems.className = 'feedback-items';
        
        // Add feedback items
        paginatedFeedbacks.forEach(item => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';
            feedbackItem.innerHTML = `
                <div class="feedback-header">
                    <span class="user-name">${item.userName || 'Anonymous'}</span>
                    <span class="stars-display">
                        ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
                    </span>
                </div>
                <div class="feedback-content">${item.text}</div>
                <div class="timestamp">
                    ${item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Just now'}
                </div>
            `;
            feedbackItems.appendChild(feedbackItem);
        });
        
        // Add feedback items and pagination to the container
        feedbackList.appendChild(feedbackItems);
        feedbackList.appendChild(createPaginationControls(allFeedbacks.length));
    }

    // Load existing feedback from Firebase
    const loadFeedback = () => {
        const feedbackRef = ref(database, 'feedback');
        
        onValue(feedbackRef, (snapshot) => {
            const feedbacks = snapshot.val();
            
            if (feedbacks) {
                allFeedbacks = Object.entries(feedbacks)
                    .map(([key, value]) => ({ ...value, key }))
                    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                
                renderFeedbacks();
            } else {
                feedbackList.innerHTML = '<p>No feedback yet.</p>';
            }
        }, (error) => {
            console.error('Error loading feedback:', error);
            showStatus('Error loading feedback. Please try again later.', true);
        });
    };

    // Submit new feedback
    submitButton.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const text = feedbackInput.value.trim();

        if (!name) {
            showStatus('Please enter your name.', true);
            return;
        }
        if (!text) {
            showStatus('Please enter some feedback before submitting.', true);
            return;
        }
        if (!currentRating) {
            showStatus('Please select a rating.', true);
            return;
        }

        submitButton.disabled = true;

        try {
            const feedbackRef = ref(database, 'feedback');
            const newFeedbackRef = push(feedbackRef);

            await set(newFeedbackRef, {
                userName: name,
                text: text,
                rating: currentRating,
                timestamp: serverTimestamp()
            });

            nameInput.value = '';
            feedbackInput.value = '';
            currentRating = 0;
            updateStars(0);
            showStatus('Feedback submitted successfully!');
            currentPage = 1; // Reset to first page after new submission
        } catch (error) {
            console.error('Error saving feedback:', error);
            showStatus('Error saving feedback. Please try again.', true);
        } finally {
            submitButton.disabled = false;
        }
    });

    // Initial load
    loadFeedback();
});