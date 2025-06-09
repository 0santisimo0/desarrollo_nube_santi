import { useFirebaseUser } from "../hooks/useFirebaseUser";
import Menu from "../components/Menu";
import Button from "../components/Button";
import { Container } from "../components/Container";
import Card from "../components/Card";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const ProfilePage = () => {
  const { user, logout, authChecked } = useFirebaseUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && !user) {
      navigate("/login");
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
      {/* <Menu /> */}
      <Container>
        <Card className="my-6" title="Perfil del Usuario">
          <div className="space-y-4">
            <p><strong>Nombre:</strong> {user?.displayName || "No disponible"}</p>
            <p><strong>Correo:</strong> {user?.email}</p>

            <Button variant="secondary" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};
