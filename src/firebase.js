import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAU3N9zyYwVxqpIrU9cChlWmHa-mExXqVQ",
  authDomain: "team6-development.firebaseapp.com",
  projectId: "team6-development",
  storageBucket: "team6-development.appspot.com",
  messagingSenderId: "197542973591",
  appId: "1:197542973591:web:c66d68bbebacdf852719d2",
  measurementId: "G-1E0Q58Y8VX",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
