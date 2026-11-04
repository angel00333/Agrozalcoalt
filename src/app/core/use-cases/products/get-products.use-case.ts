import { Injectable, inject } from '@angular/core';
import { Producto } from '../../domain/models/producto.model';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable({
    providedIn: 'root'
})
export class GetProductsUseCase {
    private readonly repositorio = inject(ProductRepository);

    // ==========================================
    // CONSULTAR PRODUCTOS DEL CATÁLOGO
    // ==========================================
    async execute(): Promise<Producto[]> {
        return await this.repositorio.obtenerProductosPublicados();

    }





}




























