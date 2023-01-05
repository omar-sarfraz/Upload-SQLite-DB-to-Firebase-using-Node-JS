import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD3wglBzTq8QKgvL9QUs2swnmYycglga00",
  authDomain: "test-61e7b.firebaseapp.com",
  databaseURL:
    "https://test-61e7b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-61e7b",
  storageBucket: "test-61e7b.appspot.com",
  messagingSenderId: "372653385617",
  appId: "1:372653385617:web:05a48e3665d7b3335edc30",
};

const app = initializeApp(firebaseConfig);
export default app;
