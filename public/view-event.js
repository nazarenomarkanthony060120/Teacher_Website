import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, addDoc, query, where, getCountFromServer, orderBy } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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


var events = []
async function getEvents (){
    const colRef = collection (db, 'Event/')
    const event_posted = query(colRef, where('mentioned', '==', localStorage.getItem('userID')));
    var snapshot = await getDocs (event_posted)
    snapshot.docs.forEach((doc) => {
        renderEvendPosted (doc)
    })
}

function renderEvendPosted (doc) {
    var body = document.querySelector('.event-posted-container')

    var event_posted_container = document.createElement('div')
    var div_date = document.createElement('div')
    var div_what = document.createElement('div')
    var div_when = document.createElement('div')
    var div_where = document.createElement('div')

    var span_date = document.createElement('span')
    var span_what = document.createElement('span')
    var span_when = document.createElement('span')
    var span_where = document.createElement('span')

    event_posted_container.className = 'event_posted_container'
    div_date.className = 'div_date'

    span_date.textContent = doc.data().date
    span_what.textContent = 'What: ' + doc.data().what_event
    span_when.textContent = 'When: ' + doc.data().when_event
    span_where.textContent = 'Where: ' + doc.data().wher_event
    
    div_date.appendChild(span_date)
    div_what.appendChild(span_what)
    div_when.appendChild(span_when)
    div_where.appendChild(span_where)

    event_posted_container.appendChild(div_date)
    event_posted_container.appendChild(div_what)
    event_posted_container.appendChild(div_when)
    event_posted_container.appendChild(div_where)

    body.appendChild(event_posted_container)
}


window.addEventListener('DOMContentLoaded', async (event) => {
    await getEvents()
})

