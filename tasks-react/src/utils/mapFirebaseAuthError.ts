export function mapFirebaseAuthError(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado. Intenta iniciar sesión.';
    case 'auth/invalid-credential':
      return 'Correo o contraseña inválidos. Verifica tus datos.';
    case 'auth/invalid-email':
      return 'El correo electrónico no es válido.';
    case 'auth/weak-password':
      return 'La contraseña es muy débil. Usa al menos 6 caracteres.';
    case 'auth/missing-password':
      return 'Por favor, ingresa una contraseña.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Contraseña incorrecta. Intenta de nuevo';
    case 'auth/too-many-requests':
      return 'Has intentado demasiadas veces. Espera unos minutos antes de volver a intentarlo.';
    default:
      return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
}
