let text = document.getElementById("myText");
let btn = document.getElementById("myBtn");
let code = [];
let codeTab = [];
let data1 = [];
let mondataset = [];

console.log(toNumber('a'));

function encoder() {
  let x;
  code = [];
  codeTab = [];
  code = text.value.split("");
  code.forEach(e => {
    codeTab.push(AsciitoHexa(e));
  });
  console.log(codeTab);

  codeTab.forEach(e => {
    x = e.split("");
    x.forEach(y => {
      addDataset(dataBuilder(y));
    });
  });
  console.log(mondataset);
  afficher();
}

function AsciitoHexa(c) {
  return c.charCodeAt(0).toString(16);
}

function dataBuilder(hexa){
  if(isLetter(hexa)){
    console.log("C'est une lettre");
    console.log(hexa);
    hexa = toNumber(hexa);
    return [hexa, 100 - hexa]
  }
  let h1 = hexa/17 * 100;
  let h2 = 100 - h1;
  return [h1, h2];
}

function addDataset(data1){
  let newDataset = {
    label: "Test",
    data: data1,
    backgroundColor: [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
    ],
    borderWidth: 1
  }
  mondataset.push(newDataset);
}

function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

function toNumber(c){
  let y = 100/17;
  let x = 50 + y; // Valeur de 9  
  switch(c){
    case 'a':
      return x + y;
    case 'b':
      return x + 2*y;
    case 'c':
      return x + 3*y;
    case 'd':
      return x + 4*y;
    case 'e':
      return x + 5*y;
    case 'f':
      return x + 6*y;  
  }

  console.log("Erreur : c n'est pas une lettre valide");
}

function afficher(){
  console.log(mondataset);

  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: mondataset

    },ctx,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Multi-Series Pie Chart'
        },
        legend: {
          position: 'bottom'
        },
      }
    }
  });

}


