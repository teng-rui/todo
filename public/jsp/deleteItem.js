
let deleteCheckbox = document.getElementsByClassName('delete');
for (let item of deleteCheckbox) {
    if (item.value != 0) {
        item.addEventListener("click", function () { deleteItem(this) });
    }
}

function deleteItem(el) {
    // let buttonDate=document.getElementById('button_date').value;
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/delete");
    xhttp.onload = function () {
        console.log(this.response);
        location.reload('/plan');
    
    }
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + el.value);
}