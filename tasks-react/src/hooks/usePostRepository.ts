import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useFirebaseUser } from "./useFirebaseUser";

interface Post {
  id: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  content: string;
  imageUrl?: string;
  createdAt?: any;
}

export const usePostRepository = () => {
  const { user } = useFirebaseUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const usersCollection = collection(db, "users");
  const notificationsCollection = collection(db, "notifications");

  const postsCollection = collection(db, "posts");

  const loadPosts = async () => {
    setLoading(true);
    const q = query(postsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const fetchedPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
    setPosts(fetchedPosts);
    setLoading(false);
  };

  const createPost = async (
    content: string,
    imageUrl: string | null = null
  ) => {
    if (!user) {
      console.warn("No hay usuario autenticado.");
      return;
    }

    try {
      const postRef = await addDoc(postsCollection, {
        uid: user.uid,
        displayName: user.displayName || "Usuario sin nombre",
        photoURL: user.photoURL || null,
        content,
        imageUrl,
        createdAt: serverTimestamp(),
      });
      console.log("Documento agregado a Firestore.");
      const allUsers = await getDocs(usersCollection);
      const otherUsers = allUsers.docs.filter((u) => u.id !== user.uid);
      const postId = postRef.id;

      // 3. Crear notificaciones para cada uno
      for (const u of otherUsers) {
        await addDoc(notificationsCollection, {
          recipientUid: u.id,
          senderDisplayName: user.displayName,
          senderPhotoURL: user.photoURL || null,
          type: "new_post",
          postId,
          seen: false,
          createdAt: serverTimestamp(),
        });
      }

      console.log("Notificaciones generadas.");

      await loadPosts();
    } catch (error) {
      console.error("Error al agregar documento a Firestore:", error);
    }
  };

  const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, "posts", postId));
    await loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    deletePost,
    reloadPosts: loadPosts,
  };
};
