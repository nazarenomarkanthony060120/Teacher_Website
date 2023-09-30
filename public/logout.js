import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyAjnPzN6UJlBc-_9xVE6XRZDLgmdtvEVKI",
    authDomain: "btes-system.firebaseapp.com",
    projectId: "btes-system",
    storageBucket: "btes-system.appspot.com",
    messagingSenderId: "71757932730",
    appId: "1:71757932730:web:77c9614964b79662e9fa83",
    measurementId: "G-6LK9ZNRQ4S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth()

async function sleep (seconds){
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
}

window.addEventListener('DOMContentLoaded', async(event) => {
    document.querySelector('.logout-parent').addEventListener('click', (e) => {
        signOut(auth).then(async () => {
            alert('logging out')
            await sleep(1)
            location.replace('login.html')
          }).catch((error) => {
            // An error happened.
          });
    
        console.log(2)
    })
})