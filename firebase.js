import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.ST_BUCKET,
  messagingSenderId: process.env.MSG_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.M_ID,
};

const app = initializeApp(firebaseConfig);
export default app;
