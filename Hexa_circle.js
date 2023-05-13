let text = document.getElementById("myText");
let btn = document.getElementById("myBtn");
let mySpan = document.getElementById("mySpan");

//INDEX de positionnement des caractères dans le QR code
let index = [1, 14, 2, 15, 3, 16, 4, 17, 5, 18, 6, 19, 7, 20, 8, 21, 9, 22, 10, 23, 11, 24, 12, 25, 13, 26, 27, 28, 29, 30];

//string hexa du message
let messageHex = "";

//tableau de caractère hexa
let code = [];

//Tableau de code hexa de tous les caractères du message
let codeTab = [];

//DATASET qui contient les données pour le graphique
let mondataset = [];

//DATASET des Donneés pour rendondance 
let dataSetRedondance = [];

//FONCTION PRINCIPALE
// isSimple = 0 si encodage complet et = 1 si encodage sans redondance ni detection d'erreur
// Pour comprendre vous pouvez lancer avec le bouton "Encodage simple" avec un message d'un lettre pour afficher le coage d'uniquement cette lettre
function encoder(isSimple) {
  let x;
  let lenMessage;
  let i = 0;
  code = [];
  codeTab = [];
  mondataset = [];
  message = text.value;
  lenMessage = lengthMessage(message);

  //LIMITE DE LONGUEUR DE MESSAGE
  if(lenMessage > 26 || lenMessage == 0){
    mySpan.innerHTML = "Votre message n'est pas valide";
    return;
  }
  else{
    mySpan.innerHTML = "";
  }

  //SI CODAGE AVEC DETECTION ERREUR
  if(isSimple == 0){
    messageHex = stringToHex(message);
    messageHex = addCRC(messageHex);
    codeTab = messageHex.split("");
  }
  //SI CODAGE SANS DETECTION ERREUR
  else {
    code = message.split(""); // Separation de tous les caractères du message dans un tableau
    code.forEach(e => {
      codeTab.push(AsciitoHexa(e));
    });
  }

  codeTab = indexage(codeTab, isSimple); // appel de la fonction indexage qui mixe l'odre d'apparition
  codeTab.forEach(e => { // Pour chaque caractère ASCII présent dans codeTab
    x = e.split("");
    x.forEach(y => {


        addDataset(dataBuilder(y, 0), 1); // Construction du dataset et ajout à la liste des dataset
        if(isSimple == 0) // Si codage avec redondance et pas sur les 4 derniers car pas de redondance sur le CRC
          addDataset(dataBuilder(y, 1), 2); // Construction du dataset pour la redondance

      i++;
    });
  });

  afficher(); // APPEL DE LA FONCTION AFFICHER
}

// CONVERSION D'UN CARACTERE EN HEXA
function AsciitoHexa(c) {
  return c.charCodeAt(0).toString(16).toUpperCase();
}

//Fonction qui converti un string en sa représentation hexadecimal
function stringToHex(str) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex.toUpperCase();
}

//FONCTION qui construit un tableau de taille 2 tel que :
// [x, y] x et y étant les pourcentages soit x = 100 et y = 0 pour un cercle qui fera le tour complet
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

//FONCTION qui construit un dataset. Le dataset est le format a créé pour pouvoir afficher correctement
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
    newDataset.borderColor[1] = 'rgba(255, 255, 255)';
    dataSetRedondance.push(newDataset);
  }
  else {
    mondataset.push(newDataset);
  }
}

//Fonction qui teste  si c est une lettre ou non 
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

//Fonction qui traduit les lettres hexadecimal en leurs pourcentage de tour de cercle correspondant
function toNumber(c){
  let y = 100/17; // 17 car 17 zones égale dans le cercle
  let x = 50 + y; // Valeur de la zone de 9 dans le cercle soit 50% puis pour chaque lettre on ajoutera y qui est la taille de chaque partie
                  // A étant la première zone apres 9 etc  
  switch(c){
    case 'A':
      return x + y;
    case 'B':
      return x + 2*y;
    case 'C':
      return x + 3*y;
    case 'D':
      return x + 4*y;
    case 'E':
      return x + 5*y;
    case 'F':
      return x + 6*y;  
  }

  console.log("Erreur : c n'est pas une lettre valide"); // Affiche un message d'erreur dans la console du navigateur
}

//Fonction qui affiche
function afficher(){

  dataSetRedondance.reverse();
  dataSetRedondance.forEach(e => {
    mondataset.unshift(e);
  });

  //Affichage du graphique

  const ctx = document.getElementById('myChart');

  new Chart(ctx, { //Création du graphique
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

//fonction qui retourne la longueur du string passé en paramètre
function lengthMessage(message){
  message = message.split("");
  return message.length;
}

//Fonction qui mix l'odre d'apparition des caractères dans le tableau
function indexage(code, isSimple) {
  let codeRedondance = [];
  if(isSimple == 0){
    codeRedondance = [30]; // Tableau de 30 cases
    
    for(let i = 0; i < 30; i++){ // Initialisation du tableau
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

//Fonction qui calcul et ajoute à un message hexadécimal son CRC correspondant
function addCRC(hexMessage) {
  // Convertir le message hexadécimal en binaire
  let binaryMessage = "";
  for (let i = 0; i < hexMessage.length; i++) {
    binaryMessage += parseInt(hexMessage[i], 16).toString(2).padStart(4, "0");
  }

  // Polynôme générateur utilisé pour le calcul du CRC (CRC-16-CCITT)
  const polynomial = "11000000000000101";

  // Initialisation du registre CRC à 0xFFFF
  let crcRegister = parseInt("FFFF", 16);

  // Calcul du CRC
  for (let i = 0; i < binaryMessage.length; i++) {
    const xorBit = (crcRegister & parseInt("8000", 16)) !== 0;
    crcRegister <<= 1;
    if (binaryMessage[i] === "1") {
      crcRegister |= 1;
    }
    if (xorBit) {
      crcRegister ^= parseInt(polynomial, 2);
    }
  }

  // Ajout du CRC calculé à la fin du message binaire
  const crc = crcRegister.toString(2).padStart(16, "0");
  binaryMessage += crc;

  // Conversion du message binaire en hexadécimal
  let hexCRCMessage = "";
  for (let i = 0; i < binaryMessage.length; i += 4) {
    hexCRCMessage += parseInt(binaryMessage.substr(i, 4), 2).toString(16).toUpperCase();
  }

  return hexCRCMessage;
}



// Fonction qui vérifie que le CRC du message est valide et donc qu'il n'y pas d'erreur
// Fonction non utilisé car décodage non demandé

function checkCRC(hexCRCMessage) {
  // Convertir le message hexadécimal en binaire
  let binaryMessage = "";
  for (let i = 0; i < hexCRCMessage.length; i++) {
    binaryMessage += parseInt(hexCRCMessage[i], 16).toString(2).padStart(4, "0");
  }

  // Polynôme générateur utilisé pour le calcul du CRC (CRC-16-CCITT)
  const polynomial = "11000000000000101";

  // Initialisation du registre CRC à 0xFFFF
  let crcRegister = parseInt("FFFF", 16);

  // Calcul du CRC
  for (let i = 0; i < binaryMessage.length - 16; i++) {
    const xorBit = (crcRegister & parseInt("8000", 16)) !== 0;
    crcRegister <<= 1;
    if (binaryMessage[i] === "1") {
      crcRegister |= 1;
    }
    if (xorBit) {
      crcRegister ^= parseInt(polynomial, 2);
    }
  }

  // Vérification du CRC
  const receivedCRC = binaryMessage.substr(binaryMessage.length - 16);
  return crcRegister.toString(2).padStart(16, "0") === receivedCRC;
}







