import { validateForm } from './formValidation';

describe('formValidation', () => {
  describe('validateForm', () => {
    it('should return false for missing category', () => {
      const formData = { categoria: '' };
      expect(validateForm(formData as any)).toBe(false);
    });

    it('should validate HABITACAO category', () => {
      const formData = { categoria: 'HABITACAO' };
      expect(validateForm(formData as any)).toBe(true);
    });

    it('should validate CONSIGNADO category with subtipo', () => {
      const formData = { 
        categoria: 'CONSIGNADO', 
        subtipo: 'INSS' 
      };
      expect(validateForm(formData as any)).toBe(true);
    });

    it('should validate CONSIGNADO category with CONVENIO subtipo', () => {
      const validFormData = { 
        categoria: 'CONSIGNADO', 
        subtipo: 'CONVENIO',
        convenio_selected: 'some-convenio'
      };
      expect(validateForm(validFormData as any)).toBe(true);

      const invalidFormData = { 
        categoria: 'CONSIGNADO', 
        subtipo: 'CONVENIO',
        convenio_selected: ''
      };
      expect(validateForm(invalidFormData as any)).toBe(false);
    });

    it('should validate OUTRO category with valid data', () => {
      const validFormData = {
        categoria: 'OUTRO',
        name: 'Test Product',
        interestRate: '5.0',
        prazo_min_meses: 12,
        prazo_max_meses: 60
      };
      expect(validateForm(validFormData as any)).toBe(true);
    });

    it('should reject OUTRO category with invalid data', () => {
      const invalidFormData = {
        categoria: 'OUTRO',
        name: '',
        interestRate: '0',
        prazo_min_meses: 0,
        prazo_max_meses: 0
      };
      expect(validateForm(invalidFormData as any)).toBe(false);
    });

    it('should reject invalid prazo ranges', () => {
      const invalidRangeData = {
        categoria: 'OUTRO',
        name: 'Test',
        interestRate: '5.0',
        prazo_min_meses: 60,
        prazo_max_meses: 12 // max menor que min
      };
      expect(validateForm(invalidRangeData as any)).toBe(false);
    });
  });
});
