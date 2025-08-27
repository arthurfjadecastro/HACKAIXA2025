import type { ProductCategory, ProductIndex, ProductFormData } from './products';

describe('Products Types', () => {
  describe('ProductCategory Interface', () => {
    it('should accept valid ProductCategory object', () => {
      const validProduct: ProductCategory = {
        id: 'test-id',
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        nome_exibicao: 'Test Product',
        status_contratacao: 'ATIVO',
        prazo: {
          minimoMeses: 6,
          maximoMeses: 84
        },
        margem_consignavel_max: 30,
        canais_permitidos: ['DIGITAL', 'PRESENCIAL'],
        exige_validacao: {
          remota: true,
          presencial: false,
          certificacao_digital: null
        },
        faixas: {
          'A': {
            concessao_taxa_am: 2.14,
            renovacao_taxa_am: 1.99,
            condicoes_acesso: ['SCORE_ALTO']
          }
        },
        observacoes: ['Produto teste']
      };

      expect(validProduct.id).toBe('test-id');
      expect(validProduct.categoria).toBe('CONSIGNADO');
      expect(validProduct.subtipo).toBe('INSS');
      expect(validProduct.prazo.minimoMeses).toBe(6);
      expect(validProduct.prazo.maximoMeses).toBe(84);
    });

    it('should accept HABITACAO category', () => {
      const habitacaoProduct: Partial<ProductCategory> = {
        categoria: 'HABITACAO',
        subtipo: 'N/A'
      };

      expect(habitacaoProduct.categoria).toBe('HABITACAO');
      expect(habitacaoProduct.subtipo).toBe('N/A');
    });

    it('should accept different subtypes', () => {
      const subtipos: ProductCategory['subtipo'][] = ['INSS', 'CONVENIO', 'CLT_SUSPENSO', 'N/A'];
      
      subtipos.forEach(subtipo => {
        expect(['INSS', 'CONVENIO', 'CLT_SUSPENSO', 'N/A']).toContain(subtipo);
      });
    });

    it('should accept different status_contratacao values', () => {
      const statusList: ProductCategory['status_contratacao'][] = ['ATIVO', 'SUSPENSO', 'EM_BREVE'];
      
      statusList.forEach(status => {
        expect(['ATIVO', 'SUSPENSO', 'EM_BREVE']).toContain(status);
      });
    });

    it('should handle null values in exige_validacao', () => {
      const validacao: ProductCategory['exige_validacao'] = {
        remota: null,
        presencial: null,
        certificacao_digital: null
      };

      expect(validacao.remota).toBeNull();
      expect(validacao.presencial).toBeNull();
      expect(validacao.certificacao_digital).toBeNull();
    });

    it('should handle faixas with multiple entries', () => {
      const faixas: ProductCategory['faixas'] = {
        'A': {
          concessao_taxa_am: 2.14,
          renovacao_taxa_am: 1.99,
          condicoes_acesso: ['SCORE_ALTO']
        },
        'B': {
          concessao_taxa_am: 2.64,
          renovacao_taxa_am: 2.49,
          condicoes_acesso: ['SCORE_MEDIO']
        },
        'C': {
          concessao_taxa_am: 3.14,
          renovacao_taxa_am: 2.99,
          condicoes_acesso: ['SCORE_BAIXO']
        }
      };

      expect(Object.keys(faixas)).toHaveLength(3);
      expect(faixas['A']?.concessao_taxa_am).toBe(2.14);
      expect(faixas['B']?.renovacao_taxa_am).toBe(2.49);
      expect(faixas['C']?.condicoes_acesso).toContain('SCORE_BAIXO');
    });
  });

  describe('ProductIndex Interface', () => {
    it('should accept valid ProductIndex object', () => {
      const validIndex: ProductIndex = {
        version: '1.0.0',
        itens: [
          { id: 'prod1', path: '/products/prod1.json' },
          { id: 'prod2', path: '/products/prod2.json' }
        ]
      };

      expect(validIndex.version).toBe('1.0.0');
      expect(validIndex.itens).toHaveLength(2);
      expect(validIndex.itens[0]?.id).toBe('prod1');
      expect(validIndex.itens[0]?.path).toBe('/products/prod1.json');
    });

    it('should handle empty itens array', () => {
      const emptyIndex: ProductIndex = {
        version: '1.0.0',
        itens: []
      };

      expect(emptyIndex.itens).toHaveLength(0);
      expect(Array.isArray(emptyIndex.itens)).toBe(true);
    });
  });

  describe('ProductFormData Interface', () => {
    it('should accept valid ProductFormData object', () => {
      const validFormData: ProductFormData = {
        categoria: 'CONSIGNADO',
        subtipo: 'INSS',
        convenio_id: 'conv123',
        nome: 'Produto Teste',
        descricao: 'Descrição do produto',
        prazo_minimo: 6,
        prazo_maximo: 84,
        margem_consignavel: 30,
        canais_permitidos: ['DIGITAL'],
        taxa_faixa_a_concessao: 2.14,
        taxa_faixa_a_renovacao: 1.99,
        taxa_faixa_b_concessao: 2.64,
        taxa_faixa_b_renovacao: 2.49,
        taxa_faixa_c_concessao: 3.14,
        taxa_faixa_c_renovacao: 2.99,
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: false,
        observacoes: ['Observação teste']
      };

      expect(validFormData.nome).toBe('Produto Teste');
      expect(validFormData.categoria).toBe('CONSIGNADO');
      expect(validFormData.subtipo).toBe('INSS');
      expect(validFormData.prazo_minimo).toBe(6);
      expect(validFormData.taxa_faixa_a_concessao).toBe(2.14);
    });

    it('should accept empty string values for categoria and subtipo', () => {
      const formData: Partial<ProductFormData> = {
        categoria: '',
        subtipo: ''
      };

      expect(formData.categoria).toBe('');
      expect(formData.subtipo).toBe('');
    });

    it('should handle all categoria options', () => {
      const categorias: ProductFormData['categoria'][] = ['CONSIGNADO', 'HABITACAO', ''];
      
      categorias.forEach(categoria => {
        expect(['CONSIGNADO', 'HABITACAO', '']).toContain(categoria);
      });
    });

    it('should handle all subtipo options', () => {
      const subtipos: ProductFormData['subtipo'][] = ['INSS', 'CONVENIO', 'CLT_SUSPENSO', 'N/A', ''];
      
      subtipos.forEach(subtipo => {
        expect(['INSS', 'CONVENIO', 'CLT_SUSPENSO', 'N/A', '']).toContain(subtipo);
      });
    });

    it('should handle boolean validation fields', () => {
      const validations = {
        exige_validacao_remota: true,
        exige_validacao_presencial: false,
        exige_certificacao_digital: true
      };

      expect(typeof validations.exige_validacao_remota).toBe('boolean');
      expect(typeof validations.exige_validacao_presencial).toBe('boolean');
      expect(typeof validations.exige_certificacao_digital).toBe('boolean');
    });

    it('should handle arrays for canais_permitidos and observacoes', () => {
      const arrays = {
        canais_permitidos: ['DIGITAL', 'PRESENCIAL', 'TELEFONE'],
        observacoes: ['Obs 1', 'Obs 2', 'Obs 3']
      };

      expect(Array.isArray(arrays.canais_permitidos)).toBe(true);
      expect(Array.isArray(arrays.observacoes)).toBe(true);
      expect(arrays.canais_permitidos).toHaveLength(3);
      expect(arrays.observacoes).toHaveLength(3);
    });
  });
});
