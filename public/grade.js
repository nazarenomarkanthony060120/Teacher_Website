import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, addDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
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

async function getStudents (){
    const colRef = collection(db, 'Student/')
    var grade = query (colRef, where('grade', '==', getTeacherGrade()))
    var snapshot = await getDocs(grade)
    snapshot.docs.forEach((doc) => {
        renderStudent(doc)
    })
}

async function getSubjects (){
    const colRef = collection(db, 'Subject/')
    var subject = query (colRef, where('grade', '==', getTeacherGrade()))
    var snapshot = await getDocs(subject)
    snapshot.docs.forEach((doc) => {
        renderSubjects(doc)
    })
}

async function  addGrade(){
    var first_grading = document.getElementById('1st-grading').value
    var second_grading = document.getElementById('2nd-grading').value
    var third_grading = document.getElementById('3rd-grading').value
    var fourth_grading = document.getElementById('4th-grading').value

    var ref = doc (db, 'Grade/' + getSubjectUniqueId() + getStudentUniqueId())
    await setDoc (ref, {
        subject_unique_id :  getSubjectUniqueId(),
        student_unique_id : getStudentUniqueId(),
        subject : getSubjectName(),
        first_grading : first_grading,
        second_grading : second_grading,
        third_grading : third_grading,
        fourth_grading : fourth_grading
    }).then (() => {
        console.log('Grade Added')
        location.reload()
    })
}


async function getStudentGrade (){
    deleteTableRowGrade()
    const colRef = collection(db, 'Grade/')
    var grade = query (colRef, where('student_unique_id', '==', getStudentUniqueId(), where('grade', '==', getTeacherGrade())))
    onSnapshot(grade, (snapshot) => {
        snapshot.docs.forEach((doc) => {
            renderGrade(doc)
        })
    })
}

async function setStudentGrade () {
    const colRef = collection(db, 'Grade')
    const q = query(colRef, where('student_unique_id', '==', getStudentUniqueId()), where('subject_unique_id', '==', getSubjectUniqueId()))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
        // Get the document data
        const docData = snapshot.docs[0].data()
        document.getElementById('1st-grading').value = docData.first_grading
        document.getElementById('2nd-grading').value = docData.second_grading
        document.getElementById('3rd-grading').value = docData.third_grading
        document.getElementById('4th-grading').value = docData.fourth_grading

        if (docData.first_grading != '0'){
            document.getElementById('1st-grading').readOnly = true
        } if (docData.second_grading != '0'){
            document.getElementById('2nd-grading').readOnly = true
        } if (docData.third_grading != '0'){
            document.getElementById('3rd-grading').readOnly = true
        } if (docData.fourth_grading != '0'){
            document.getElementById('4th-grading').readOnly = true
        }            
    } else {
        console.log("Document not found");
        document.getElementById('1st-grading').value = 0
        document.getElementById('2nd-grading').value = 0
        document.getElementById('3rd-grading').value = 0
        document.getElementById('4th-grading').value = 0
    }

            
}

var j = 1
var grade = []
function renderGrade (doc) {
    var tbody = document.querySelector('.view-student-grade-body')
    var tr = document.createElement('tr')

    var td_row_no = document.createElement('td')
    var td_subject = document.createElement('td')
    var td_1st = document.createElement('td')
    var td_2nd = document.createElement('td')
    var td_3rd = document.createElement('td')
    var td_4th = document.createElement('td')

    var span_row_no = document.createElement('span')
    var span_subject = document.createElement('span')
    var span_1st = document.createElement('span')
    var span_2nd = document.createElement('span')
    var span_3rd = document.createElement('span')
    var span_4th = document.createElement('span')

    span_row_no.textContent = `${j++}.`
    span_subject.textContent = doc.data().subject
    span_1st.textContent = doc.data().first_grading
    span_2nd.textContent = doc.data().second_grading
    span_3rd.textContent = doc.data().third_grading
    span_4th.textContent = doc.data().fourth_grading

    grade.push([doc.data().subject_unique_id, doc.data().student_unique_id, doc.data().first_grading, doc.data().second_grading, doc.data().third_grading, doc.data().fourth_grading])

    td_row_no.appendChild(span_row_no)
    td_subject.appendChild(span_subject)
    td_1st.appendChild(span_1st)
    td_2nd.appendChild(span_2nd)
    td_3rd.appendChild(span_3rd)
    td_4th.appendChild(span_4th)

    tr.appendChild(td_row_no)
    tr.appendChild(td_subject)
    tr.appendChild(td_1st)
    tr.appendChild(td_2nd)
    tr.appendChild(td_3rd)
    tr.appendChild(td_4th)

    tbody.appendChild(tr)
}

var x = 1
var subject = []
function renderSubjects (doc){
    var tbody = document.querySelector('.student-subject-body')
    var tr = document.createElement('tr')

    var td_row_no = document.createElement('td')
    var td_teacher = document.createElement('td')
    var td_subject = document.createElement('td')
    var td_button = document.createElement('td')

    var span_row_no = document.createElement('span')
    var span_teacher = document.createElement('span')
    var span_subject = document.createElement('span')

    var div_button = document.createElement('div')

    span_row_no.textContent = `${x++}.`
    span_teacher.textContent = doc.data().teacher
    span_subject.textContent = doc.data().subject
    
    subject.push([doc.id, doc.data().subject])

    div_button.innerHTML = '<button class="student-add-grade-btn btn btn-success">Add Grade</button>'

    td_row_no.appendChild(span_row_no)
    td_teacher.appendChild(span_teacher)
    td_subject.appendChild(span_subject)
    td_button.appendChild(div_button)

    tr.appendChild(td_row_no)
    tr.appendChild(td_teacher)
    tr.appendChild(td_subject)
    tr.appendChild(td_button)

    tbody.appendChild(tr)
}

var x = 1
var student = []
function renderStudent (doc){
    var tbody = document.querySelector('.student-grade-body')
    var tr = document.createElement('tr')
    var td_row_no = document.createElement('td')
    var td_name = document.createElement('td')
    var td_button = document.createElement('td')

    var span_row_no = document.createElement('span')
    var span_name = document.createElement('span')

    var div_button = document.createElement('div')

    td_row_no.className = 'p-3'
    td_name.className = 'td-student-name p-3'

    span_row_no.textContent = `${x++}.`
    span_name.textContent = doc.data().first_name + ' ' + doc.data().middle_name + ' ' + doc.data().surname

    student.push([doc.id, doc.data().first_name + ' ' + doc.data().middle_name + ' ' + doc.data().surname])

    div_button.innerHTML = '<button class="student-update-grade-btn btn btn-success">View Grade</button>'

    td_row_no.appendChild(span_row_no)
    td_name.appendChild(span_name)
    td_button.appendChild(div_button)

    tr.appendChild(td_row_no)
    tr.appendChild(td_name)
    tr.appendChild(td_button)

    tbody.appendChild(tr)
}

function deleteTableRowGrade (){
    j = 1
    var table_body = document.querySelectorAll('.view-student-grade-body tr')
    for (const row of table_body){
        row.remove()
    }
}

// function displayStudentGrade (index) {
    // console.log(student_unique_id + ' ' + subject_unique_id)
    // if (student_unique_id === grade[index][1]){
    //     if (subject_unique_id === grade[index][0]) {
    //         document.getElementById('1st-grading').value = grade[index][2]
    //         document.getElementById('2nd-grading').value = grade[index][3]
    //         document.getElementById('3rd-grading').value = grade[index][4]
    //         document.getElementById('4th-grading').value = grade[index][5]
    //         console.log(grade[index][2] + ' ' + grade[index][3] + ' ' + grade[index][4] + grade[index][5])
    //     } else {
    //         document.getElementById('1st-grading').value = 0
    //         document.getElementById('2nd-grading').value = 0
    //         document.getElementById('3rd-grading').value = 0
    //         document.getElementById('4th-grading').value = 0
    //         console.log('no grade')
    //     }
    // } else {
    //     console.log('no grade')
    // }
// }

var student_unique_id
function setStudentUniqueId (unique_id) {
    student_unique_id = unique_id
}

function getStudentUniqueId (){
    return student_unique_id
}

var subject_unique_id
function setSubjectUniqueId (unique_id) {
    subject_unique_id = unique_id
}

function getSubjectUniqueId (){
    return subject_unique_id
}

var subject_name
function setSubjectName (subject) {
    subject_name = subject
}

function getSubjectName (){
    return subject_name
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
    await getStudents()
    await getSubjects()

    document.querySelector('.grade #search-student-grade').addEventListener('keyup', (e) => {
        document.querySelectorAll('.student-grade-body tr').forEach((row) => {
            row.querySelector('.td-student-name').textContent.toLowerCase().startsWith(e.target.value.toLowerCase()) ? (row.style.display = 'table-row') : (row.style.display = 'none')
        })
    })

    document.querySelectorAll('.grade .student-update-grade-btn').forEach((element, index) => {
        element.addEventListener('click', (e) => {
            setStudentUniqueId(student[index][0])
            document.querySelector('.title-section #student-list-update-title').textContent += ' > View Grade'
            document.querySelector('.grade .view-student-grade-div .name').textContent = student[index][1]
            document.querySelector('.grade .view-student-grade-div').style.display = 'block'
            document.querySelector('.grade .grade-section').style.display = 'none'
            getStudentGrade()
        })
    })

    document.querySelectorAll('.grade .student-add-grade-btn').forEach((element, index) => {
        element.addEventListener('click', (e) => {
            document.querySelector('.title-section #student-list-update-title').textContent += ' > Add Grade'
            document.querySelector('.add-student-grade-title span').textContent = 'Add ' + subject[index][1] + ' Grade'
            document.querySelector('.view-student-subject-div').style.display = 'none'
            document.querySelector('.add-student-grade-div').style.display = 'block'
            
            setSubjectUniqueId(subject[index][0])
            setSubjectName(subject[index][1])
            setStudentGrade()

            
        })
    })

    document.querySelector('.view-student-grade-div #back-btn').addEventListener('click', (e) => {
        document.querySelector('.title-section #student-list-update-title').textContent = ' > Student List'
        document.querySelector('.grade .view-student-grade-div').style.display = 'none'
        document.querySelector('.grade .grade-section').style.display = 'block'
    })


    document.querySelector('.grade .view-student-grade-div #add-grade').addEventListener('click', (e) => {
        document.querySelector('.title-section #student-list-update-title').textContent = ' > Student List > Subject List'
        document.querySelector('.grade .view-student-grade-div').style.display = 'none'
        document.querySelector('.grade .view-student-subject-div').style.display = 'block'
        // var first_grading = document.getElementById('1st-grading').value
        // var second_grading = document.getElementById('2nd-grading').value
        // var third_grading = document.getElementById('3rd-grading').value
        // var fourth_grading = document.getElementById('4th-grading').value
        // addGrade(subject_unique_id, student_unique_id, subject_name, first_grading, second_grading, third_grading, fourth_grading)
    })

    document.querySelector('.grade .add-student-grade-div #add-grade').addEventListener('click', () => {
        addGrade()
    })

    document.querySelector('.grade .view-student-subject-div .back-btn').addEventListener('click', () => {
        document.querySelector('.title-section #student-list-update-title').textContent = ' > Student List > View Grade'
        document.querySelector('.grade .view-student-grade-div').style.display = 'block'
        document.querySelector('.grade .view-student-subject-div').style.display = 'none'
    })

    document.getElementById('close-grade').addEventListener('click', (e) => {
        document.querySelector('.title-section #student-list-update-title').textContent = ' > Student List > Subject List'
        document.querySelector('.view-student-subject-div').style.display = 'block'
        document.querySelector('.add-student-grade-div').style.display = 'none'
    })
})