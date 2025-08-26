import { ProductCategory, ProductIndex, CommonRules } from '@/types/products';

// Imports diretos dos arquivos JSON
import productsIndex from '../../data/products.index.json';
import commonRules from '../../data/consignado/_common_rules.json';
import militarData from '../../data/consignado/convenios/militar.json';
import funcefData from '../../data/consignado/convenios/funcef_new.json';
import tjdftData from '../../data/consignado/convenios/tjdft_new.json';
import inssData from '../../data/consignado/inss.json';
import habitacaoSacData from '../../data/habitacao/sac.json';
import habitacaoPriceData from '../../data/habitacao/price.json';
import outroTemplateData from '../../data/outro/template_minimo.json';

// Serviço para carregar dados dos arquivos JSON
class ProductDataService {
  private static instance: ProductDataService;
  private productIndex: ProductIndex | null = null;
  private commonRules: CommonRules | null = null;
  private productCache: Map<string, ProductCategory> = new Map();

  static getInstance(): ProductDataService {
    if (!ProductDataService.instance) {
      ProductDataService.instance = new ProductDataService();
    }
    return ProductDataService.instance;
  }

  // Carregar índice de produtos
  async loadProductIndex(): Promise<ProductIndex> {
    if (this.productIndex) {
      return this.productIndex;
    }

    try {
      this.productIndex = productsIndex as ProductIndex;
      return this.productIndex;
    } catch (error) {
      throw error;
    }
  }

  // Carregar regras comuns
  async loadCommonRules(): Promise<CommonRules> {
    if (this.commonRules) {
      return this.commonRules;
    }

    try {
      this.commonRules = commonRules as CommonRules;
      return this.commonRules;
    } catch (error) {
      throw error;
    }
  }

  // Carregar produto específico
  async loadProduct(productId: string): Promise<ProductCategory> {
    if (this.productCache.has(productId)) {
      return this.productCache.get(productId)!;
    }

    let product: ProductCategory;

    try {
      // Mapeamento direto dos produtos disponíveis
      switch (productId) {
        case 'consignado_inss':
          product = inssData as unknown as ProductCategory;
          break;
        case 'consignado_convenio_militar':
          product = militarData as unknown as ProductCategory;
          break;
        case 'consignado_convenio_funcef':
          product = funcefData as unknown as ProductCategory;
          break;
        case 'consignado_convenio_tjdft':
          product = tjdftData as unknown as ProductCategory;
          break;
        case 'habitacao_sac':
          product = habitacaoSacData as unknown as ProductCategory;
          break;
        case 'habitacao_price':
          product = habitacaoPriceData as unknown as ProductCategory;
          break;
        case 'outro_template':
          product = outroTemplateData as unknown as ProductCategory;
          break;
        default:
          throw new Error(`Produto ${productId} não encontrado`);
      }

      this.productCache.set(productId, product);
      return product;
    } catch (error) {
      throw error;
    }
  }

  // Listar produtos por categoria
  async getProductsByCategory(categoria?: 'CONSIGNADO' | 'HABITACAO'): Promise<ProductCategory[]> {
    const index = await this.loadProductIndex();
    const products: ProductCategory[] = [];

    for (const item of index.itens) {
      try {
        const product = await this.loadProduct(item.id);
        if (!categoria || product.categoria === categoria) {
          products.push(product);
        }
      } catch (error) {
      }
    }

    return products;
  }

  // Listar convênios ativos
  async getActiveConvenios(): Promise<ProductCategory[]> {
    const products = await this.getProductsByCategory('CONSIGNADO');
    return products.filter(product => 
      product.subtipo === 'CONVENIO' && 
      product.status_contratacao === 'ATIVO'
    );
  }

  // Obter opções de canal por produto
  getCanaisPermitidos(product: ProductCategory): Array<{value: string, label: string}> {
    const canaisMap: Record<string, string> = {
      'AGENCIA': 'Agência Física',
      'AG_DIGITAL': 'Agência Digital',
      'AUTOSERVICO_ATM_IBC_MBC': 'Autoatendimento (ATM/IBC/MBC)',
      'LOTERICA': 'Lotérica CAIXA',
      'PORTAL_TERCEIRIZADO': 'Portal Terceirizado',
      'OUTROS': 'Outros Canais'
    };

    return product.canais_permitidos.map(canal => ({
      value: canal,
      label: canaisMap[canal] || canal
    }));
  }

  // Determinar faixa aplicável baseada no canal e condições
  determineFaixa(_product: ProductCategory, canal: string, _condicoes: string[]): 'A' | 'B' | 'C' {
    // Lógica simplificada - pode ser expandida baseada nas condições específicas
    if (canal === 'AGENCIA' || canal === 'AG_DIGITAL') {
      return 'A';
    }
    if (canal === 'AUTOSERVICO_ATM_IBC_MBC' || canal === 'LOTERICA') {
      return 'B';
    }
    return 'C';
  }

  // Obter taxa baseada na faixa e tipo de operação
  getTaxaByFaixa(
    product: ProductCategory, 
    faixa: 'A' | 'B' | 'C', 
    tipoOperacao: 'CONCESSAO' | 'RENOVACAO'
  ): number {
    const faixaData = product.faixas[faixa];
    if (!faixaData) {
      throw new Error(`Faixa ${faixa} não encontrada para o produto`);
    }

    return tipoOperacao === 'CONCESSAO' 
      ? faixaData.concessao_taxa_am 
      : faixaData.renovacao_taxa_am;
  }

  // Validar se produto permite simulação
  canSimulate(product: ProductCategory): { canSimulate: boolean; reason?: string } {
    if (product.status_contratacao === 'SUSPENSO') {
      return {
        canSimulate: false,
        reason: 'Produto suspenso conforme MP 1292 – consignado celetista'
      };
    }

    if (product.status_contratacao === 'EM_BREVE') {
      return {
        canSimulate: false,
        reason: 'Simulação será liberada em breve'
      };
    }

    return { canSimulate: true };
  }

  // Método específico para carregar dados de convênio por nome
  async loadConvenio(convenioNome: string): Promise<any> {
    try {
      switch (convenioNome.toLowerCase()) {
        case 'inss':
          return inssData;
        case 'militar':
          return militarData;
        case 'funcef':
          return funcefData;
        case 'tjdft':
          return tjdftData;
        default:
          throw new Error(`Convênio ${convenioNome} não encontrado`);
      }
    } catch (error) {
      throw error;
    }
  }

  // Método específico para carregar dados de habitação por sistema
  async loadHabitacao(sistemaAmortizacao: string): Promise<any> {
    try {
      switch (sistemaAmortizacao.toLowerCase()) {
        case 'sac':
          return habitacaoSacData;
        case 'price':
          return habitacaoPriceData;
        default:
          throw new Error(`Sistema de amortização ${sistemaAmortizacao} não encontrado`);
      }
    } catch (error) {
      throw error;
    }
  }

  // Método específico para carregar template de produto OUTRO
  async loadOutroTemplate(): Promise<any> {
    try {
      return outroTemplateData;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductDataService;
