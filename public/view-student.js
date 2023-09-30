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


async function getTeacherInfo (){
    const colRef = doc (db, 'Teacher/' + localStorage.getItem('userID'))
    const snapshot = await getDoc(colRef);
    if (snapshot.exists()){
        setTeacherGrade(snapshot.data().grade)
    }
};


async function getAllStudents (){
    const colRef = collection (db, 'Student')
    var grade = query (colRef, where('grade', '==', getTeacherGrade()))
    var snapshot = await getDocs (grade)
    snapshot.docs.forEach((doc) => {
        renderStudents(doc)
    })
}

async function getParentName(span_parent, parent_id){
    const colRef = doc(db, 'Parent/' + parent_id)
    const snapshot = await getDoc(colRef)
    if (snapshot.exists()){
        span_parent.textContent = snapshot.data().f_name + ' ' + snapshot.data().m_name + ' ' + snapshot.data().l_name
    }
}

async function displayParents (parent_id){
    const colRef = doc(db, 'Parent/' + parent_id)
    const snapshot = await getDoc (colRef)
    if (snapshot.exists()){
        document.getElementById('name-of-father').textContent = snapshot.data().father_name
        document.getElementById('father-occupation').textContent = snapshot.data().father_occupation
        document.getElementById('father-contact-no').textContent = snapshot.data().father_contact_number
        document.getElementById('name-of-mother').textContent = snapshot.data().mother_name
        document.getElementById('mother-occupation').textContent = snapshot.data().mother_occupation
        document.getElementById('mother-contact-no').textContent = snapshot.data().mother_contact_number
    }
}

var students = []
var x = 1
function renderStudents(doc){
    var tbody = document.querySelector('.view-student-tbody')
    var tr = document.createElement('tr')

    var td_row_no = document.createElement('td')
    var td_name = document.createElement('td')
    var td_grade = document.createElement('td')
    var td_address = document.createElement('td')
    var td_button = document.createElement('td')

    var span_row_no = document.createElement('span')
    var span_name = document.createElement('span')
    var span_grade = document.createElement('span')
    var span_address = document.createElement('span')
    var div_button = document.createElement('div')

    td_row_no.className = 'p-3'
    td_name.className = 'student-name p-3'
    td_grade.className = 'p-3'
    td_address.className = 'p-3'

    span_row_no.textContent = `${x++}.`
    span_name.textContent = doc.data().first_name + ' ' + doc.data().middle_name + ' ' + doc.data().surname
    span_grade.textContent = doc.data().grade
    span_address.textContent = doc.data().address
    div_button.innerHTML = '<button type="button" class="view-student-info btn btn-primary mx-1">View</button>';

    students.push([doc.id, doc.data().date_enrolled, doc.data().age_on_june, doc.data().surname, doc.data().first_name, doc.data().middle_name, doc.data().date_of_birth, doc.data().place_of_birth, doc.data().age, doc.data().sex, doc.data().home_address, doc.data().contact_no, doc.data().religion, doc.data().school_last_attended, doc.data().address, doc.data().grade_level_in_the_previous_school, doc.data().honor_received, doc.data().name_of_father, doc.data().father_occupation, doc.data().father_contact_no, doc.data().name_of_mother, doc.data().mother_occupation, doc.data().mother_contact_no, doc.data().name, doc.data().relationship, doc.data().contact_no_tel, doc.data().cell_no, doc.data().grade, doc.data().status])

    td_row_no.appendChild(span_row_no)
    td_name.appendChild(span_name)
    td_grade.appendChild(span_grade)
    td_address.appendChild(span_address)
    td_button.appendChild(div_button)

    tr.appendChild(td_row_no)
    tr.appendChild(td_name)
    tr.appendChild(td_grade)
    tr.appendChild(td_address)
    tr.appendChild(td_button)

    tbody.appendChild(tr)
}

var teacher_grade
function setTeacherGrade (grade){
    teacher_grade = grade
}

function getTeacherGrade (){
    return teacher_grade
}


window.addEventListener('DOMContentLoaded', async (event) => {
    await getTeacherInfo()
    await getAllStudents()

    document.querySelector('.view-student #search-student-name').addEventListener('keyup', (e) => {
        document.querySelectorAll('.view-student-tbody tr').forEach((row) => {
            row.querySelector('.view-student .student-name').textContent.toLowerCase().startsWith(e.target.value.toLowerCase()) ? (row.style.display = 'table-row') : (row.style.display = 'none')
        })
    })
    
    document.querySelectorAll('.view-student-info').forEach((element, index) => {
        element.addEventListener('click', (e) => {
            document.querySelector('.view-student-container').style.display = 'none'
            document.querySelector('.student-info-container').style.display = 'block'
            display_student_info(index)
        })
    })

    function display_student_info (index) {
        console.log(students)
        document.querySelector('.view-student .student-info-container #date-enrolled').textContent = students[index][1]
        document.querySelector('.view-student .student-info-container #age-on-june').textContent = students[index][2]
        document.querySelector('.view-student .student-info-container #surname').textContent = students[index][3]
        document.querySelector('.view-student .student-info-container #f-name').textContent = students[index][4]
        document.querySelector('.view-student .student-info-container #m-name').textContent = students[index][5]
        document.querySelector('.view-student .student-info-container #date-of-birth').textContent = students[index][6]
        document.querySelector('.view-student .student-info-container #place-of-birth').textContent = students[index][7]
        document.querySelector('.view-student .student-info-container #age').textContent = students[index][8]
        document.querySelector('.view-student .student-info-container #sex').textContent = students[index][9]
        document.querySelector('.view-student .student-info-container #home-address').textContent = students[index][10]
        document.querySelector('.view-student .student-info-container #contact-no').textContent = students[index][11]
        document.querySelector('.view-student .student-info-container #religion').textContent = students[index][12]
        document.querySelector('.view-student .student-info-container #school-last-attended').textContent = students[index][13]
        document.querySelector('.view-student .student-info-container #address').textContent = students[index][14]
        document.querySelector('.view-student .student-info-container #name-of-father').textContent = students[index][17]
        document.querySelector('.view-student .student-info-container #father-occupation').textContent = students[index][18]
        document.querySelector('.view-student .student-info-container #father-contact-no').textContent = students[index][19]
        document.querySelector('.view-student .student-info-container #name-of-mother').textContent = students[index][20]
        document.querySelector('.view-student .student-info-container #mother-occupation').textContent = students[index][21]
        document.querySelector('.view-student .student-info-container #mother-contact-no').textContent = students[index][22]
        document.querySelector('.view-student .student-info-container #guardian-name').textContent = students[index][23]
        document.querySelector('.view-student .student-info-container #relationship').textContent = students[index][24]
        document.querySelector('.view-student .student-info-container #tel').textContent = students[index][25]
        document.querySelector('.view-student .student-info-container #cell-no').textContent = students[index][26]
        document.querySelector('.view-student .student-info-container #grade').textContent = students[index][27]
        document.querySelector('.view-student .student-info-container #status').textContent = students[index][28]


        displayParents(students[index][21])

    }

    document.getElementById('back-student-info').addEventListener('click', (e) => {
        document.querySelector('.view-student-container').style.display = 'block'
        document.querySelector('.student-info-container').style.display = 'none'
    })
})