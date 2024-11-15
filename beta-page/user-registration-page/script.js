import { database } from '../firebase-configuration-files/firebase-config.js';
import { ref, push, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const alias = document.getElementById('alias');
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // Error message elements
    const aliasError = document.getElementById('aliasError');
    const emailError = document.getElementById('emailError');
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

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
            return 'Email is required';
        }
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
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

    // Check if username or email already exists
    const checkExistingCredentials = async (username, email) => {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
            const users = snapshot.val();
            const existingUsername = Object.values(users).some(user => user.username === username);
            const existingEmail = Object.values(users).some(user => user.email === email);
            
            return {
                usernameExists: existingUsername,
                emailExists: existingEmail
            };
        }
        return {
            usernameExists: false,
            emailExists: false
        };
    };

    // Real-time validation
    alias.addEventListener('input', (e) => {
        aliasError.textContent = validateAlias(e.target.value);
    });

    email.addEventListener('input', (e) => {
        emailError.textContent = validateEmail(e.target.value);
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
        const emailValidation = validateEmail(email.value);
        const usernameValidation = validateUsername(username.value.slice(1));
        const passwordValidation = validatePassword(password.value);
        const confirmValidation = password.value !== confirmPassword.value ? 'Passwords do not match' : '';

        // Update error messages
        aliasError.textContent = aliasValidation;
        emailError.textContent = emailValidation;
        usernameError.textContent = usernameValidation;
        passwordError.textContent = passwordValidation;
        confirmPasswordError.textContent = confirmValidation;

        // Check if there are any validation errors
        if (!aliasValidation && !emailValidation && !usernameValidation && !passwordValidation && !confirmValidation) {
            try {
                // Check if username or email already exists
                const { usernameExists, emailExists } = await checkExistingCredentials(username.value, email.value);
                
                if (usernameExists) {
                    usernameError.textContent = 'Username already exists';
                    return;
                }
                
                if (emailExists) {
                    emailError.textContent = 'Email already registered';
                    return;
                }

                // Create a reference to the 'users' node in your database
                const usersRef = ref(database, 'users');
                
                // Create a new user object
                const userData = {
                    alias: alias.value,
                    email: email.value,
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