import { DetalhePedido } from './DetalhePedido';
export class ItemListaPedido {
    "resource_uri": string;
    "checked": boolean;
    "numero": number;
    "cliente": string;
    "valor_subtotal": number;
    "valor_envio": number;
    "valor_desconto": number;
    "valor_total": number;
    "data_criacao": string;
    "data_modificacao": string;
    "data_expiracao": string;
    "detalhe": DetalhePedido;
    constructor (){
        this.detalhe = new DetalhePedido();
    }
};