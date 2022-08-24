import axios from 'axios';
import api from '../api/api'

export class ProductService {

    getProductsSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }

    getProducts() {
        return axios.get('assets/demo/data/products.json').then(res => res.data.data);
    }

    getProductsWithOrdersSmall() {
        return axios.get('assets/demo/data/products-orders-small.json').then(res => res.data.data);
    }

    getProdutos() {
        return api.get('/produtos/produtos/').then(res => res.data.data).catch((error) =>{
            console.log(error.message);
        });
    }
    
    getCategorias() {
        return axios.get('assets/demo/data/categorias.json').then(res => res.data.data);
    }
}