let text = document.getElementById("myText");
let btn = document.getElementById("myBtn");
let mySpan = document.getElementById("mySpan");

//INDEX de positionnement des caractères dans le QR code
let index = [1, 14, 2, 15, 3, 16, 4, 17, 5, 18, 6, 19, 7, 20, 8, 21, 9, 22, 10, 23, 11, 24, 12, 25, 13, 26];

//Tableau de caractères du message
let code = [];

//Tableau de code hexa de tous les caractères du message
let codeTab = [];

//DATASET qui contient les données pour le graphique
let mondataset = [];

//Donneés pour rendondance 
let dataSetRedondance = [];

console.log(toNumber('a'));

function encoder(isSimple) {
  let x;
  let lenMessage;
  let parite = 0;
  let i = 0;
  code = [];
  codeTab = [];
  mondataset = [];
  message = text.value;
  lenMessage = lengthMessage(message);
  if(lenMessage > 26 || lenMessage == 0){
    mySpan.innerHTML = "Votre message n'est pas valide";
    return;
  }
  else{
    mySpan.innerHTML = "";
  }
  code = message.split(""); // Separation de tous les caractères du message dans un tableau
  code = indexage(code, isSimple);  
  code.forEach(e => {
    codeTab.push(AsciitoHexa(e));
  });
  console.log(codeTab);

  codeTab.forEach(e => {
    x = e.split("");
    x.forEach(y => {
      //if(pariteCondition(lenMessage, parite, x.length, i)){
        addDataset(dataBuilder(y, 0), 1); // Construction du dataset

        if(isSimple == 0)
          addDataset(dataBuilder(y, 1), 2); // Construction du dataset pour la redondance
        parite++;
     // }
      //else {
       // addDataset(dataBuilder(y), 0);
      //}
      i++;
    });
  });
  console.log(mondataset);
  afficher();
}

function AsciitoHexa(c) {
  return c.charCodeAt(0).toString(16);
}

function isPair(n){
  if(n%2 == 0){
    return true;
  }
  else{
    return false;
  }
}

function dataBuilder(hexa, x){
  if(isLetter(hexa)){ // Verification que l'hexa est une lettre, si oui alors conversion 
    console.log("C'est une lettre");
    console.log(hexa);
    hexa = toNumber(hexa);

    if(x == 0)
      return [hexa, 100 - hexa]; 
    return [100 - hexa, hexa]
  }
  let h1 = hexa/17 * 100; // Calcul : cercle divisé sur 17 parties à mettre en pourcentage
  let h2 = 100 - h1; // Calcul : reste du cercle

  if(x == 0)
    return [h1, h2]; // Retourne les pourcentages => h1 est les données et h2 est le reste du cercle

  return [h2, h1]; // Retourne l'inverse pour la redondance
}

function addDataset(data1, x){
  
  let newDataset = {
    label: "Test",
    data: data1,
    backgroundColor: [
      'rgba(112,128,144)',
      'rgba(255, 255, 255)',
    ],
    borderColor: [
      'rgba(0,0,0)',
      'rgba(0, 0, 0)',
    ],
    borderWidth: 1
  }

  if(x == 2){ // Si 2 alors redondance donc ajout au dataset de redondance
    newDataset.backgroundColor[0] = 'rgba(255, 255, 255)';
    newDataset.backgroundColor[1] = 'rgba(0, O, 0)';
    newDataset.borderColor[0] = 'rgba(0, 0, 0)';
    newDataset.borderColor[1] = 'rgba(0, 0, 0)';
    dataSetRedondance.push(newDataset);
  }
  else {
    mondataset.push(newDataset);
  }
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

  dataSetRedondance.reverse();
  dataSetRedondance.forEach(e => {
    mondataset.unshift(e);
  });

  console.log(mondataset);

  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Data', 'No Data'],
      datasets: mondataset

    },ctx,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Protocole graphique'
        },
        legend: {
          position: 'bottom'
        },
      }
    }
  });

}

function lengthMessage(message){
  message = message.split("");
  return message.length;
}

function indexage(code, x){
  let codeRedondance = [];
  if(x == 0){
    codeRedondance = [26]; // Tableau de 26 cases
    
    for(let i = 0; i < 26; i++){ // Initialisation du tableau
      codeRedondance[i] = " ";
    }

    let i = 1;
    
    code.forEach(c => { // Remplissage du tableau avec les caractères du message aux positions du qr code (voir rapport)
      codeRedondance[index.indexOf(i)] = c;
      i++;
    });

    return codeRedondance;
  }

  code.forEach(c => {
    codeRedondance.push(c);
  });

  return codeRedondance;
}

function pariteCondition(lenMessage, parite, x, i){
  /*if(isPair(lenMessage) && !isPair(parite) && x - i > 1)
    return true;

  if(!isPair(lenMessage) && isPair(parite) && x - i > 1)
    return true;
  */
  return false;  
}



