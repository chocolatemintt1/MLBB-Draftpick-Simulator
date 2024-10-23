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
        
        feedbackList.innerHTML = '';
        const feedbackItems = document.createElement('div');
        feedbackItems.className = 'feedback-items';
        
        paginatedFeedbacks.forEach(item => {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';

            var text = removeTag(item.text);
            feedbackItem.innerHTML = `
                <div class="feedback-header">
                    <span class="user-name">${item.userName || 'Anonymous'}</span>
                    <span class="stars-display">
                        ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
                    </span>
                </div>
                <div class="feedback-content">${text}</div>
                <div class="timestamp">
                    ${item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Just now'}
                </div>
                <button class="reply-btn">Reply</button>
                <div class="reply-form hidden">
                    <input type="text" class="reply-name-input" placeholder="Your Name">
                    <textarea class="reply-text-input" placeholder="Write your reply..."></textarea>
                    <div class="reply-controls">
                        <button class="submit-reply-btn">Submit Reply</button>
                        <button class="cancel-reply-btn">Cancel</button>
                    </div>
                </div>
                <div class="replies-container">
                    ${renderReplies(item.replies)}
                </div>
            `;

            // Add event listeners for reply functionality
            const replyBtn = feedbackItem.querySelector('.reply-btn');
            const replyForm = feedbackItem.querySelector('.reply-form');
            const submitReplyBtn = feedbackItem.querySelector('.submit-reply-btn');
            const cancelReplyBtn = feedbackItem.querySelector('.cancel-reply-btn');
            const replyNameInput = feedbackItem.querySelector('.reply-name-input');
            const replyTextInput = feedbackItem.querySelector('.reply-text-input');

            replyBtn.addEventListener('click', () => {
                replyForm.classList.remove('hidden');
            });

            cancelReplyBtn.addEventListener('click', () => {
                replyForm.classList.add('hidden');
                replyNameInput.value = '';
                replyTextInput.value = '';
            });

            submitReplyBtn.addEventListener('click', async () => {
                const replyName = replyNameInput.value.trim();
                const replyText = replyTextInput.value.trim();

                if (!replyName || !replyText) {
                    showStatus('Please fill in all fields for the reply.', true);
                    return;
                }

                try {
                    const replyRef = ref(database, `feedback/${item.key}/replies`);
                    const newReplyRef = push(replyRef);
                    
                    await set(newReplyRef, {
                        userName: replyName,
                        text: replyText,
                        timestamp: serverTimestamp()
                    });

                    replyForm.classList.add('hidden');
                    replyNameInput.value = '';
                    replyTextInput.value = '';
                    showStatus('Reply submitted successfully!');
                } catch (error) {
                    console.error('Error saving reply:', error);
                    showStatus('Error saving reply. Please try again.', true);
                }
            });

            feedbackItems.appendChild(feedbackItem);
        });
        
        feedbackList.appendChild(feedbackItems);
        feedbackList.appendChild(createPaginationControls(allFeedbacks.length));
    }
    
     // Helper function to render replies
     function renderReplies(replies) {
        if (!replies) return '';
        
        return Object.entries(replies)
            .map(([key, reply]) => `
                <div class="reply-item">
                    <div class="reply-header">
                        <span class="reply-user-name">${reply.userName}</span>
                        <span class="reply-timestamp">
                            ${reply.timestamp ? new Date(reply.timestamp).toLocaleString() : 'Just now'}
                        </span>
                    </div>
                    <div class="reply-text">${removeTag(reply.text)}</div>
                </div>
            `).join('');
    }

    //remove html tags
    function removeTag(str){
	if ((str == null) || (str == ''))
		showStatus('Error saving feedback. Please try again.', true);
	else
		str = str.toString();
	return str.replace(/(<([^>]+)>)/ig, '');
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
