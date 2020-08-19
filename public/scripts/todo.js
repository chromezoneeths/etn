var side = document.getElementById("side");

var xhttp;

function update2(){
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/updatetodo", true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    let list = document.getElementById("list").children;
    var contents = []
    for(var i = 0; i<list.length; i++){
        contents.push(list[i].innerText)
    }
    let options = {
        u: u,
        t: contents
    }
    xhttp.send(JSON.stringify(options));
    setTimeout(update2, 3000);
}

function emptycheck(e){
    if(e.innerText==""){
        e.remove();
    }
}

function newitem(){
    var ul = document.getElementById("list");
    var newitem = `<li onkeyup="emptycheck(this)">
                        <span contenteditable="true">New item</span>
                   </li>`;
    ul.innerHTML+=newitem;
}

setTimeout(update2, 3000);