const {doc, getDoc, onSnapshot, setDoc} = require('firebase/firestore');
//import { firestore } from './config.js'
const { firestore } = require('./config.js');

function makeAdder(a){
    return function(b){
        return a+b;
    };
}
// var add5 = makeAdder(5);
// var add20 = makeAdder(20);
// console.log(add5(6));
// console.log(add5(7));   

let obj = {
    rank: 1,
    name: "Jeremy",
    series: "Real life",
    kakera: 1000
}

const characterPath = doc(firestore, 'topk/2022-08-20');

const writeCharacter = () => {
    setDoc(characterPath, obj);
}

const readCharacter = async () => {
    const mySnapshot = await getDoc(characterPath);
    if (mySnapshot.exists()){
        console.log("Found snapshot.");
        const docData = mySnapshot.data();
        console.log(`My data is ${JSON.stringify(docData)}`);
    }
}

const listenToCharacters = () => {
    onSnapshot(characterPath, docSnapshot => {
        if (docSnapshot.exists()){
            const docData = mySnapshot.data();
            console.log(`In realtime, data is ${JSON.stringify(docData)}`);
        }
    })
}

//writeCharacter();
readCharacter();
