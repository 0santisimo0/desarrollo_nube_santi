import { useForm, type SubmitHandler } from "react-hook-form";
import { useFirebaseUser } from "../hooks/useFirebaseUser";
import { useState } from "react";
import Menu from "../components/Menu";
import { mapFirebaseAuthError } from "../utils/mapFirebaseAuthError";

type Inputs = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const { loginWithFirebase, loginWithGoogle, loginWithFacebook } = useFirebaseUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    setFirebaseError(null);
    setLoading(true);
    try {
      await loginWithFirebase(email, password);
    } catch (err: any) {
      console.error("Login error:", err);

      const errorCode =
        err?.code || 
        err?.error?.code ||
        err?.message ||
        null;

      if (errorCode) {
        setFirebaseError(mapFirebaseAuthError(errorCode));
      } else {
        setFirebaseError("Error desconocido al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Menu />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo inválido",
                  },
                })}
                className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                  errors.email ? "border-red-400 ring-red-400" : "focus:ring-black"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                {...register("password", { required: "La contraseña es obligatoria" })}
                className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${
                  errors.password ? "border-red-400 ring-red-400" : "focus:ring-black"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {firebaseError && (
              <div className="flex items-start text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
                <svg
                  className="h-5 w-5 mr-2 mt-0.5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01M12 5a7 7 0 110 14 7 7 0 010-14z"
                  />
                </svg>
                <span>{firebaseError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Iniciar sesión con Google
            </button>

            <button
              type="button"
              onClick={loginWithFacebook}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Iniciar sesión con Facebook
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            ¿No tienes cuenta?{" "}
            <a href="/sign-in" className="text-black font-semibold hover:underline">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
