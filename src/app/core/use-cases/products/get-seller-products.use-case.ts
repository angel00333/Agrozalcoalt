import { Injectable, inject } from '@angular/core';
import { Producto } from '../../domain/models/producto.model';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable({
    providedIn: 'root'
})

export class GetSellerProductUseCase {
    private readonly repositorio = inject(ProductRepository);
    //Recuperar productos awsociado al UID del agricultor.
    async execute(vendedorUID: string): Promise<Producto[]> {

        if (!vendedorUID?.trim()) {
            throw new Error('Debes iniciar sesión para consultar tus publicaciones.');

        }

        return await this.repositorio.obtenerProductoPorVendedor(
            vendedorUID.trim()
        );
    }



}




