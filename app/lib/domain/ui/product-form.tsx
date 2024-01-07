// product-form.tsx
import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { InventoryStatus, Product, ProductCategory } from '../definicoes';
import { addProduct } from '../infra/produtos';

interface ProductFormProps {
    hideDialog: () => void;
}

const initialProductState: Product = {
    id: null,
    name: '',
    image: null,
    description: '',
    category: ProductCategory.MOVEIS,
    price: 0,
    storePrice: 0,
    quantity: 0,
    link: '',
    new: 0,
    inventoryStatus: InventoryStatus.INSTOCK,
};

export default function ProductForm({ hideDialog }: ProductFormProps) {
    const [product, setProduct] = useState<Product>(initialProductState);
    const [errorMessage, formAction] = useFormState((state: Product | undefined) => addProduct(state || initialProductState), undefined);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Lógica de validação e preparação do produto aqui...

        // Chama a função addProduct passando o produto atual
        await formAction();

        // Após o sucesso, reinicia o estado do produto e esconde o diálogo
        setProduct(initialProductState);
        hideDialog();
    };

    const handleChange = (field: keyof Product, value: any) => {
        setProduct((prevProduct) => ({ ...prevProduct, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="field">
                <label htmlFor="name">Nome</label>
                <input
                    type="text"
                    id="name"
                    value={product.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                />
            </div>

            <div className="field">
                <label htmlFor="description">Descrição</label>
                <textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    required
                    rows={3}
                />
            </div>

            <div className="field">
                <label htmlFor="category">Categoria</label>
                <select
                    id="category"
                    value={product.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                >
                    {Object.values(ProductCategory).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="field">
                <label htmlFor="storePrice">Preço na loja</label>
                <input
                    type="number"
                    id="storePrice"
                    value={product.storePrice}
                    onChange={(e) => handleChange('storePrice', parseFloat(e.target.value))}
                    required
                />
            </div>

            <div className="field">
                <label htmlFor="price">Preço</label>
                <input
                    type="number"
                    id="price"
                    value={product.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                    required
                />
            </div>

            <div className="field">
                <label htmlFor="quantity">Quantidade</label>
                <input
                    type="number"
                    id="quantity"
                    value={product.quantity}
                    onChange={(e) => handleChange('quantity', parseInt(e.target.value, 10))}
                    required
                />
            </div>

            <div className="field">
                <label htmlFor="link">Link do produto na loja</label>
                <input
                    type="text"
                    id="link"
                    value={product.link}
                    onChange={(e) => handleChange('link', e.target.value)}
                    required
                />
            </div>

            <button type="submit">Adicionar Produto</button>
        </form>
    );
}
