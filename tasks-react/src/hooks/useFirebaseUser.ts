import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  FacebookAuthProvider,
  GoogleAuthProvider,
  type User,
  signOut,
  linkWithCredential,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/FirebaseConfig";
import { useNavigate } from "react-router";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { getDoc } from "firebase/firestore";

export const useFirebaseUser = () => {
  const navigate = useNavigate();
    const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (loggedInUser) => {
      setUser(loggedInUser || null);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (user) {
      return;
    }
    onAuthStateChanged(firebaseAuth, (loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    });
  }, [user]);

  const loginWithFirebase = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      console.log("User signed in:", userCredential.user);
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };


  const registerWithFirebase = async (
    email: string,
    password: string,
    fullName: string,
    address: string,
    birthdate: string,
    age: number
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User signed in:", user);

      await updateProfile(user, {
        displayName: fullName,
      });

      console.log("Profile updated successfully");

      await setDoc(doc(db, "users", user.uid), {
        fullname: fullName,
        email: email,
        address: address,
        birthdate: birthdate,
        age: age,
        createdAt: new Date().toISOString(),
      });

      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("Este correo electrónico ya está en uso. Intenta con otro.");
      } else {
        console.error("Error during registration:", error);
      }
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      console.log("User signed in with Google:", user);

      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          fullname: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }

      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const logout = () => {
    signOut(firebaseAuth)
      .then(() => {
        console.log("User signed out successfully");
        setUser(null);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  const linkWithPassword = (email: string, password: string) => {
    if (!user) {
      return;
    }
    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(user, credential)
      .then((usercred) => {
        const user = usercred.user;
        console.log("Account linking success", user);
      })
      .catch((error) => {
        console.log("Account linking error", error);
      });
  };

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      console.log("User signed in with Facebook:", user);

      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          fullname: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }

      navigate("/");
    } catch (error) {
      console.error("Error logging in with Facebook:", error);
    }
  };

  return {
    user,
    authChecked,
    loginWithFirebase,
    registerWithFirebase,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    linkWithPassword,
  };
};
