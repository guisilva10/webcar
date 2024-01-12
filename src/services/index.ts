
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAv6v36VzkId09GXaTyNk6NLAsHSWj-RtQ",
  authDomain: "webcar-fbffa.firebaseapp.com",
  projectId: "webcar-fbffa",
  storageBucket: "webcar-fbffa.appspot.com",
  messagingSenderId: "851839581423",
  appId: "1:851839581423:web:069b6b34160e26cc9c6f1a"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage}