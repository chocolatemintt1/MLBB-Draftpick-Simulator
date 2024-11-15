import { database } from '../firebase-configuration-files/firebase-config.js';
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let currentUserId = null;

document.addEventListener('DOMContentLoaded', () => {
    const verifyForm = document.getElementById('verifyForm');
    const resetForm = document.getElementById('resetForm');
    const loadingSpinner = document.getElementById('loading');
    const successModal = document.getElementById('successModal');

    // Add @ to username input if not present
    document.getElementById('username').addEventListener('input', (e) => {
        const value = e.target.value.startsWith('@') ? e.target.value : '@' + e.target.value;
        e.target.value = value;
    });

    // Validate password
    const validatePassword = (value) => {
        if (value.length < 6 || value.length > 12) {
            return 'Password must be 6-12 characters long';
        }
        if (!/^[A-Z]/.test(value)) {
            return 'Password must start with a capital letter';
        }
        return '';
    };

    // Handle real-time password validation
    document.getElementById('newPassword').addEventListener('input', (e) => {
        const error = validatePassword(e.target.value);
        document.getElementById('newPasswordError').textContent = error;
        
        // Check confirm password match if it has a value
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword.value) {
            document.getElementById('confirmPasswordError').textContent = 
                e.target.value !== confirmPassword.value ? 'Passwords do not match' : '';
        }
    });

    document.getElementById('confirmPassword').addEventListener('input', (e) => {
        const newPassword = document.getElementById('newPassword').value;
        document.getElementById('confirmPasswordError').textContent = 
            e.target.value !== newPassword ? 'Passwords do not match' : '';
    });

    // Handle account verification
    verifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingSpinner.style.display = 'block';

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const usernameError = document.getElementById('usernameError');
        const emailError = document.getElementById('emailError');

        try {
            // Clear previous errors
            usernameError.textContent = '';
            emailError.textContent = '';

            // Check if account exists with matching username and email
            const usersRef = ref(database, 'users');
            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                let userFound = false;
                snapshot.forEach((childSnapshot) => {
                    const userData = childSnapshot.val();
                    if (userData.username === username && userData.email === email) {
                        userFound = true;
                        currentUserId = childSnapshot.key;
                    }
                });

                if (userFound) {
                    // Show reset password form
                    verifyForm.style.display = 'none';
                    resetForm.style.display = 'block';
                } else {
                    throw new Error('No account found with these credentials.');
                }
            } else {
                throw new Error('No users found in database.');
            }
        } catch (error) {
            console.error('Verification error:', error);
            // Show error on both fields since we don't want to indicate which one is wrong
            usernameError.textContent = error.message;
            emailError.textContent = error.message;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });

     // Handle password reset
     resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingSpinner.style.display = 'block';

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const newPasswordError = document.getElementById('newPasswordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        try {
            // Validate password
            const passwordError = validatePassword(newPassword);
            if (passwordError) {
                newPasswordError.textContent = passwordError;
                return;
            }

            // Validate password match
            if (newPassword !== confirmPassword) {
                confirmPasswordError.textContent = 'Passwords do not match';
                return;
            }

            // Update password in database
            if (currentUserId) {
                await update(ref(database, `users/${currentUserId}`), {
                    password: newPassword
                });

                // Show success modal instead of alert
                successModal.style.display = 'flex';
            } else {
                throw new Error('Session expired. Please try again.');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            newPasswordError.textContent = error.message;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });

    window.redirectToLogin = function() {
        window.location.href = 'login.html';
    };
});