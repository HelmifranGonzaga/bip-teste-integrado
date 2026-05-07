import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  CNPJ_ALLOWED_INPUT_PATTERN,
  CNPJ_NORMALIZED_PATTERN,
  isValidCnpjAlfanumericoDv,
  normalizeCnpjAlfanumerico
} from '../utils/cnpj-alfanumerico';

/**
 * CNPJ opcional: vazio/null é válido; caso contrário exige formato + DV alfanumérico.
 */
export function cnpjAlfanumericoOpcionalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;
    if (raw == null || String(raw).trim() === '') {
      return null;
    }
    const value = String(raw);
    if (!CNPJ_ALLOWED_INPUT_PATTERN.test(value)) {
      return { cnpjCaracteresInvalidos: true };
    }
    const n = normalizeCnpjAlfanumerico(value);
    if (n.length !== 14) {
      return { cnpjTamanho: true };
    }
    if (!CNPJ_NORMALIZED_PATTERN.test(n)) {
      return { cnpjFormato: true };
    }
    if (!isValidCnpjAlfanumericoDv(n)) {
      return { cnpjDv: true };
    }
    return null;
  };
}
