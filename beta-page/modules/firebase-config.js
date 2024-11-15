import { getAuth, signInWithusernameAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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
const database = getDatabase(app);

export { database };

export class FirebaseAuthModal {
    constructor() {
        this.modal = null;
        this.auth = getAuth();
        this.db = getFirestore();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <h2>Login to Save Score</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="username">username:</label>
                        <input type="username" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" required>
                    </div>
                    <div class="error-message"></div>
                    <div class="button-group">
                        <button type="submit" class="login-button">Login & Save</button>
                        <button type="button" class="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .auth-modal-content {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                width: 90%;
                max-width: 400px;
            }

            .form-group {
                margin-bottom: 1rem;
            }

            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
            }

            .form-group input {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .button-group {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
            }

            .button-group button {
                flex: 1;
                padding: 0.5rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .login-button {
                background-color: #4CAF50;
                color: white;
            }

            .cancel-button {
                background-color: #f44336;
                color: white;
            }

            .error-message {
                color: red;
                margin-top: 0.5rem;
            }
        `;

        document.head.appendChild(styles);
        return modal;
    }

    async saveScore(score, username) {
        try {
            const scoresCollection = collection(this.db, 'scores');
            await addDoc(scoresCollection, {
                username: username,
                score: score,
                timestamp: new Date()
            });
            return true;
        } catch (error) {
            console.error('Error saving score:', error);
            return false;
        }
    }

    show(score) {
        this.modal = this.createModal();
        document.body.appendChild(this.modal);

        const form = this.modal.querySelector('#loginForm');
        const errorMessage = this.modal.querySelector('.error-message');
        const cancelButton = this.modal.querySelector('.cancel-button');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = form.querySelector('#username').value;
            const password = form.querySelector('#password').value;

            try {
                // Sign in user
                await signInWithusernameAndPassword(this.auth, username, password);

                // Save score
                const saved = await this.saveScore(score, username);
                if (saved) {
                    alert('Score saved successfully!');
                    this.close();
                } else {
                    errorMessage.textContent = 'Failed to save score. Please try again.';
                }
            } catch (error) {
                errorMessage.textContent = 'Invalid username or password';
            }
        });

        cancelButton.addEventListener('click', () => {
            this.close();
        });
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
}