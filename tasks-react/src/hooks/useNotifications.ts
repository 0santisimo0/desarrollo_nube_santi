import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useFirebaseUser } from "./useFirebaseUser";

interface Notification {
  id: string;
  recipientUid: string;
  senderDisplayName: string;
  senderPhotoURL?: string | null;
  postId: string;
  type: string;
  seen: boolean;
  createdAt: any;
}

export const useNotifications = () => {
  const { user } = useFirebaseUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("recipientUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifications(fetched);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsSeen = async (id: string) => {
    await updateDoc(doc(db, "notifications", id), { seen: true });
  };

  return { notifications, markAsSeen };
};

export const sendNotification = async (owner: string, action: string, postId: string, user: any) => {
  try {
    // Agregar la notificación en Firestore
    await addDoc(collection(db, "notifications"), {
      recipientUid: owner,  // UID del propietario del post
      senderDisplayName: user?.displayName,  // Nombre del usuario que dio like/dislike
      senderPhotoURL: user?.photoURL,  // Foto de perfil del usuario
      postId: postId,  // ID del post
      type: action,  // Tipo de acción: "liked" o "disliked"
      seen: false,  // Estado de la notificación (aún no vista)
      createdAt: serverTimestamp(),  // Fecha de creación
    });
    console.log(`Notificación enviada a ${owner}: Su post fue ${action}`);
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
  }
};