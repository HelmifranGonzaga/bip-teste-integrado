import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  CNPJ_ALLOWED_INPUT_PATTERN,
  CNPJ_NORMALIZED_PATTERN,
  normalizeCnpjAlfanumerico
} from '../utils/cnpj-alfanumerico';

/**
 * CNPJ opcional: vazio/null é válido; caso contrário exige formato + DV alfanumérico.
 * NOTA: A validação de Dígitos Verificadores (DV) foi removida porque o backend
 * corrigiu o algoritmo de cálculo, invalidando DVs salvos anteriormente.
 * O formato de 14 caracteres alfanuméricos já garante integridade básica.
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
    return null;
  };
}
