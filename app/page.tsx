'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Rating } from 'primereact/rating';
import Image from 'next/image';
import { InventoryStatus, Product, ProductCategory } from './lib/domain/definicoes';
import { getProducts } from './lib/domain/infra/produtos';
import 'primeicons/primeicons.css';
import { json } from 'stream/consumers';
import { formatCurrency } from './lib/domain/infra/utils';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);
  const dt = useRef(null);

  const toast = React.useRef<any>(null);


  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data || [])
        console.log('getProducts', data)
      })
      .catch((error) => console.error(error));
  }, []);



  const imageBodyTemplate = (rowData: { image: string | undefined; }) => {

    return (
      <div className="w-7rem shadow-2">
        <Image
          src={`/demo/images/products/${rowData.image}`}
          alt={rowData.image || ''}
          width={100}
          height={100}
        />
      </div>
    );
  }

  const priceBodyTemplate = (rowData: { price: number; }) => {
    return formatCurrency(rowData.price);
  }

  const productsCartTable = () => {
    if (selectedProducts === null) return (<div></div>);

    return (
      <div>
        <DataTable
          value={selectedProducts}
          header={header_checkout}
          dataKey="id"
          footer={productDialogFooter}
        >
          <Column field="name" header="Name" style={{ minWidth: '12rem', paddingTop: '10px' }} />
          <Column field="image" header="Imagem" body={imageBodyTemplate} style={{ minWidth: '12rem', paddingTop: '10px' }} />
          <Column field="price" header="Price" body={priceBodyTemplate} style={{ minWidth: '12rem', paddingTop: '10px' }} />
        </DataTable>
      </div>

    );

  }

  const handleAddToCart = () => {
    // Lógica para adicionar produtos ao carrinho
    console.log('Adicionar produtos ao carrinho:', selectedProducts);
    if (selectedProducts) {
      setDisplayDialog(true);
      // setReserveProducts([selectedProducts]);
      console.log
    }
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDisplayDialog(false);
  }

  const calculateTotal = (products: Product[] | null): number => {
    if (products === null) return 0;
    return products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const header_ = (
    <div className="card flex flex-wrap justify-start gap-3 ml-5">
      <span className="flex items-center gap-3">
        <i className="pi pi-search" />
        <InputText className="rounded pl-4 w-full lg:w-auto" type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Search..." />
      </span>
    </div>
  );

  const header_checkout = (
    <div className="card flex flex-wrap justify-start gap-3 ml-5">
      <span className="flex items-center gap-3">
        <i className="pi pi-calculator" />
        <span className="text-2xm font-bold">Valor Total:</span>

        {(selectedProducts ? formatCurrency(calculateTotal(selectedProducts)) : formatCurrency(0))}
      </span>
    </div>
  );



  const ratingBodyTemplate = (rowData: { new: number | undefined; }) => {
    return <Rating value={rowData.new} readOnly cancel={false} />;
  }

  const handleReserveProducts = () => {
    setSubmitted(true);

    // Verifica se há produtos selecionados
    if (selectedProducts && selectedProducts.length > 0) {
      const productNames = selectedProducts.map((product: Product) => product?.name).join(', ');

      // Número de telefone do WhatsApp
      const phoneNumber = '+5521969349212';

      // Texto predefinido com os nomes dos produtos
      const message = encodeURIComponent(`Olá! Gostaria de reservar os seguintes produtos: ${productNames}`);

      const message_ = "teste"

      // URL do link do WhatsApp
      const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

      console.log(whatsappLink)
      // Abre uma nova aba no navegador com o link do WhatsApp
      window.open(whatsappLink, '_blank');

      // Limpa a seleção de produtos
      setSelectedProducts(null);
      setDisplayDialog(false);
    } else {
      // Caso nenhum produto esteja selecionado, exibe uma mensagem ou toasts
      toast.current.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um produto para reservar.',
        life: 5000,
      });
    }
  };

  const productDialogFooter = (
    <div className='flex justify-between gap-4 p-5'>
      <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text bg-red-400" onClick={hideDialog} style={{ color: 'white' }} />
        <Button label="Enviar WhatsApp" icon="pi pi-check" onClick={handleReserveProducts} />
      </React.Fragment>
    </div>
  );

  return (
    <div className="p-4 border-round shadow-2">
      <Toast ref={toast} content />

      <div className="flex justify-between mb-3 md:items-center ml-5">
        <h1 className="text-3xl text-800 font-bold mb-4">Venda de Garagem!</h1>
        <Button
          icon="pi pi-shopping-cart"
          label={`Adicionar ao Carrinho (${selectedProducts?.length || 0})`}
          onClick={handleAddToCart}
          className="p-button-rounded p-button-primary"
        />
      </div>

      <DataTable
        value={products}
        selectionMode="single"
        header={header_}
        globalFilter={globalFilter}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value as Product | null)}
        dataKey="id"
        paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
        <Column field="name" header="Name" sortable />
        <Column field="quantity" header="Quantidade" />
        <Column field="description" header="Descrição" />
        <Column field="image" header="Imagem" body={imageBodyTemplate}></Column>
        <Column field="category" header="Category" sortable />
        <Column field="price" header="Price" body={priceBodyTemplate} sortable />
        <Column field="new" header="Novo?" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
        <Column field="inventorystatus" header="Status" />
      </DataTable>

      <Dialog
        visible={displayDialog}
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        style={{ width: '80vw', maxHeight: '140vh' }}
        header="Reservar itens selecionados"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
        content={
          <div className='bg-zinc-300 p-5'>
            <h2>Carrinho</h2>
            {selectedProducts && selectedProducts.length > 0 ? (
              <div>
                {productsCartTable()}
              </div>
            ) : (
              <p>Carrinho vazio</p>
            )}
          </div>
        }

      ></Dialog>
    </div >


  );
};

export default Home;
