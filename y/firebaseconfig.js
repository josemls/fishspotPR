// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyA1SpBjeOi3wRCKORw8hCMoTi13vBJ7c0k",
    authDomain: "fishspotpr-32604.firebaseapp.com",
    projectId: "fishspotpr-32604",
    storageBucket: "fishspotpr-32604.appspot.com",
    messagingSenderId: "537987470389",
    appId: "1:537987470389:web:1b274b8f1cec875c05cd7c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google auth provider setup
const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
async function signInWithGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Sign in failed:", error);
    }
}

// Function to handle sign-out
async function userSignOut() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Sign out failed:", error);
    }
}

// Function to handle the suggestion form submission
async function submitSuggestion(event) {
    event.preventDefault(); // Prevent the default form submit action

    // Get data from the form
    const formData = {
        nameofspot: document.getElementById('nameofspot').value,
        location: document.getElementById('location').value,
        popularFor: document.getElementById('popular-for').value,
        typeOfFishing: document.getElementById('type-of-fishing').value,
        environment: document.getElementById('environment').value,
        access: document.getElementById('access').value,
        facilities: document.getElementById('facilities').value,
        bestTimeToVisit: document.getElementById('best-time-to-visit').value,
        safetyConsiderations: document.getElementById('safety-considerations').value,
        recommendation: document.getElementById('recommendation').value,
        timestamp: serverTimestamp(),
        userId: auth.currentUser ? auth.currentUser.uid : null
    };

    // Submit the suggestion to Firestore
    try {
        await addDoc(collection(db, 'fishingSuggestions'), formData);
        console.log('Fishing suggestion submitted successfully');
        // Optionally, clear the form here
    } catch (error) {
        console.error('Error submitting suggestion:', error);
    }
}

// Realtime listener for auth state changes
onAuthStateChanged(auth, (user) => {
    const signInButton = document.getElementById('sign-in-button');
    const signOutButton = document.getElementById('sign-out-button');
    const userNameDisplay = document.getElementById('user-name');

    if (user) {
        // User is signed in
        if (signInButton) signInButton.style.display = 'none';
        if (signOutButton) signOutButton.style.display = 'block';
        if (userNameDisplay) {
            userNameDisplay.textContent = `Hello, ${user.displayName || 'User'}`;
            userNameDisplay.style.display = 'block';
        }
    } else {
        // No user is signed in
        if (signInButton) signInButton.style.display = 'block';
        if (signOutButton) signOutButton.style.display = 'none';
        if (userNameDisplay) {
            userNameDisplay.textContent = '';
            userNameDisplay.style.display = 'none';
        }
    }
});

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('suggestion-form');
    if (form) {
        form.addEventListener('submit', submitSuggestion);
    }

    // Add the signInWithGoogle and userSignOut functions to the window object
    // to make them accessible from the HTML
    window.signInWithGoogle = signInWithGoogle;
    window.userSignOut = userSignOut;
});

export { db, auth, signInWithGoogle, userSignOut };
