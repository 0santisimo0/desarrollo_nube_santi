import { useFirebaseUser } from "../hooks/useFirebaseUser";
import Menu from "../components/Menu";
import Button from "../components/Button";
import { Container } from "../components/Container";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";

interface ProfileData {
  fullname?: string;
  address?: string;
  birthdate?: string;
  age?: number;
}

export const ProfilePage = () => {
  const { user, logout, authChecked } = useFirebaseUser();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (authChecked && !user) {
      navigate("/login");
    } else if (user?.uid) {
      const fetchProfile = async () => {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfileData(snap.data() as ProfileData);
        }
      };
      fetchProfile();
    }
  }, [user, authChecked]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <>
      <Menu />
      <Container>
        <Card className="my-6" title="Perfil del Usuario">
          <div className="space-y-3">
            <p><strong>Nombre:</strong> {profileData?.fullname || user?.displayName || "No disponible"}</p>
            <p><strong>Correo:</strong> {user?.email}</p>
            <p><strong>Dirección:</strong> {profileData?.address || "No disponible"}</p>
            <p><strong>Fecha de nacimiento:</strong> {profileData?.birthdate || "No disponible"}</p>
            <p><strong>Edad:</strong> {profileData?.age ?? "No disponible"}</p>

            <Button variant="secondary" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};
