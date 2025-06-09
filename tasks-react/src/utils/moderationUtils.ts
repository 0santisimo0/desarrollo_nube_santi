export const forbiddenWords = ["mierda", "puta", "hijo de puta", "maldito", "desgraciado", "idiota", "imbécil", "estúpido", "tonto", "gilipollas", "cabrón", "coño", "pendejo", "pendeja", "puto", "puta madre", "chingar", "chingada", "verga", "caca"];

export function moderateText(content: string): string {
  return forbiddenWords.reduce((acc, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return acc.replace(regex, '[redacted]');
  }, content);
}
