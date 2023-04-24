let text = document.getElementById("myText");
let btn = document.getElementById("myBtn");
let code = [];
let codeTab = [];
let data1 = [];

function encoder() {
  code = [];
  codeTab = [];
  code = text.value.split("");
  code.forEach(e => {
    codeTab.push(AsciitoHexa(e));
  })
  console.log(codeTab);
  data1 = dataBuilder(codeTab[0]);
  console.log(data1);
  afficher();
}

function AsciitoHexa(c) {
  return c.charCodeAt(0).toString(16);
}

function dataBuilder(hexa){
  let h = hexa.split("");
  let h1 = h[0]/17 * 100;
  let h2 = 100 - h1;
  return [h1, h2];
}