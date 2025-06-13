import { useForm, type SubmitHandler } from "react-hook-form";
import { Input } from "../components/Input";
import Card from "../components/Card";
import { Container } from "../components/Container";
import Button from "../components/Button";
import { useFirebaseUser } from "../hooks/useFirebaseUser";
import Menu from "../components/Menu";
import { useState } from "react";

type Inputs = {
  fullname: string;
  email: string;
  password: string;
  address: string;
  birthdate: string;
  age: number;
};

export const RegisterPage = () => {
  const { registerWithFirebase } = useFirebaseUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setFirebaseError(null);
    setLoading(true);
    try {
      await registerWithFirebase(
        data.email,
        data.password,
        data.fullname,
        data.birthdate,
        data.age,
        data.address,
      );
    } catch (error: any) {
      console.error("Error al registrar:", error);
      if (error.code === "auth/email-already-in-use") {
        setFirebaseError("Este correo ya está registrado.");
      } else {
        setFirebaseError("Error desconocido al registrarse. Intenta más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <Card className="my-3" title="Registro">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              {...register("fullname", { required: "El nombre es obligatorio" })}
            />
            {errors.fullname && <span className="text-red-500 text-sm">{errors.fullname.message}</span>}

            <Input
              label="Correo electrónico"
              type="email"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
              })}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

            <Input
              label="Contraseña"
              type="password"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

            <Input
              label="Dirección"
              type="text"
              {...register("address", { required: "La dirección es obligatoria" })}
            />
            {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}

            <Input
              label="Fecha de nacimiento"
              type="date"
              {...register("birthdate", { required: "La fecha de nacimiento es obligatoria" })}
            />
            {errors.birthdate && <span className="text-red-500 text-sm">{errors.birthdate.message}</span>}

            <Input
              label="Edad"
              type="number"
              {...register("age", {
                required: "La edad es obligatoria",
                min: { value: 1, message: "Debe ser mayor a 0" },
              })}
            />
            {errors.age && <span className="text-red-500 text-sm">{errors.age.message}</span>}

            {firebaseError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
                {firebaseError}
              </div>
            )}

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </Card>
      </Container>
    </>
  );
};
