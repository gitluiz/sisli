import { Cliente } from './Cliente';
import { EnderecoEntrega } from './EnderecoEntrega';

export class DetalhePedido {
    cliente: Cliente;
    cupom_desconto: string;
    utm_campaign: string;
    data_criacao: string;
    data_expiracao: string;
    data_modificacao: string;
    endereco_entrega: EnderecoEntrega;
    envios: Array<any>;
    itens: Array<string>;
    numero: number;
    pagamentos: Array<string>;
    peso_real: number;
    resource_uri: string;
    situacao: string;
    valor_desconto: number;
    valor_envio: number;
    valor_subtotal: number;
    valor_total: number;
};