import { DetalhePedido } from './DetalhePedido';

export class ItemListaPedido {
    "id": number;
    "checked": boolean;
    "numero": number;
    "cliente_id": number;
    "valor_subtotal": number;
    "valor_envio": number;
    "valor_desconto": number;
    "valor_total": number;
    "data_criacao": string;
    "data_modificacao": string;
    "data_expiracao": string;
    "detalhe": DetalhePedido;
    constructor() {
        this.checked = false;
    }
};