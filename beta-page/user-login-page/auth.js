import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7y2XwoDAydL4hMNH7NQnWNly87p29Sak",
    authDomain: "mlbb-draft-pick-simulator.firebaseapp.com",
    databaseURL: "https://mlbb-draft-pick-simulator-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "mlbb-draft-pick-simulator",
    storageBucket: "mlbb-draft-pick-simulator.appspot.com",
    messagingSenderId: "648742066343",
    appId: "1:648742066343:web:fcc2c260465a238d93a382",
    measurementId: "G-8JW46P11HY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Check for remembered login
window.addEventListener('load', () => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        try {
            const userData = JSON.parse(rememberedUser);
            document.getElementById('username').value = userData.username;
            if (userData.password) {
                document.getElementById('password').value = userData.password;
            }
            document.getElementById('remember').checked = true;
        } catch (error) {
            console.error('Error loading remembered user:', error);
            localStorage.removeItem('rememberedUser');
        }
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const inputUsername = document.getElementById('username').value;
    const inputPassword = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Show loading indicator
    const loadingSpinner = document.getElementById('loading');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }
    
    try {
        // Get reference to users node and fetch all users
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef).catch(error => {
            console.error('Database read error:', error);
            throw new Error(`Database access denied: ${error.message}`);
        });
        
        if (snapshot.exists()) {
            let found = false;
            let authenticated = false;
            
            // Iterate through all users to find matching username
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.username === inputUsername) {
                    found = true;
                    if (userData.password === inputPassword) {
                        authenticated = true;
                        
                        // Handle "Remember me" functionality
                        if (rememberMe) {
                            localStorage.setItem('rememberedUser', JSON.stringify({
                                username: inputUsername,
                                password: inputPassword
                            }));
                        } else {
                            localStorage.removeItem('rememberedUser');
                        }
                        
                        // Store user data in session storage
                        sessionStorage.setItem('username', inputUsername);
                        sessionStorage.setItem('alias', userData.alias);
                        sessionStorage.setItem('isLoggedIn', 'true');
                        sessionStorage.setItem('isAdmin', userData.username === '@admin' ? 'true' : 'false');
                        
                        // Redirect to dashboard
                        window.location.href = 'dashboard.html';
                    }
                }
            });
            
            if (!found) {
                alert('Username not found!');
            } else if (!authenticated) {
                alert('Invalid password!');
            }
        } else {
            throw new Error('No users found in database!');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    } finally {
        // Hide loading indicator
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
});

// Check login status on page load
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    if (isLoggedIn === 'true') {
        // If on login page but already logged in, redirect to dashboard
        if (currentPage.includes('login.html') || currentPage.endsWith('/')) {
            window.location.href = 'dashboard.html';
        }
    }
}

// Run check on page load
checkLoginStatus();