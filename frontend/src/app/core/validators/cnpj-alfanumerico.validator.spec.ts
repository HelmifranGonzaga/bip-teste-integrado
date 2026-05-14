import { FormControl } from '@angular/forms';
import { cnpjAlfanumericoOpcionalValidator } from './cnpj-alfanumerico.validator';

describe('cnpjAlfanumericoOpcionalValidator', () => {
  const validator = cnpjAlfanumericoOpcionalValidator();

  it('should pass on null', () => {
    expect(validator(new FormControl(null))).toBeNull();
  });

  it('should pass on empty / blank', () => {
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl('   '))).toBeNull();
  });

  it('should pass on a valid masked alphanumeric CNPJ', () => {
    expect(validator(new FormControl('12.ABC.345/01DE-45'))).toBeNull();
  });

  it('should pass on a valid classic numeric CNPJ', () => {
    expect(validator(new FormControl('11.222.333/0001-81'))).toBeNull();
  });

  it('should flag cnpjCaracteresInvalidos when input contains chars outside mask', () => {
    expect(validator(new FormControl('12.AB*C.345/01DE-35'))).toEqual({
      cnpjCaracteresInvalidos: true
    });
    expect(validator(new FormControl('12@ABC34501DE35'))).toEqual({
      cnpjCaracteresInvalidos: true
    });
    expect(validator(new FormControl('12.ÁBC.345/01DE-35'))).toEqual({
      cnpjCaracteresInvalidos: true
    });
  });

  it('should flag cnpjTamanho when length after normalization is not 14', () => {
    expect(validator(new FormControl('12.ABC.345'))).toEqual({ cnpjTamanho: true });
  });

  it('should flag cnpjFormato when DV positions have letters', () => {
    expect(validator(new FormControl('12.ABC.345/01DE-3A'))).toEqual({
      cnpjFormato: true
    });
  });

  it('should accept CNPJ with valid format even if DV is wrong (DV validation removed)', () => {
    expect(validator(new FormControl('12.ABC.345/01DE-99'))).toBeNull();
  });
});
