import { 
  validateName, 
  validateInterestRate, 
  validateMaxTerm, 
  validateNormative 
} from './fieldValidations';

describe('fieldValidations', () => {
  describe('validateName', () => {
    it('should return error for empty name', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Nome do produto é obrigatório');
    });

    it('should return error for whitespace only', () => {
      const result = validateName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Nome do produto é obrigatório');
    });

    it('should return error for name too short', () => {
      const result = validateName('a');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Nome deve ter pelo menos 2 caracteres');
    });

    it('should return error for name too long', () => {
      const longName = 'a'.repeat(61);
      const result = validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Nome deve ter no máximo 60 caracteres');
    });

    it('should return valid for correct name', () => {
      const result = validateName('Produto Válido');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validateInterestRate', () => {
    it('should return error for empty rate', () => {
      const result = validateInterestRate('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Taxa de juros é obrigatória');
    });

    it('should return error for non-numeric value', () => {
      const result = validateInterestRate('abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Digite um número válido');
    });

    it('should return error for negative rate', () => {
      const result = validateInterestRate('-1');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Taxa deve estar entre 0 e 100');
    });

    it('should return error for rate over 100', () => {
      const result = validateInterestRate('101');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Taxa deve estar entre 0 e 100');
    });

    it('should return error for more than 2 decimal places', () => {
      const result = validateInterestRate('5.123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Máximo 2 casas decimais');
    });

    it('should accept comma as decimal separator', () => {
      const result = validateInterestRate('5,5');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for correct rate', () => {
      const result = validateInterestRate('5.5');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept rate with 2 decimal places', () => {
      const result = validateInterestRate('5.25');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateMaxTerm', () => {
    it('should return error for empty term', () => {
      const result = validateMaxTerm('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Prazo máximo é obrigatório');
    });

    it('should return error for non-integer value', () => {
      const result = validateMaxTerm('5.5');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Digite um número inteiro válido');
    });

    it('should return error for non-numeric value', () => {
      const result = validateMaxTerm('abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Digite um número inteiro válido');
    });

    it('should return error for term less than 1', () => {
      const result = validateMaxTerm('0');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Prazo deve ser maior ou igual a 1 mês');
    });

    it('should return error for term greater than 360', () => {
      const result = validateMaxTerm('361');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Prazo deve ser menor ou igual a 360 meses');
    });

    it('should return valid for correct term', () => {
      const result = validateMaxTerm('12');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validateNormative', () => {
    it('should return error for empty normative', () => {
      const result = validateNormative('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Normativo é obrigatório');
    });

    it('should return error for whitespace only', () => {
      const result = validateNormative('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Normativo é obrigatório');
    });

    it('should return error for normative too short', () => {
      const result = validateNormative('a');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Normativo deve ter pelo menos 2 caracteres');
    });

    it('should return error for normative too long', () => {
      const longNormative = 'a'.repeat(41);
      const result = validateNormative(longNormative);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Normativo deve ter no máximo 40 caracteres');
    });

    it('should return valid for correct normative', () => {
      const result = validateNormative('Normativo válido');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
