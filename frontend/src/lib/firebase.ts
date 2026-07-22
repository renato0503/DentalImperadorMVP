import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCw7NIUw8WiqF1HE1aTk4Ru_CLUOloK0cU",
  authDomain: "dentalimperador-d2529.firebaseapp.com",
  projectId: "dentalimperador-d2529",
  storageBucket: "dentalimperador-d2529.firebasestorage.app",
  messagingSenderId: "330816807481",
  appId: "1:330816807481:web:f3b98cbe9a24aaac9763e8",
  measurementId: "G-H2DDLM3SKN",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
