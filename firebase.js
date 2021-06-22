import firebase from "firebase";

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyCLMiNpUBTzhKPxBU_CZQveVqT7HEDHG08",
    authDomain: "instagram-clone-nipson.firebaseapp.com",
    databaseURL: "https://instagram-clone-nipson-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-nipson",
    storageBucket: "instagram-clone-nipson.appspot.com",
    messagingSenderId: "323442817158",
    appId: "1:323442817158:web:9ef490bec58226a2693907",
    measurementId: "G-6EKL82ZBTR"
  }); 

  const db =firebase.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export {db,auth,storage};