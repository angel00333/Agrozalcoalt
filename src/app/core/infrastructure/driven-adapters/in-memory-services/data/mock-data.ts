import { ConsultaTecnica } from '../../../../domain/models/consulta.model';
import { Pedido } from '../../../../domain/models/pedido.model';
import { UserProfile } from '../../../../domain/models/user-profile.model';
import { ProductEntity } from '../models/product.entity';

export const PRODUCT_ENTITIES: ProductEntity[] = [
  { id: '1', name: 'Tomate criollo', type: 'cosecha', category: 'Hortalizas', price: 0.6, unit: 'lb', stock: 300, location: 'Izalco, Sonsonate', seller: 'Don Mario Pérez', emoji: '🍅', description: 'Cosecha fresca de esta semana, cultivado sin agroquímicos pesados.' },
  { id: '2', name: 'Maíz blanco', type: 'cosecha', category: 'Granos', price: 18, unit: 'quintal', stock: 50, location: 'Nahuizalco, Sonsonate', seller: 'Coop. Los Naranjos', emoji: '🌽', description: 'Maíz seco y limpio, ideal para tortillas y pupusas.' },
  { id: '3', name: 'Loroco', type: 'cosecha', category: 'Hortalizas', price: 2.5, unit: 'lb', stock: 40, location: 'Cuisnahuat, Sonsonate', seller: 'Doña Rosa Hernández', emoji: '🌿', description: 'Flor de loroco recién cortada.' },
  { id: '4', name: 'Mango tommy', type: 'cosecha', category: 'Frutas', price: 0.25, unit: 'unidad', stock: 500, location: 'Acajutla, Sonsonate', seller: 'Finca El Palmar', emoji: '🥭', description: 'Mango maduro de temporada.' },
  { id: '5', name: 'Fertilizante 15-15-15', type: 'insumo', category: 'Fertilizantes', price: 32, unit: 'quintal', stock: 80, location: 'Sonsonate', seller: 'AgroInsumos Sonsonate', emoji: '🧪', description: 'Fertilizante granulado balanceado para todo tipo de cultivo.' },
  { id: '6', name: 'Semilla de chile pimiento', type: 'insumo', category: 'Semillas', price: 4.5, unit: 'sobre', stock: 200, location: 'Armenia, Sonsonate', seller: 'Semillas del Valle', emoji: '🌱', description: 'Semilla certificada con alto porcentaje de germinación.' },
  { id: '7', name: 'Bomba de mochila 20 L', type: 'insumo', category: 'Herramientas', price: 45, unit: 'unidad', stock: 15, location: 'Sonsonate', seller: 'Ferretería El Campo', emoji: '🧰', description: 'Fumigadora manual de 20 litros, resistente y fácil de usar.' },
];

export const CATEGORIES = ['Todas', 'Hortalizas', 'Granos', 'Frutas', 'Fertilizantes', 'Semillas', 'Herramientas'];

export const ORDER_ENTITIES: Pedido[] = [
  { id: 'P-001', producto: 'Fertilizante 15-15-15', cantidad: '2 quintales', estado: 'En camino', fecha: '30 sep 2026' },
  { id: 'P-002', producto: 'Tomate criollo', cantidad: '100 lb', estado: 'Entregado', fecha: '25 sep 2026' },
  { id: 'P-003', producto: 'Semilla de chile pimiento', cantidad: '10 sobres', estado: 'Pendiente', fecha: '02 oct 2026' },
];

export const ADVISORY_ENTITIES: ConsultaTecnica[] = [
  { pregunta: '¿Cómo controlo la mosca blanca en tomate?', respuesta: 'Usa trampas amarillas y aplica jabón potásico cada 5 días.', tecnico: 'Ing. Carla Mejía' },
  { pregunta: '¿Cuándo sembrar maíz en época lluviosa?', respuesta: 'Idealmente en las primeras lluvias de mayo.', tecnico: 'Ing. Luis Ramos' },
];

export const USER_PROFILE_ENTITY: UserProfile = {
  id: 'user-001',
  nombre: 'Mario Pérez',
  rol: 'Agricultor',
  ubicacion: 'Izalco, Sonsonate',
  productos: 12,
  pedidos: 34,
  valoracion: 4.8,
};
