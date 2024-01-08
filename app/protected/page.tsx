'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Inventorystatus, Product, ProductCategory } from '../lib/domain/definicoes';
import { POST, addProduct, deleteProduct, getProductById, getProductByName, getProducts } from '../lib/domain/infra/produtos';
import { logout } from '../lib/domain/infra/usuarios';
import Image from 'next/image';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';

const Page: React.FC = () => {
  // const [errorMessage, formAction] = useFormState(logout, undefined);
  const [user, setUser] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('email') || 'email@email.com' : 'email@email.com'
  );
  const [products, setProducts] = useState<Product[]>([]); // State for products
  const [selectedProducts, setSelectedProducts] = useState<Product | null>(null); // State for selected product
  const [globalFilter, setGlobalFilter] = useState<string | null>(null); // State for global search filter
  const [displayDialog, setDisplayDialog] = useState<boolean>(false); // State to control visibility of the add product dialog
  const [submitted, setSubmitted] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const dt = useRef(null);
  const [productDialog, setProductDialog] = useState(false);

  const [product, setProduct] = useState<Product>({
    id: null,
    name: 'Tela computador 1 - LG 29',
    image: 'monitor-lg-29-ultrawide.jpg',
    description: 'LG 29UM69G Ultrawide',
    category: 'ELETRONICOS',
    price: 800,
    storePrice: 946,
    quantity: 1,
    link: 'https://www.amazon.com.br/gp/product/B078TPLC2X/ref=ppx_yo_dt_b_asin_title_o04_s00?ie=UTF8&psc=1',
    new: 5,
    inventorystatus: 'INSTOCK',
  });

  const toast = React.useRef<any>(null);


  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data || [])
        console.log('getProducts', data)
      })
      .catch((error) => console.error(error));
  }, []);

  const onProductSelect = (e: any) => {
    setProduct({ ...e.data });
    setDisplayDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  }

  const openNew = () => {
    setProducts([product]);
    setProductDialog(true);
    setSubmitted(false);
    (true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  }

  const imageBodyTemplate = (rowData: { image: string | undefined; }) => {

    return (
      <div className="w-7rem shadow-2">
        <Image
          src={'/images/products/mesa-L-quarto.jpg'}
          alt={rowData.image || ''}
          width={100}
          height={100}
        />
      </div>
    );
  }

  // const exportCSV = () => {
  //   dt.current.exportCSV();
  // }

  const handleAddProduct = () => {
    // Handle logic to add new product (e.g., API call or local storage update)
    // ...
    return alert('Produto cadastrado comm sucesso.');

    setDisplayDialog(false);
  };

  const statusBodyTemplate = (rowData: { inventorystatus: string; }) => {
    console.log(JSON.stringify(rowData))
    return <Tag value={rowData.inventorystatus} severity={getSeverity(rowData)}></Tag>;
  };

  const getSeverity = (rowData: { inventorystatus: string; }) => {
    console.log('getSeverity', rowData.inventorystatus)
    switch (rowData.inventorystatus) {
      case 'INSTOCK':
        return 'success';

      case 'OUTOFSTOCK':
        return 'warning';

      case 'RESERVED':
        return 'danger';

      default:
        return null;
    }
  };

  const handleDeleteProduct = (product: Product) => {
    if (product.id) {
      deleteProduct(product.id).then(() => {
        setProducts(products.filter((p) => p.id !== product.id));
        return alert('Produto deletado com sucesso.');

      });
    }
  };

  const onInputChange = (e: any, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _product = {
      ...product,
      [`${name}`]: val
    };
    setProduct(_product);
  }

  const onInputNumberChange = (e: any, name: string) => {
    const val = e.value || 0;
    let _product = {
      ...product,
      [`${name}`]: val
    };
    setProduct(_product);
  }


  const saveProduct = async () => {
    let index;
    if (product.id)
      index = getProductById(product.id);

    if (index) {
      alert('Produto já cadastrado.');
      setProductDialog(false);
      return Promise.reject('Produto já cadastrado.');
    }

    let produtCadastrado = await getProductByName(product.name);
    if (produtCadastrado) {
      alert('Produto já cadastrado.');
      setProductDialog(false);
      return Promise.reject('Produto já cadastrado.');
    }


    product.image = product.image ? product.image : 'product-placeholder.svg';

    try {
      console.log('saveProduct', product)

      addProduct(product).then(() => {
        setProducts([...products, product]);
        alert('Produto cadastrado com sucesso.');
        return Promise.resolve('Produto cadastrado com sucesso.');

      }).catch((error) => {
        console.error(error);
      }).finally(() => {
        setProductDialog(false);
      });
    } catch (error) {
      console.error(error);
    }
  }

  const productDialogFooter = (
    <div className='flex justify-between gap-4 p-5'>
      <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text bg-red-400" style={{ color: 'white' }} onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
      </React.Fragment>
    </div>
  );

  const ratingBodyTemplate = (rowData: { new: number | undefined; }) => {
    return <Rating value={rowData.new} readOnly cancel={false} />;
  }

  const header_ = (
    <div className="flex flex-column md:flex-row md:items-center justify-between">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Search..." className="w-full lg:w-auto" />
      </span>
      <div className="mt-3 md:mt-0 flex justify-end items-center">
        <Button icon="pi pi-plus" className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openNew} tooltip="Novo" tooltipOptions={{ position: 'bottom' }} />
        <Button icon="pi pi-trash" className="p-button-danger mr-2 p-button-rounded" onClick={confirmDeleteSelected} disabled={!selectedProducts} tooltip="Delete" tooltipOptions={{ position: 'bottom' }} />
        {/* <Button icon="pi pi-upload" className="p-button-help p-button-rounded" onClick={exportCSV} tooltip="Export" tooltipOptions={{ position: 'bottom' }} /> */}
      </div>
    </div>
  );


  return (
    <div className="row">
      <Toast ref={toast} content />

      <div className="flex justify-between mb-3 md:items-center ml-5">
        <h1 className="text-2xl font-bold">Venda de Garagem!</h1>
        <div className="flex flex-column md:flex-row md:items-center justify-between mr-5">
          <span className="text-lg font-bold">Bem vindo, {user}</span>
          <form action={async () => { await logout(); }} method="post">
            <button className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </form>
        </div>
      </div>


      <DataTable
        value={products}
        selectionMode="single"
        header={header_}
        globalFilter={globalFilter}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
      >
        <Column field="name" header="Name" sortable />
        <Column field="description" header="Descrição" />
        {/* <Column field="image" header="Imagem" body={imageBodyTemplate}></Column> */}
        <Column field="category" header="Category" sortable />
        <Column field="price" header="Price" sortable />
        <Column field="new" header="Novo?" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
        <Column field="inventorystatus" body={statusBodyTemplate} header="Status" style={{ width: '20%' }} />
        <Column
          body={(rowData) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-mr-2"
                onClick={() => onProductSelect(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteProduct(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>

      {/* Add Product Dialog */}
      <Dialog
        visible={productDialog}
        breakpoints={{ '960px': '75vw', '640px': '100vw' }}
        style={{ width: '40vw' }}
        header="Adicionar Item para Venda"
        modal className="p-fluid"
        // footer={productDialogFooter}
        onHide={hideDialog}
        content={
          <div className='flex-col m-4 gap-4 gap-y-2 bg-zinc-300 p-5'>
            <div className="field">
              <label htmlFor="name">Nome</label>
              <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
              {submitted && !product.name && <small className="p-error">Nome é obrigatório.</small>}
            </div>
            <div className="field">
              <label htmlFor="description">Descrição</label>
              <InputTextarea id="description" value={product.description} onChange={(e: any) => onInputChange(e, 'description')} required rows={3} cols={20} />
            </div>

            <div className="field">
              <label className="mb-3">Categoria</label>
              <div className="flex gap-8 m-4 justify-between">
                <div className="field-radiobutton col-6">
                  <RadioButton inputId="category1" name="category" value="Moveis" onChange={(e: any) => onInputChange(e, 'category')} checked={product.category === 'Moveis'} />
                  <label htmlFor="category1">Móveis</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton inputId="category2" name="category" value="Eletronicos" onChange={(e: any) => onInputChange(e, 'category')} checked={product.category === 'Eletronicos'} />
                  <label htmlFor="category2">Eletrônicos</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton inputId="category3" name="category" value="Cozinha" onChange={(e: any) => onInputChange(e, 'category')} checked={product.category === 'Cozinha'} />
                  <label htmlFor="category3">Cozinha</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton inputId="category4" name="category" value="CamaMesaBanho" onChange={(e: any) => onInputChange(e, 'category')} checked={product.category === 'CamaMesaBanho'} />
                  <label htmlFor="category4">Cama Mesa e Banho</label>
                </div>
              </div>
            </div>

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="new">Está novo? ( 0 a 5 )</label>
                <InputNumber id="new" value={product.new} onChange={(e: any) => onInputNumberChange(e, 'new')} min={0} max={5} />
              </div>
              <div className="field col">
                <label htmlFor="storePrice">Preço na loja</label>
                <InputNumber id="storePrice" value={product.storePrice} onValueChange={(e) => onInputNumberChange(e, 'storePrice')} mode="currency" currency="BRL" locale="pt-BR" />
              </div>
              <div className="field col">
                <label htmlFor="price">Preço</label>
                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="BRL" locale="pt-BR" />
              </div>
              <div className="field col">
                <label htmlFor="quantity">Quantity</label>
                <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="link">Link do produto na loja</label>
              <InputText id="link" value={product.link} onChange={(e) => onInputChange(e, 'link')} autoFocus />
            </div>
            <div className="field">
              <label htmlFor="image">Nome para caminho da imagem</label>
              <InputText id="image" value={product.image || 'imagem-default.jpeg'} onChange={(e) => onInputChange(e, 'image')} autoFocus />
            </div>
            {productDialogFooter}
          </div>
        }
      ></Dialog>

    </div >
  );
};

export default Page;
