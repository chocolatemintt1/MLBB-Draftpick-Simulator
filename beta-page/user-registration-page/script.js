import { database } from './firebase-config.js';
import { ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const alias = document.getElementById('alias');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // Error message elements
    const aliasError = document.getElementById('aliasError');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const successMessage = document.getElementById('successMessage');

    // Validation functions
    const validateAlias = (value) => {
        if (value.length < 6 || value.length > 12) {
            return 'Alias must be 6-12 characters long';
        }
        if (/[\[\]<>()]/g.test(value)) {
            return 'Alias must not contain [ ] < > ( )';
        }
        return '';
    };

    const validateUsername = (value) => {
        if (value.length < 6 || value.length > 12) {
            return 'Username must be 6-12 characters long';
        }
        return '';
    };

    const validatePassword = (value) => {
        if (value.length < 6 || value.length > 12) {
            return 'Password must be 6-12 characters long';
        }
        if (!/^[A-Z]/.test(value)) {
            return 'Password must start with a capital letter';
        }
        return '';
    };

    // Check if username already exists
    const checkUsernameExists = async (username) => {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
            const users = snapshot.val();
            return Object.values(users).some(user => user.username === username);
        }
        return false;
    };

    // Real-time validation
    alias.addEventListener('input', (e) => {
        aliasError.textContent = validateAlias(e.target.value);
    });

    username.addEventListener('input', (e) => {
        const value = e.target.value.startsWith('@') ? e.target.value.slice(1) : e.target.value;
        username.value = '@' + value;
        usernameError.textContent = validateUsername(value);
    });

    password.addEventListener('input', (e) => {
        passwordError.textContent = validatePassword(e.target.value);
        if (confirmPassword.value) {
            confirmPasswordError.textContent = 
                e.target.value !== confirmPassword.value ? 'Passwords do not match' : '';
        }
    });

    confirmPassword.addEventListener('input', (e) => {
        confirmPasswordError.textContent = 
            e.target.value !== password.value ? 'Passwords do not match' : '';
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous success message
        successMessage.textContent = '';

        // Validate all fields
        const aliasValidation = validateAlias(alias.value);
        const usernameValidation = validateUsername(username.value.slice(1));
        const passwordValidation = validatePassword(password.value);
        const confirmValidation = password.value !== confirmPassword.value ? 'Passwords do not match' : '';

        // Update error messages
        aliasError.textContent = aliasValidation;
        usernameError.textContent = usernameValidation;
        passwordError.textContent = passwordValidation;
        confirmPasswordError.textContent = confirmValidation;

        // Check if there are any validation errors
        if (!aliasValidation && !usernameValidation && !passwordValidation && !confirmValidation) {
            try {
                // Check if username already exists
                const usernameExists = await checkUsernameExists(username.value);
                if (usernameExists) {
                    usernameError.textContent = 'Username already exists';
                    return;
                }

                // Create a reference to the 'users' node in your database
                const usersRef = ref(database, 'users');
                
                // Create a new user object
                const userData = {
                    alias: alias.value,
                    username: username.value,
                    password: password.value, // In a real app, this should be hashed
                    createdAt: new Date().toISOString()
                };

                // Push the new user data to Firebase
                const newUserRef = push(usersRef);
                await set(newUserRef, userData);

                // Show success message
                successMessage.textContent = 'Account created successfully!';
                successMessage.style.color = 'green';
                form.reset();
            } catch (error) {
                successMessage.textContent = 'Error creating account: ' + error.message;
                successMessage.style.color = 'red';
                console.error('Error saving to Firebase:', error);
            }
        }
    });
});