import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, deleteDoc, addDoc, query, where, getCountFromServer, orderBy } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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

var teacher_info = []
async function getTeacherInfo (){
    const colRef = doc (db, 'Teacher/' + localStorage.getItem('userID'))
    const snapshot = await getDoc(colRef);
    if (snapshot.exists()){
        teacher_info.push([ snapshot.data().grade, snapshot.data().f_name + ' ' + snapshot.data().m_name + ' ' + snapshot.data().l_name])
    }
};

async function getStudents (){
    const colRef = collection (db, 'Student/')
    const gradeQuery = query(colRef, where('grade', '==', teacher_info[0][0]));
    var snapshot = await getDocs (gradeQuery)
    snapshot.docs.forEach((doc) => {
        renderParents(doc)
        // students.push([doc.data().parent_id])
    })
}

var parents = []
async function parentInfo (span_name, userID){
    const colRef = doc (db, 'Pupil/' + userID)
    const snapshot = await getDoc(colRef);
    if (snapshot.exists()){
        parents.push([snapshot.id, snapshot.data().f_name + ' ' + snapshot.data().m_name + ' ' + snapshot.data().l_name])
        span_name.textContent = snapshot.data().f_name + ' ' + snapshot.data().m_name + ' ' + snapshot.data().l_name
    } else {
        console.log('wala')
    }
}

async function uploadPost (post, mentioned, current_date, time, date_time, teacher_id){
    addDoc(collection(db, 'Post/'), {
        post : post,
        date_posted : current_date,
        time : time,
        mentioned : mentioned,
        status : 'Teacher',
        teacher_id : teacher_id,
        date_time : date_time
    }).then((doc) => {
        console.log(`Document ID: ${doc.id}`)
        location.reload()
    }).catch((error) => {
        console.log(error.message)
    })
}

async function getPost (){
    const colRef = collection(db, 'Post/');
    const teacher_id = localStorage.getItem('userID');
    const q = query(colRef, where('teacher_id', '==', teacher_id), orderBy('date_time', 'desc'));
    getDocs(q)
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            renderPost(doc)
        });
    })
    .catch((error) => {
        console.log('Error getting documents:', error);
    });
}

var time_date 
async function getNumberOfPost (){
    const colRef = collection (db, 'Post')
    var snapshot = await getCountFromServer(colRef)
    time_date = snapshot.data().time_date
}

var mentionedID = []
var mentionedName = []
async function insertAndRemoveMentioned (choice, index){
    if (choice === 1) {
        mentionedID.push([parents[index][0]])
        mentionedName.push([' ' + parents[index][1]])
        document.getElementById('mentioned-text-area').textContent = mentionedName
    } else if (choice === 2) {
        const selectedDocId = parents[index][0]
        const indexToRemove = mentionedID.findIndex(item => item[0] === selectedDocId);
        console.log(indexToRemove)
        if (indexToRemove !== -1){
            mentionedID.splice(indexToRemove, 1)
            mentionedName.splice(indexToRemove, 1)
            document.getElementById('mentioned-text-area').textContent = mentionedName
        }
    }
    
}

async function getMentionedName (span_context, userID){
    const colRef = doc (db, 'Pupil/' + userID)
    const snapshot = await getDoc(colRef);
    if (snapshot.exists()){
        span_context.textContent = `To: ` + snapshot.data().f_name + ' ' + snapshot.data().m_name + ' ' + snapshot.data().l_name
    } else {
        const col = doc (db, 'Teacher/' + userID)
        const snap = await getDoc(col)
        if (snap.exists()){
            span_context.textContent = snap.data().f_name + ' ' + snap.data().m_name + ' ' + snap.data().l_name
        }
    }
}

async function deletePost (post_id) {
    var colRef = doc(db, 'Post/', post_id)
    await deleteDoc (colRef)
    .then(() => {
        location.reload()
    })

}

async function getAnnouncement (){
    const colRef = collection (db, 'Announcement/')
    const mentioned_id = query(colRef, where('mentioned_id', '==', localStorage.getItem('userID')));
    var snapshot = await getDocs (mentioned_id)
    snapshot.docs.forEach((doc) => {
        renderAnnouncement(doc)
    })
}

function renderAnnouncement (doc) {
    var announcement_section = document.querySelector('.announcement-section')

    var announcement_container = document.createElement('div')
    var div_time_date = document.createElement('div')
    var div_time = document.createElement('div')
    var div_date = document.createElement('div')
    var div_announcement = document.createElement('div')

    var span_time = document.createElement('span')
    var span_date = document.createElement('span')
    var span_announcement = document.createElement('span')

    announcement_container.className = 'announcement_container'
    div_time_date.className = 'div_time_date'

    span_time.textContent = doc.data().time
    span_date.textContent = doc.data().date
    span_announcement.textContent = doc.data().announcement

    div_time.appendChild(span_time)
    div_date.appendChild(span_date)

    div_time_date.appendChild(div_time)
    div_time_date.appendChild(div_date)

    div_announcement.appendChild(span_announcement)
    
    announcement_container.appendChild(div_time_date)
    announcement_container.appendChild(div_announcement)

    announcement_section.appendChild(announcement_container)
}

var postID = []
function renderPost (doc){
    var posted_section = document.querySelector('.posted-section')
    var posted_announce_container = document.createElement('div')
    var name_status_date = document.createElement('div')
    var name_status = document.createElement('div')
    var name = document.createElement('div')
    var status = document.createElement('div')
    var close_date_time = document.createElement('div')
    var close_date = document.createElement('div')
    var close = document.createElement('div')
    var date = document.createElement('div')
    var time = document.createElement('div')
    var content_container = document.createElement('div')
    var content_upper = document.createElement('div')
    var content_lower = document.createElement('div')

    var span_name = document.createElement('span')
    var span_status = document.createElement('span')
    var span_close = document.createElement('span')
    var span_date = document.createElement('span')
    var span_time = document.createElement('span')
    var span_content_upper = document.createElement('span')
    var span_content_lower = document.createElement('span')

    posted_announce_container.className = 'posted_announce_container'
    name_status_date.className = 'name_status_date'
    name_status.className = 'name_status'
    date.className = 'date_posted'
    content_upper.className = 'content_upper'
    content_lower.className = 'content_lower'
    close_date_time.className = 'close_date_time'
    close_date.className = 'close_date'
    close.className = 'close'
    date.className = 'date'
    time.className = 'time'

    // span_name.textContent = doc.data().teacher_name
    getMentionedName(span_name, doc.data().teacher_id)
    span_status.textContent = doc.data().status
    span_close.innerHTML = '<i class="fa-sharp fa-solid fa-circle-xmark"></i>'
    span_date.textContent = doc.data().date_posted
    span_time.textContent = doc.data().time
    span_content_upper.textContent = doc.data().post
    
    postID.push([doc.id])

    getMentionedName(span_content_lower, doc.data().mentioned)

    name.appendChild(span_name)
    status.appendChild(span_status)

    name_status.appendChild(name)
    name_status.appendChild(status)

    close.appendChild(span_close)
    date.appendChild(span_date)
    time.appendChild(span_time)

    close_date.appendChild(date)
    close_date.appendChild(close)

    close_date_time.appendChild(close_date)
    close_date_time.appendChild(time)

    name_status_date.appendChild(name_status)
    name_status_date.appendChild(close_date_time)

    content_upper.appendChild(span_content_upper)
    content_lower.appendChild(span_content_lower)

    content_container.appendChild(content_upper)
    content_container.appendChild(content_lower)

    posted_announce_container.appendChild(name_status_date)
    posted_announce_container.appendChild(content_container)
 
    posted_section.appendChild(posted_announce_container)
}

var x = 1
var parents = []
function renderParents (doc){
    var tbody = document.querySelector('.mention-table-body')

    var td_no = document.createElement('td')
    var td_name = document.createElement('td')
    var td_check = document.createElement('td')
    var tr = document.createElement('tr')

    var span_no = document.createElement('span')
    var span_name = document.createElement('span')

    var checkbox_div = document.createElement('div')

    span_no.textContent = `${x++}.`
    checkbox_div.innerHTML = '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="mentionCheck"></div>'

    parentInfo(span_name, doc.data().parent_id)
    tr.className = 'text-center'
    checkbox_div.className = 'mention-checkbox d-flex justify-content-center'

    td_no.appendChild(span_no)
    td_name.appendChild(span_name)
    td_check.appendChild(checkbox_div)

    tr.appendChild(td_no)
    tr.appendChild(td_name)
    tr.appendChild(td_check)

    tbody.appendChild(tr)
}

async function getTeacherName (){
    const id = localStorage.getItem('userID')
    const span_context = document.querySelector('.left-navbar .logo-container #teacher-name')
    const colRef = doc (db, 'Teacher/' + id)
    const snapshot = await getDoc(colRef);
    if (snapshot.exists()){
        span_context.textContent = 'Hello, ' + snapshot.data().f_name + '!'
    }
}

window.addEventListener('DOMContentLoaded', async (event) => {
    await getTeacherName()
    await getTeacherInfo()
    await getNumberOfPost()
    await getAnnouncement()
    await getPost()
    await getStudents()
    // await getParents()
    var isMention = true
    
    document.getElementById('mention-parents').addEventListener('click', (e) => {
        if (isMention === true){
            document.querySelector('.inside-lower').style.display = 'block'
            isMention = false
        } else {
            document.querySelector('.inside-lower').style.display = 'none'
            isMention = true
        } 
    })

    var checkedAll = false
    document.querySelector('.mention-all-btn').addEventListener('click', (e) => {
        if (checkedAll === false){
            document.getElementById('mentioned-text-area').textContent = 'Mentioned Here!'
            mentionedName = []
            document.querySelectorAll('.mention-table-body tr #mentionCheck').forEach((element, index) => {
                element.checked = true
                insertAndRemoveMentioned(1, index)
            })
            checkedAll = true
        } else {
            document.querySelectorAll('.mention-table-body tr #mentionCheck').forEach((element, index) => {
                element.checked = false
                document.getElementById('mentioned-text-area').textContent = 'Mentioned Here!'
            })
            mentionedID = []
            mentionedName = []
            checkedAll = false
        }
        
    })

    document.querySelectorAll('.mention-table-body tr #mentionCheck').forEach((element, index) => {
        element.addEventListener('click', (e) => {
            if (e.target.checked === true) {
                insertAndRemoveMentioned(1, index)
                
            } else {
                insertAndRemoveMentioned(2, index)
            }
        })
    })

    var isPostBTNClick = true
    document.getElementById('post-btn').addEventListener('click', (e) => {
        if (isPostBTNClick){
            var post = document.getElementById('post-text-area').value
            var date = new Date()
            var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
            var current_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            let date_time = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds()
            mentionedID.forEach((items, index) => {
                uploadPost(post, mentionedID[index][0], current_date, time, date_time, localStorage.getItem('userID'))
            })
            isPostBTNClick = false
        }
    })

    document.querySelectorAll('.close').forEach((element, index) => {
        element.addEventListener('click', (e) => {
            document.getElementById('mentioned-text-area').textContent = 'close in index : ' + index
            deletePost(postID[index][0])
        })
    })

    var isAnnouncement = true
    document.querySelector('.view-announcement-btn').addEventListener('click', () => {
        if (isAnnouncement === true){
            document.querySelector('.view-announcement-btn').textContent = 'Posted'
            document.querySelector('.posted-section').style.display = 'none'
            document.querySelector('.announcement-section').style.display = 'block'
            isAnnouncement = false

        } else {
            document.querySelector('.view-announcement-btn').textContent = 'Announcement'
            document.querySelector('.posted-section').style.display = 'block'
            document.querySelector('.announcement-section').style.display = 'none'
            isAnnouncement = true
        }
        
    })
})