import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, orderBy, query, where } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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

async function getTeacherInfo (){
    const colRef = doc (db, 'Teacher/' + localStorage.getItem('userID'))
    const snapshot = await getDoc(colRef);
    if (snapshot.exists()){
        setTeacherGrade(snapshot.data().grade)
    }
};

async function getStudentAttendance (){
    const colRef = collection(db, 'Attendance')
    var grade = query (colRef, where('grade', '==', getTeacherGrade()), orderBy('date_time', 'desc'))
    const snapshot = await getDocs(grade)
    snapshot.docs.forEach((doc) => {
        renderStudentAttendance (doc)
        designAttendance()
    })
}

async function getMentionedName (span_context, userID){
    const colRef = doc (db, 'Student/' + userID)
    const snapshot = await getDoc(colRef);
    if (snapshot.exists()){
        span_context.textContent = snapshot.data().first_name + ' ' + snapshot.data().middle_name + ' ' + snapshot.data().surname
    }
}


async function getEachStudentAttendance (){
    const colRef = collection(db, 'Attendance')
    var grade = query (colRef, where('student_id', '==', getStudentID()), orderBy('date_time', 'desc'))
    const snapshot = await getDocs(grade)
    snapshot.docs.forEach((doc) => {
        
        renderEachStudentAttendance (doc)
        attendanceCondition()
        designAttendance()
    })
}

var i =1
function renderEachStudentAttendance (doc) {
    var tbody = document.querySelector('.attendance .attendance-student-tbody')
    var tr = document.createElement('tr')

    var td_row_no = document.createElement('td')
    var td_name = document.createElement('td')
    var td_date_time = document.createElement('td')
    var td_attendance = document.createElement('td')

    var span_row_no = document.createElement('span')
    var span_name = document.createElement('span')
    var span_time = document.createElement('span')
    var span_date = document.createElement('span')
    var span_attendance = document.createElement('span')

    var div_time = document.createElement('div')
    var div_date = document.createElement('div')
    var div_time_date = document.createElement('div')

    td_row_no.className = 'p-3'
    td_name.className = 'p-3'
    td_attendance.className = 'p-3'
    span_attendance.className = 'attendance-attendance span_attendance'
    div_date.className = 'div_date'
    td_date_time.className = 'td_date_time'

    span_row_no.textContent = `${i++}.`
    getMentionedName(span_name, doc.data().student_id)
    span_time.textContent = doc.data().time
    span_date.textContent = doc.data().date
    span_attendance.textContent = doc.data().attendance

    div_time.appendChild(span_time)
    div_date.appendChild(span_date)

    div_time_date.appendChild(div_time)
    div_time_date.appendChild(div_date)

    td_row_no.appendChild(span_row_no)
    td_name.appendChild(span_name)
    td_date_time.appendChild(div_time_date)
    td_attendance.appendChild(span_attendance)

    tr.appendChild(td_row_no)
    tr.appendChild(td_name)
    tr.appendChild(td_date_time)
    tr.appendChild(td_attendance)

    tbody.appendChild(tr)
}

var x = 1
var students = []
function renderStudentAttendance (doc) {
    var tbody = document.querySelector('.attendance .attendance-tbody')
    var tr = document.createElement('tr')

    var td_row_no = document.createElement('td')
    var td_name = document.createElement('td')
    var td_date = document.createElement('td')
    var td_attendance = document.createElement('td')
    var td_button = document.createElement('td')

    var span_row_no = document.createElement('span')
    var span_name = document.createElement('span')
    var span_time = document.createElement('span')
    var span_date = document.createElement('span')
    var span_attendance = document.createElement('span')

    var div_time_date = document.createElement('div')
    var div_time = document.createElement('div')
    var div_date = document.createElement('div')
    var div_button = document.createElement('div')

    td_row_no.className = 'p-3'
    td_name.className = 'p-3 td-student-name'
    span_attendance.className = 'attendance-attendance'
    td_date.className = 'td_date'
    td_attendance.className = 'p-3'

    span_row_no.textContent = `${x++}.`
    getMentionedName(span_name, doc.data().student_id)
    span_time.textContent = doc.data().time
    span_date.textContent = doc.data().date
    span_attendance.textContent = doc.data().attendance

    students.push([doc.data().student_id])

    div_button.innerHTML = '<button class="student-view-attendance-btn btn btn-primary">View Attendance</button>'

    div_time.appendChild(span_time)
    div_date.appendChild(span_date)

    div_time_date.appendChild(div_time)
    div_time_date.appendChild(div_date)


    td_row_no.appendChild(span_row_no)
    td_name.appendChild(span_name)
    td_date.appendChild(div_time_date)
    td_attendance.appendChild(span_attendance)
    td_button.appendChild(div_button)

    tr.appendChild(td_row_no)
    tr.appendChild(td_name)
    tr.appendChild(td_date)
    tr.appendChild(td_attendance)
    tr.appendChild(td_button)

    tbody.appendChild(tr)
}

function attendanceCondition (){
    var present = 0
    var absent = 0
    document.querySelectorAll('.attendance .attendance-student-container .attendance-student-table .attendance-student-tbody tr .attendance-attendance').forEach((element) => {
        if (element.textContent === 'Present'){
            document.querySelector('.attendance .attendance-student-container .back-attendance-present-absent-container .attendance-present-absent #attedance-present').value = ++present 
        } else { 
            document.querySelector('.attendance .attendance-student-container .back-attendance-present-absent-container .attendance-present-absent #attedance-absent').value = ++absent
        }
    })
} 

var student_id
function setStudentID (unique_id){
    student_id = unique_id
}

function getStudentID (){
    return student_id
}

function designAttendance(){
    document.querySelectorAll('.attendance-attendance').forEach((element) => {
        if (element.textContent === 'Present'){
            element.style.color = '#000'
            element.style.background = 'rgb(39, 255, 39)'
            element.style.padding = '10px 35px'
            element.style.border = '2px solid rgb(5, 129, 5)'
        } else {
            element.style.color = '#fff'
            element.style.background = '#f03535'
            element.style.padding = '10px 35px'
            element.style.border = '2px solid rgb(188, 28, 28)'
        }
    })
}

function deleteTableRow(){
    i = 1
    var table_body = document.querySelectorAll('.attendance .attendance-student-container .attendance-student-table .attendance-student-tbody tr')
    for (const row of table_body){
        row.remove()
    }
}

function countTableRow (){
    var table_body = document.querySelectorAll('.attendance .attendance-student-container .attendance-student-table .attendance-student-tbody')
    console.log(table_body.rowsmS)
}

var teacher_grade
function setTeacherGrade (grade){
    teacher_grade = grade
}

function getTeacherGrade (){
    return teacher_grade
}

window.addEventListener('DOMContentLoaded', async(event) => {
    await getTeacherInfo()
    await getStudentAttendance()

    document.querySelector('.attendance .search-text-input-container #search').addEventListener('keyup', (e) => {
        document.querySelectorAll('.attendance-tbody tr').forEach((row) => {
            row.querySelector('.td-student-name').textContent.toLowerCase().startsWith(e.target.value.toLowerCase()) ? (row.style.display = 'table-row') : (row.style.display = 'none')
        })
    })

    var present = 0
    var absent = 0
    document.querySelector('.attendance .attendance-student-container #search').addEventListener('keyup', (e) => {
        document.querySelectorAll('.attendance-student-tbody tr').forEach((row) => {
            row.querySelector('.div_date').textContent.toLowerCase().startsWith(e.target.value.toLowerCase()) ? (row.style.display = 'table-row') : (row.style.display = 'none')
            // if (row.querySelector('.span_attendance').textContent === 'Present'){
            //     present++
            // } else {
            //     absent++
            // }
            // document.querySelector('.attendance .attendance-student-container .back-attendance-present-absent-container .attendance-present-absent #attedance-present').value = present
            // document.querySelector('.attendance .attendance-student-container .back-attendance-present-absent-container .attendance-present-absent #attedance-absent').value = absent
        })
    })

    document.querySelector('.attendance .attendance-student-container .back-attendance-present-absent-container #back').addEventListener('click', () => {
        document.querySelector('.attendance .attendance-container').style.display = 'block'
        document.querySelector('.attendance .attendance-student-container').style.display = 'none'
    })

    document.querySelectorAll('.attendance .student-view-attendance-btn').forEach((element, index) => {
        element.addEventListener('click', () => {
            document.querySelector('.attendance .attendance-container').style.display = 'none'
            document.querySelector('.attendance .attendance-student-container').style.display = 'block'
            setStudentID(students[index][0])
            getMentionedName(document.querySelector('.attendance .attendance-student-container #student-name'), getStudentID())
            getEachStudentAttendance()
            deleteTableRow()
        })
    })
})