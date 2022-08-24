import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProductService } from '../service/ProductService';
import axios from 'axios';

const Crud = () => {
    const inventarioStatusItems = [
        {label: 'PRODUTO EM ESTOQUE', value: 'INSTOCK'},
        {label: 'PRODUTO ESGOTADO', value: 'OUTOFSTOCK'},
        {label: 'PRODUTO COM ESTOQUE BAIXO', value: 'LOWSTOCK'}
    ];

    let emptyProduto = {
        id: null,
        codigo:'',
        nome: '',
        descricao: '',
        categoria: '',
        precoCusto: 0,
        precoVenda: 0,
        inventarioStatus: '',
        avaliacaoRating: 0  
    };
    
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState(null);
    const [produtoDialog, setProdutoDialog] = useState(false);
    const [deleteProdutoDialog, setDeleteProdutoDialog] = useState(false);
    const [deleteProdutosDialog, setDeleteProdutosDialog] = useState(false);
    const [produto, setProduto] = useState(emptyProduto);
    const [selectedProdutos, setSelectedProdutos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const produtoService = new ProductService();
        produtoService.getProdutos().then(data => setProdutos(data));
        produtoService.getCategorias().then(data => setCategorias(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const openNew = () => {
        setProduto(emptyProduto);
        setSubmitted(false);
        setProdutoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProdutoDialog(false);
    }

    const hideDeleteProdutoDialog = () => {
        setDeleteProdutoDialog(false);
    }

    const hideDeleteProdutosDialog = () => {
        setDeleteProdutosDialog(false);
    }
    
    const saveProduto = () => {
        setSubmitted(true);
        if (validate()) {
            let _produtos = [...produtos];
            let _produto = { ...produto };
            if (produto.id) {
                const index = findIndexById(produto.id);
                _produtos[index] = _produto;
                toast.current.show({ severity: 'success', summary: 'Confirmação', detail: 'Produto editado com sucesso!', life: 3000 });
            }
            else {
                _produto.id = createId();
                _produto.codigo += createId() + 'dpps';
                _produtos.push(_produto);
                toast.current.show({ severity: 'success', summary: 'Confirmação', detail: 'Produto cadastrado com sucesso!', life: 3000 });
            }
            setProdutos(_produtos);
            setProdutoDialog(false);
            setProduto(emptyProduto);
        }
    }

    const editProduto = (produto) => {
        setProduto({ ...produto });
        setProdutoDialog(true);
    }

    const confirmDeleteProduto = (produto) => {
        setProduto(produto);
        setDeleteProdutoDialog(true);
    }

    const deleteProduto = () => {
        let _produtos = produtos.filter(val => val.id !== produto.id);
        setProdutos(_produtos);
        setDeleteProdutoDialog(false);
        setProduto(emptyProduto);
        toast.current.show({ severity: 'success', summary: 'Confirmação', detail: 'Produto excluído com sucesso!', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < produtos.length; i++) {
            if (produtos[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteProdutosDialog(true);
    }

    const deleteSelectedProdutos = () => {
        let _produtos = produtos.filter(val => !selectedProdutos.includes(val));
        setProdutos(_produtos);
        setDeleteProdutosDialog(false);
        setSelectedProdutos(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Produtos Deleted', life: 3000 });
    }
    /**
    const categoriasItems = categorias.map((elemento) => {
        return {label:`${elemento.nome}`, value: `${elemento.id}`}
    });
    */
    
    const onCategoriaChange = (e) => {
        let _produto = { ...produto };
        _produto['categoria'] = e.value;
        setProduto(_produto);
    }

    const onInventarioStatusChange = (e) => {
        let _produto = { ...produto };
        _produto['inventarioStatus'] = e.value;
        setProduto(_produto);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _produto = { ...produto };
        _produto[`${name}`] = val;

        setProduto(_produto);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _produto = { ...produto };
        _produto[`${name}`] = val;

        setProduto(_produto);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProdutos || !selectedProdutos.length} />
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const codigoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.codigo}
            </>
        );
    }

    const nomeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    }

    const descricaoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descricao</span>
                {rowData.descricao}
            </>
        );
    }
    /**
    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        )
    }
    */
    const precoCustoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Preço de Custo</span>
                {formatCurrency(rowData.precoCusto)}
            </>
        );
    }

    const precoVendaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Preço de venda</span>
                {formatCurrency(rowData.precoVenda)}
            </>
        );
    }
    /**
    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    }
     */
    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Avaliações</span>
                <Rating value={rowData.avaliacaoRating} readonly cancel={false} />
            </>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventarioStatus.toLowerCase()}`}>{rowData.inventarioStatus}</span>
            </>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduto(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduto(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciar Podutos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const produtoDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduto} />
        </>
    );
    const deleteProdutoDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProdutoDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduto} />
        </>
    );
    const deleteProdutosDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProdutosDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProdutos} />
        </>
    );

    const validate = () => {
        if(!produto.nome) return false;
        if(!produto.descricao) return false;
        if(!produto.categoria) return false;
        if(!produto.precoCusto) return false;
        if(!produto.precoVenda) return false;
        if(!produto.inventarioStatus) return false;
        return true
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={produtos} selection={selectedProdutos} onSelectionChange={(e) => setSelectedProdutos(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter} emptyMessage="Nenhum produto encontrado." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="code" header="Código" sortable body={codigoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="descricao" header="Descrição" sortable body={descricaoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="precoCusto" header="Preço de Custo" body={precoCustoBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column field="precoVenda" header="Preço de Venda" body={precoVendaBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                        <Column field="inventarioStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="avaliacaoRating" header="Reviews" body={ratingBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={produtoDialog} style={{ width: '450px' }} header="Detalhes do Produto" modal className="p-fluid" footer={produtoDialogFooter} onHide={hideDialog}>
                        {produto.image && <img src={`assets/demo/images/product/${produto.image}`} alt={produto.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field"> 
                            <label htmlFor="name">Nome</label>
                            <InputText id="name" value={produto.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !produto.nome })} />
                            {submitted && !produto.nome && <small className="p-invalid">O nome é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputTextarea id="description" value={produto.descricao} onChange={(e) => onInputChange(e, 'descricao')} required rows={3} cols={20} />
                            {submitted && !produto.descricao && <small className="p-invalid">A descrição é obrigatória.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="categoria">Categoria</label>
                                <Dropdown name="categoria" value={produto.categoria} options={categoriasItems} onChange={onCategoriaChange} placeholder="Selecione uma categoria"/>
                                {submitted && !produto.categoria && <small className="p-invalid">A categoria é obrigatória.</small>}
                            </div>
                        </div>
                        
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="precoCusto">Preço de Custo</label>
                                <InputNumber id="precoCusto" value={produto.precoCusto} onValueChange={(e) => onInputNumberChange(e, 'precoCusto')} mode="currency" currency="BRL" currencyDisplay="symbol" locale="pt-BR" />
                            </div>
                            <div className="field col">
                                <label htmlFor="precoVenda">Preço de Venda</label>
                                <InputNumber id="precoVenda" value={produto.precoVenda} onValueChange={(e) => onInputNumberChange(e, 'precoVenda')} mode="currency" currency="BRL" currencyDisplay="symbol" locale="pt-BR"/>
                            </div>
                        </div>
                        
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="inventarioStatus">Inventário</label>
                                <Dropdown name="inventarioStatus" value={produto.inventarioStatus} options={inventarioStatusItems} onChange={onInventarioStatusChange} placeholder="Selecione o status de inventário" />
                                {submitted && !produto.inventarioStatus && <small className="p-invalid">A definição de inventério é obrigatória.</small>}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Avaliação</label>
                                <div className="field-radiobutton col-6">
                                    <Rating value={produto.avaliacaoRating} onChange={(e) => onInputChange(e, 'avaliacaoRating')} stars={5} />
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProdutoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProdutoDialogFooter} onHide={hideDeleteProdutoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {produto && <span>Tem certeza de que deseja excluir <b>{produto.nome}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProdutosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProdutosDialogFooter} onHide={hideDeleteProdutosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {produto && <span>Tem certeza de que deseja excluir os produtos selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Crud, comparisonFn);