import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    setDoc,
    doc,
    serverTimestamp,
    Timestamp,
    getDoc
} from "firebase/firestore";
import {db} from "./init";
import {randomElement} from "./util";

export {writeId, writeData, readHighscore, writeHighscore}

const writeId = async function (id) {
    const idRef = doc(db, 'ids', id);
    await setDoc(idRef, {timestamp: serverTimestamp()});
}

const writeData = async function (id, data) {
    const dataRef = doc(db, 'trialData', id)
    await setDoc(dataRef, {id: id, data: data})
    /*const idRef = doc(db, 'ids', id);
    await updateDoc(idRef, {timestamp: serverTimestamp()});*/
}

const readHighscore = async function (scoreId) {
    const docRef = doc(db, 'highscores', scoreId);
    const docSnap = await getDoc(docRef)
    return docSnap.data().highscore
}

const writeHighscore = async function (scoreId, highscore, id) {
    const docRef = doc(db, 'highscores', scoreId)
    await updateDoc(docRef, {highscore: highscore, id: id})
}
