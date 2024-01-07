export type Usuario = {
    id: string;
    nome: string;
    email: string;
    senha: string;
    role: string;
};

export type Product = {
    id: string | null;
    name: string;
    image: string | null;
    description: string;
    category: string;
    price: number;
    storePrice: number;
    quantity: number;
    link: string;
    new: number;
    inventorystatus: string;
}

export enum Inventorystatus {
    INSTOCK = 'INSTOCK',
    OUTOFSTOCK = 'OUTOFSTOCK',
    RESERVED = 'RESERVED',
}

export enum ProductCategory {
    ELETRONICOS = 'Eletronicos',
    COZINHA = 'Cozinha',
    CAMAMESABANHO = 'CamaMesaBanho',
    MOVEIS = 'Moveis',
}


