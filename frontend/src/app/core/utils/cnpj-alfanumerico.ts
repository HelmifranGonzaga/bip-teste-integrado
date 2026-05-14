/**
 * CNPJ alfanumérico (Receita Federal): normalização, máscara e DV (módulo 11,
 * valores = código ASCII − 48; pesos iguais ao CNPJ numérico clássico).
 */

export const CNPJ_NORMALIZED_PATTERN = /^[A-Z0-9]{12}[0-9]{2}$/;

/**
 * Caracteres aceitos na entrada bruta: alfanuméricos + caracteres da máscara
 * (`.`, `/`, `-`) + espaços. Qualquer outro símbolo (`*`, `@`, acentos, etc.) é
 * tratado como inválido — atende ao requisito EF/ET "Não permitir caracteres
 * especiais (exceto máscara)".
 */
export const CNPJ_ALLOWED_INPUT_PATTERN = /^[0-9A-Za-z./\-\s]*$/;

const WEIGHTS_DV1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const;
const WEIGHTS_DV2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const;

/** Mantém apenas letras e dígitos e converte letras para maiúsculas. */
export function normalizeCnpjAlfanumerico(value: string): string {
  return value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
}

/** Aplica máscara XX.XXX.XXX/XXXX-XX sobre string já normalizada (até 14 caracteres). */
export function formatCnpjMasked(normalized: string): string {
  const n = normalizeCnpjAlfanumerico(normalized).slice(0, 14);
  if (n.length <= 2) {
    return n;
  }
  if (n.length <= 5) {
    return `${n.slice(0, 2)}.${n.slice(2)}`;
  }
  if (n.length <= 8) {
    return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5)}`;
  }
  if (n.length <= 12) {
    return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8)}`;
  }
  return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12, 14)}`;
}

export function cnpjCharValue(char: string): number {
  const code = char.toUpperCase().charCodeAt(0);
  if (code >= 48 && code <= 57) {
    return code - 48;
  }
  if (code >= 65 && code <= 90) {
    return code - 55;
  }
  return -1;
}

export function isValidCnpjAlfanumericoDv(normalized14: string): boolean {
  if (!CNPJ_NORMALIZED_PATTERN.test(normalized14)) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const v = cnpjCharValue(normalized14[i]!);
    if (v < 0) {
      return false;
    }
    sum += v * WEIGHTS_DV1[i]!;
  }
  let rest = sum % 11;
  const dv1 = rest < 2 ? 0 : 11 - rest;
  if (dv1 !== Number(normalized14[12])) {
    return false;
  }
  sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += cnpjCharValue(normalized14[i]!) * WEIGHTS_DV2[i]!;
  }
  sum += dv1 * WEIGHTS_DV2[12]!;
  rest = sum % 11;
  const dv2 = rest < 2 ? 0 : 11 - rest;
  return dv2 === Number(normalized14[13]);
}

/** Espelha o backend: rejeita caracteres especiais fora da máscara, depois 14 caracteres + regex + DV. */
export function isValidCnpjAlfanumerico(value: string): boolean {
  if (!CNPJ_ALLOWED_INPUT_PATTERN.test(value)) {
    return false;
  }
  const n = normalizeCnpjAlfanumerico(value);
  if (n.length !== 14) {
    return false;
  }
  if (!CNPJ_NORMALIZED_PATTERN.test(n)) {
    return false;
  }
  return isValidCnpjAlfanumericoDv(n);
}
