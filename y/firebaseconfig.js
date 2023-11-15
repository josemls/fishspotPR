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
  
    // Get form data
    const spotName = document.getElementById('spot-name').value;
    const description = document.getElementById('description').value;
    // Add more fields as needed
  
    // Submit the suggestion to Firestore
    try {
      await addDoc(collection(db, 'suggestions'), {
        spotName,
        description,
        // Add more fields as needed
        userId: auth.currentUser.uid, // Assuming you want to track which user made the suggestion
        timestamp: serverTimestamp() // Timestamp of the suggestion
      });
      console.log('Suggestion submitted successfully');
      // Clear the form or display a success message
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      // Handle errors, such as displaying an error message to the user
    }
}

// Add a realtime listener for auth state changes
onAuthStateChanged(auth, (user) => {
    // Ensure you have elements with these IDs in your HTML
    const signInButton = document.getElementById('sign-in-button');
    const signOutButton = document.getElementById('sign-out-button');
    const suggestionFormContainer = document.getElementById('suggestion-form-container');
    const loginPrompt = document.getElementById('login-prompt');
    const userNameDisplay = document.getElementById('user-name');

    if (user) {
        // User is signed in
        if (signInButton) signInButton.style.display = 'none';
        if (signOutButton) signOutButton.style.display = 'block';
        if (suggestionFormContainer) suggestionFormContainer.style.display = 'block';
        if (loginPrompt) loginPrompt.style.display = 'none';
        if (userNameDisplay) {
            userNameDisplay.textContent = `Hello, ${user.displayName || 'User'}`;
            userNameDisplay.style.display = 'block';
        }
    } else {
        // No user is signed in
        if (signInButton) signInButton.style.display = 'block';
        if (signOutButton) signOutButton.style.display = 'none';
        if (suggestionFormContainer) suggestionFormContainer.style.display = 'none';
        if (loginPrompt) loginPrompt.style.display = 'block';
        if (userNameDisplay) {
            userNameDisplay.textContent = '';
            userNameDisplay.style.display = 'none';
        }
    }
});

// Make sure DOM is loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the suggestion form
    const form = document.getElementById('suggestion-form');
    if (form) {
        form.addEventListener('submit', submitSuggestion);
    }
    
    
    // Add the signInWithGoogle and userSignOut functions to the window object
    // to make them accessible from the HTML
    window.signInWithGoogle = signInWithGoogle;
    window.userSignOut = userSignOut;
});
document.addEventListener('DOMContentLoaded', () => {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const navMenu = document.querySelector('nav ul');

    dropdownToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
});


    export { db, auth, signInWithGoogle, userSignOut };
