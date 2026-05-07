import {
  formatCnpjMasked,
  isValidCnpjAlfanumerico,
  normalizeCnpjAlfanumerico
} from './cnpj-alfanumerico';

describe('cnpj-alfanumerico', () => {
  it('should normalize stripping punctuation and uppercasing letters', () => {
    expect(normalizeCnpjAlfanumerico(' 12.aBc-345/01de*35 ')).toBe('12ABC34501DE35');
  });

  it('should format masked string', () => {
    expect(formatCnpjMasked('12ABC34501DE35')).toBe('12.ABC.345/01DE-35');
  });

  it('should accept classic numeric CNPJ with valid DV', () => {
    expect(isValidCnpjAlfanumerico('11.222.333/0001-81')).toBe(true);
    expect(isValidCnpjAlfanumerico('00000000000191')).toBe(true);
  });

  it('should accept alphanumeric CNPJ with valid DV (norma Receita)', () => {
    expect(isValidCnpjAlfanumerico('12.ABC.345/01DE-35')).toBe(true);
  });

  it('should reject wrong length', () => {
    expect(isValidCnpjAlfanumerico('123456789012')).toBe(false);
  });

  it('should reject letter in DV positions', () => {
    expect(isValidCnpjAlfanumerico('12.ABC.345/01DE-3A')).toBe(false);
  });

  it('should reject wrong DV', () => {
    expect(isValidCnpjAlfanumerico('12.ABC.345/01DE-99')).toBe(false);
  });

  it('should reject special characters outside the mask', () => {
    // Antes: a normalização engolia o caractere e o CNPJ era aceito.
    // Agora: rejeita explicitamente — requisito EF/ET.
    expect(isValidCnpjAlfanumerico('12.AB*C.345/01DE-35')).toBe(false);
    expect(isValidCnpjAlfanumerico('12@ABC34501DE35')).toBe(false);
    expect(isValidCnpjAlfanumerico('12.ÁBC.345/01DE-35')).toBe(false);
    expect(isValidCnpjAlfanumerico('12_ABC_345_01DE_35')).toBe(false);
  });
});
