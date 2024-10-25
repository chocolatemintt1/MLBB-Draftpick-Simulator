// Initialize Firebase (Add this at the start of your file)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export class AuthSystem {
    constructor() {
        this.currentUser = null;
    }

    async login(username, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, `${username}@yourdomain.com`, password);
            this.currentUser = userCredential.user;
            return true;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    }

    async register(username, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, `${username}@yourdomain.com`, password);
            this.currentUser = userCredential.user;
            
            // Create user document in Firestore
            await setDoc(doc(db, "users", this.currentUser.uid), {
                username: username,
                score: 0,
                gamesPlayed: 0
            });
            
            return true;
        } catch (error) {
            console.error("Registration error:", error);
            return false;
        }
    }

    async saveScore(advantagePercentage) {
        if (!this.currentUser) return false;

        try {
            const userDoc = doc(db, "users", this.currentUser.uid);
            const userData = await getDoc(userDoc);
            
            if (userData.exists()) {
                const currentData = userData.data();
                let newScore = currentData.score;
                
                // Add point if player drafted well (advantage > 2.5%)
                if (advantagePercentage > 2.5) {
                    newScore += 1;
                }

                await updateDoc(userDoc, {
                    score: newScore,
                    gamesPlayed: currentData.gamesPlayed + 1
                });

                return true;
            }
            return false;
        } catch (error) {
            console.error("Score saving error:", error);
            return false;
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    logout() {
        this.currentUser = null;
        auth.signOut();
    }
}

// Modify the UI class to include login functionality
export class LoginUI {
    constructor() {
        this.authSystem = new AuthSystem();
        this.createLoginModal();
    }

    createLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'login-modal';
        modal.innerHTML = `
            <div class="login-container">
                <h2>Login to Save Score</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" required>
                    </div>
                    <div class="button-group">
                        <button type="submit" id="loginButton">Login</button>
                        <button type="button" id="registerButton">Register</button>
                    </div>
                </form>
                <div id="loginMessage"></div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupLoginListeners();
    }

    setupLoginListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerButton = document.getElementById('registerButton');
        const loginMessage = document.getElementById('loginMessage');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const success = await this.authSystem.login(username, password);
            if (success) {
                loginMessage.textContent = 'Login successful!';
                loginMessage.style.color = 'green';
                this.hideLoginModal();
                // Save score if applicable
                if (this.pendingScore) {
                    await this.authSystem.saveScore(this.pendingScore);
                    this.pendingScore = null;
                }
            } else {
                loginMessage.textContent = 'Login failed. Please try again.';
                loginMessage.style.color = 'red';
            }
        });

        registerButton.addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const success = await this.authSystem.register(username, password);
            if (success) {
                loginMessage.textContent = 'Registration successful! You can now login.';
                loginMessage.style.color = 'green';
            } else {
                loginMessage.textContent = 'Registration failed. Please try again.';
                loginMessage.style.color = 'red';
            }
        });
    }

    showLoginModal() {
        const modal = document.querySelector('.login-modal');
        modal.style.display = 'flex';
    }

    hideLoginModal() {
        const modal = document.querySelector('.login-modal');
        modal.style.display = 'none';
    }
}