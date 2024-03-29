'use server';

import { sql } from '@vercel/postgres';
import { Product, Usuario } from '../definicoes';

export async function getProductById(id: string): Promise<Product | undefined> {
    try {
        const product = await sql<Product>`SELECT * FROM products WHERE id=${id}`;
        return product.rows[0];
    } catch (erro) {
        console.error('Erro na consulta de product:', erro);
        throw new Error('Erro na consulta de product.');
    }
}

export async function getProductByName(name: string): Promise<Product | undefined> {
    try {
        const product = await sql<Product>`SELECT * FROM products WHERE name =${name}`;
        return product.rows[0];
    } catch (erro) {
        console.error('Erro na consulta de product:', erro);
        throw new Error('Erro na consulta de product.');
    }
}

export async function getProducts(): Promise<Product[] | undefined> {
    try {
        const products = await sql`SELECT * FROM products`;
        const productsList = products.rows as Product[];
        console.log('RETORNO CONSULTA PRODUCTS',productsList)
        return productsList;
    } catch (erro) {
        console.error('Erro na consulta de product:', erro);
        throw new Error('Erro na consulta de product.');
    }
}

export async function deleteProduct(id: string): Promise<void> {
    try {
        await sql`DELETE FROM products WHERE id=${id}`;
    } catch (erro) {
        console.error('Erro na consulta de product:', erro);
        throw new Error('Erro na consulta de product.');
    }
}

export async function addProduct(newProduct: Product): Promise<Product> {
    try {
        const product = await sql<Product>`
        INSERT INTO products 
        (name, image, description, category, price, storePrice, quantity, link, new, 
            inventorystatus) VALUES 
            (${newProduct.name}, ${newProduct.image}, ${newProduct.description}, 
                ${newProduct.category}, ${newProduct.price}, ${newProduct.storePrice}, 
                ${newProduct.quantity}, ${newProduct.link}, ${newProduct.new}, 
                ${newProduct.inventorystatus});`;
        return product.rows[0];
    } catch (erro) {
        console.error('Erro na consulta de product:', erro);
        throw new Error('Erro na consulta de product.');
    }

}