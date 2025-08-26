export interface Product {
  id: string;
  name: string;
  juros: number;          // Percentual anual (ex: 1.36 = 1.36%)
  prazoMaximo: number;    // Em meses (ex: 32)
  prazoMinimo?: number;   // Em meses (ex: 1) - campo opcional para produtos OUTRO
  normativo: string;      // Código normativo (ex: "CO055")
  active: boolean;
  createdAt: string;      // ISO string
  updatedAt: string;      // ISO string
  categoria?: string;     // Categoria do produto
  configuracoes?: any;    // Configurações adicionais do produto
}

export interface CreateProductRequest {
  name: string;
  juros: number;
  prazoMaximo: number;
  prazoMinimo?: number;   // Campo opcional para produtos OUTRO
  normativo: string;
  categoria?: string;
  configuracoes?: any;
}

export interface CreateProductResponse {
  success: boolean;
  data?: Product;
  error?: string;
}
