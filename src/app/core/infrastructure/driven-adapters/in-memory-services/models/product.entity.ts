export interface ProductEntity {
  id: string;
  name: string;
  type: 'cosecha' | 'insumo';
  category: string;
  price: number;
  unit: string;
  stock: number;
  location: string;
  seller: string;
  emoji: string;
  description: string;
}
