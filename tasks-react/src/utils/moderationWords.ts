export const forbiddenWords = [
  "mierda", "puta", "hijo de puta", "maldito", "desgraciado", "idiota",
  "imbécil", "estúpido", "tonto", "gilipollas", "cabrón", "coño",
  "pendejo", "pendeja", "puto", "puta madre", "chingar", "chingada",
  "verga", "caca", "bastardo", "zorra", "culero", "maricón", "marica",
  "baboso", "anormal", "retardado", "pelotudo", "forro", "boludo", "estúpida",
  
  "me cago", "vete a la mierda", "que te jodan", "jódete", "malparido",
  "malnacido", "carajo", "cojudo", "huevón", "huevona", "jodido", "jodida",
  "chingón", "chingona", "culiado", "culiada", "estúpida", "imbéciles",
  "mamahuevo", "mamaguevo", "sapo", "careverga", "careculo", "perra",
  "perro", "come mierda", "come moco", "asqueroso", "asquerosa", "nojoda",
  
  "h i j o d e p u t a", "m i e r d a", "p u t a", "c a b r ó n", "c o ñ o"
];

export function moderateText(content: string): string {
  return forbiddenWords.reduce((acc, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return acc.replace(regex, '[redacted]');
  }, content);
}
