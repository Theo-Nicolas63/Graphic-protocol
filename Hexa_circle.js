let text = document.getElementById("myText");
let btn = document.getElementById("myBtn");
let code = [];
let codeTab = [];
let data1 = [];
let mondataset = [];



function encoder() {
  code = [];
  codeTab = [];
  code = text.value.split("");
  code.forEach(e => {
    codeTab.push(AsciitoHexa(e));
  });
  console.log(codeTab);
  //data1 = dataBuilder(codeTab[0]);

  codeTab.forEach(e => {
    addDataset(dataBuilder(e));
  });
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

function addDataset(data1){

  const newDataset = {
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
        }
      }
    }
  });

}