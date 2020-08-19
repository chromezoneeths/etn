var main = document.getElementById("main");
const u = main.getAttribute("u");

var xhttp;

function update(){
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/updatenotepad", true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    let contents = encodeURIComponent(main.innerText);
    let options = {
        u: u,
        contents: contents
    }
    xhttp.send(JSON.stringify(options));
    setTimeout(update, 6000);
}

setTimeout(update, 3000);