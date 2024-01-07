'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Inventorystatus, Product, ProductCategory } from '../lib/domain/definicoes';
import { deleteProduct, getProducts } from '../lib/domain/infra/produtos';
import { signOut } from '@/auth';
import { useFormState } from 'react-dom';
import { logout } from '../lib/domain/infra/usuarios';
import { useAuth } from '../lib/domain/infra/authContext';
import Image from 'next/image';


const Page: React.FC = () => {
  // const { user, logout } = useAuth();
  // const [errorMessage, formAction] = useFormState(logout, undefined);
  const [user, setUser] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('email') || 'John 2' : 'John 2'
  );
  const [products, setProducts] = useState<Product[]>([]); // State for products
  const [selectedProducts, setSelectedProducts] = useState<Product | null>(null); // State for selected product
  const [globalFilter, setGlobalFilter] = useState<string | null>(null); // State for global search filter
  const [displayDialog, setDisplayDialog] = useState<boolean>(false); // State to control visibility of the add product dialog
  const [submitted, setSubmitted] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const dt = useRef(null);

  const [newProduct, setNewProduct] = useState<Product>({
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
    inventorystatus: Inventorystatus.INSTOCK,
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

  // useEffect(() => {
  //   if (products.length === 0) {
  //     toast.current.show({
  //       severity: 'info',
  //       summary: 'No Products',
  //       detail: 'No products found.',
  //     });
  //     const dummyProducts: Product[] = [
  //       {
  //         id: '1',
  //         name: 'Product 1',
  //         image: null,
  //         description: 'Description 1',
  //         category: ProductCategory.MOVEIS,
  //         price: 100,
  //         storePrice: 120,
  //         quantity: 10,
  //         link: 'https://example.com/product1',
  //         new: 5,
  //         inventorystatus: inventorystatus.INSTOCK,
  //       },
  //     ];
  //     setProducts(dummyProducts);
  //   }
  // }, [products.length]);


  const onProductSelect = (e: any) => {
    setNewProduct({ ...e.data });
    setDisplayDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  }

  const openNew = () => {
    // setProducts([newProduct]);
    setSubmitted(false);
    // setProductDialog(true);
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
    toast.current.show({
      severity: 'success',
      summary: 'Product Added',
      detail: 'New product has been added successfully.',
    });
    setDisplayDialog(false);
  };

  const handleDeleteProduct = (product: Product) => {
    if (product.id) {
      deleteProduct(product.id).then(() => {
        setProducts(products.filter((p) => p.id !== product.id));
        toast.current.show({
          severity: 'success',
          summary: 'Product Deleted',
          detail: 'Product has been deleted successfully.',
        });
      });
    }
  };

  const header_ = (
    <div className="flex flex-column md:flex-row md:items-center justify-between">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Search..." className="w-full lg:w-auto" />
      </span>
      <div className="mt-3 md:mt-0 flex justify-end">
        <Button icon="pi pi-plus" className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openNew} tooltip="New" tooltipOptions={{ position: 'bottom' }} />
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
          <span className="text-lg font-bold">Welcome, {user}</span>
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
        <Column field="new" header="Is New?" sortable />
        <Column field="inventorystatus" header="Status" />
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
        header="Add Product"
        visible={displayDialog}
        modal
        style={{ width: '40vw' }}
        onHide={() => setDisplayDialog(false)}
        content={
          <div className="p-grid p-fluid">
            {/* Example: InputText for product name */}
            <div className="p-col-12">
              <label htmlFor="name">Product Name</label>
              <InputText
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>

            {/* Add more fields as needed */}

            {/* Example: Add product button */}
            <div className="p-col-12 mt-2">
              <Button label="Add Product" icon="pi pi-check" onClick={handleAddProduct} />
            </div>
          </div>
        }
      ></Dialog>

    </div >
  );
};

export default Page;
