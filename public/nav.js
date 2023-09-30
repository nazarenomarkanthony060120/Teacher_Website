var li_elements = document.querySelectorAll(".navbar-containers ul li")
var item_elements = document.querySelectorAll(".item");

for (var i = 0; i < li_elements.length; i++){
    li_elements[i].addEventListener('click', function(){
        li_elements.forEach(function(li){
            li.classList.remove("active");
        })
        this.classList.add("active");
        var li_value = this.getAttribute ("data-li");
        item_elements.forEach(function(item){
            item.style.display = "none";
        })
        if (li_value == 'home') {
            document.querySelector("." + li_value).style.display = 'block'
            document.querySelector('.title-section span').textContent = 'Home'
            document.querySelector('.title-section #student-list-update-title').textContent = ''

        } else if (li_value == 'grade') {
            document.querySelector("." + li_value).style.display = 'block'
            document.querySelector('.title-section span').textContent = 'Grade'
            document.querySelector('.title-section #student-list-update-title').textContent = ' > Pupils List'

        } else if (li_value == 'view-student') {
            document.querySelector("." + li_value).style.display = 'block'
            document.querySelector('.title-section span').textContent = 'View Pupils'
            document.querySelector('.title-section #student-list-update-title').textContent = ''

        } else if (li_value == 'attendance') {
            document.querySelector("." + li_value).style.display = 'block'
            document.querySelector('.title-section span').textContent = 'Attendance'
            document.querySelector('.title-section #student-list-update-title').textContent = ''
        }
    })
}







