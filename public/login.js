import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyAjnPzN6UJlBc-_9xVE6XRZDLgmdtvEVKI",
  authDomain: "btes-system.firebaseapp.com",
  projectId: "btes-system",
  storageBucket: "btes-system.appspot.com",
  messagingSenderId: "71757932730",
  appId: "1:71757932730:web:77c9614964b79662e9fa83",
  measurementId: "G-6LK9ZNRQ4S"
};

window.addEventListener('DOMContentLoaded', (event) => {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth()

  document.getElementById('login').addEventListener ('click', (e) => {
      e.preventDefault();

      let email = document.getElementById('user_email').value;
      let password = document.getElementById('user_password').value;

      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('userID', user.uid)
        location.replace('dashboard.html')
      })
      .catch((error) => {
        console.log(error)
      });
  })
})