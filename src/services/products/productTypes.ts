export interface Product {
  id: string;
  name: string;
  juros: number;          // Percentual anual (ex: 1.36 = 1.36%)
  prazoMaximo: number;    // Em meses (ex: 32)
  normativo: string;      // Código normativo (ex: "CO055")
  active: boolean;
  createdAt: string;      // ISO string
  updatedAt: string;      // ISO string
}

export interface CreateProductRequest {
  name: string;
  juros: number;
  prazoMaximo: number;
  normativo: string;
}

export interface CreateProductResponse {
  success: boolean;
  data?: Product;
  error?: string;
}
