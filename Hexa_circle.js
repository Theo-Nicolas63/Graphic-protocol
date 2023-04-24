let text = document.getElementById("myText");
let btn = document.getElementById("myBtn");
let code = [];
let codeTab = [];

function encoder() {
  code = text.value.split("");
  console.log(code);
}