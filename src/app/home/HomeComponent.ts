import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../shared/service/PedidoService'
import { ItemListaPedido } from '../shared/model/ItemListaPedido';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DetalhePedido } from '../shared/model/DetalhePedido';
import { ListaPedido } from '../shared/model/ListaPedido';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })

  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  consultado: boolean;
  ckecked: boolean;
  produtos: any;
  listRef: any;

  situacaolist: any[] = [
    {
      "aprovado": false,
      "cancelado": false,
      "codigo": "aguardando_pagamento",
      "final": false,
      "id": 2,
      "nome": "Aguardando pagamento",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/2"
    },
    {
      "aprovado": true,
      "cancelado": false,
      "codigo": "em_producao",
      "final": false,
      "id": 17,
      "nome": "Em produção",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/17"
    },
    {
      "aprovado": false,
      "cancelado": true,
      "codigo": "pagamento_devolvido",
      "final": true,
      "id": 7,
      "nome": "Pagamento devolvido",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/7"
    },
    {
      "aprovado": false,
      "cancelado": false,
      "codigo": "pagamento_em_analise",
      "final": false,
      "id": 3,
      "nome": "Pagamento em análise",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/3"
    },
    {
      "aprovado": true,
      "cancelado": false,
      "codigo": "pedido_chargeback",
      "final": true,
      "id": 16,
      "nome": "Pagamento em chargeback",
      "notificar_comprador": false,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/16"
    },
    {
      "aprovado": true,
      "cancelado": false,
      "codigo": "pagamento_em_disputa",
      "final": false,
      "id": 6,
      "nome": "Pagamento em disputa",
      "notificar_comprador": false,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/6"
    },
    {
      "aprovado": false,
      "cancelado": true,
      "codigo": "pedido_cancelado",
      "final": true,
      "id": 8,
      "nome": "Pedido Cancelado",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/8"
    },
    {
      "aprovado": false,
      "cancelado": false,
      "codigo": "pedido_efetuado",
      "final": false,
      "id": 9,
      "nome": "Pedido Efetuado",
      "notificar_comprador": false,
      "padrao": true,
      "resource_uri": "/api/v1/situacao/9"
    },
    {
      "aprovado": true,
      "cancelado": false,
      "codigo": "pedido_em_separacao",
      "final": false,
      "id": 15,
      "nome": "Pedido em separação",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/15"
    },
    {
      "aprovado": true,
      "cancelado": false,
      "codigo": "pedido_entregue",
      "final": true,
      "id": 14,
      "nome": "Pedido Entregue",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/14"
    },
    {
      "aprovado": true,
      "cancelado": false,
      "codigo": "pedido_enviado",
      "final": true,
      "id": 11,
      "nome": "Pedido Enviado",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/11"
    },
    {
      "aprovado": true,
      "cancelado": false,
      "codigo": "pedido_pago",
      "final": false,
      "id": 4,
      "nome": "Pedido Pago",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/4"
    },
    {
      "aprovado": true,
      "cancelado": false,
      "codigo": "pronto_para_retirada",
      "final": true,
      "id": 13,
      "nome": "Pedido pronto para retirada",
      "notificar_comprador": true,
      "padrao": false,
      "resource_uri": "/api/v1/situacao/13"
    }
  ]

  public createPagination: any = (totalPaginas: number, paginaAtual: number, np: number) => {
    //np - NUMERO DE LIMITE DE PAGINAS A SER EXIBIDO.
    np = np || 5;
    /*
             * OBJETO DE RETORNO
             */
    const listaDePagina = [];
    paginaAtual = paginaAtual || 0;
    totalPaginas = totalPaginas + 1;
    /*
             * CALCULO
             */
    //1º DEFINI A PRIMEIRA OPÇÃO DA LISTA
    const first = paginaAtual % np === 0 ? paginaAtual : paginaAtual - (paginaAtual % np);
    //2º VALIDAÇÃO DE SEGURANÇÃO
    let last = totalPaginas <= np ? totalPaginas : np;
    //3º DEFINE A ULTIMA OPÇÃO DA LISTA
    last = (totalPaginas - first) > np ? last : totalPaginas - first;
    let count = first;
    for (let i = 0; i < last; i++) {
      listaDePagina[i] = {};
      listaDePagina[i].label = count + 1;
      listaDePagina[i].numero = count;
      count++;
    }
    return listaDePagina;
  }

  public list: ItemListaPedido[] = [];

  public meta: any = {
    total_count: 0,
    previous: null,
    next: null,
    show: false
  };

  total: number;

  hoje(): string {
    const d = new Date();
    return d.toISOString();
  }

  public datalimit = this.hoje().substr(0, 10);

  public pesquisa: any = {
    since_atualizado: this.hoje().substr(0, 10) + 'T00:00:00',
    until_criado: this.hoje().substr(0, 10),
    situacao_id: 4,
    since_numero: null,
    limit: 1
  }

  public language: any = {
    "sEmptyTable": "Nenhum registro encontrado",
    "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
    "sInfoFiltered": "(Filtrados de _MAX_ registros)",
    "sInfoPostFix": "",
    "sInfoThousands": ".",
    "sLengthMenu": "_MENU_ resultados por página",
    "sLoadingRecords": "Carregando...",
    "sProcessing": "Processando...",
    "sZeroRecords": "Nenhum registro encontrado",
    "sSearch": "Pesquisar",
    "oPaginate": {
      "sNext": "Próximo",
      "sPrevious": "Anterior",
      "sFirst": "Primeiro",
      "sLast": "Último"
    },
    "oAria": {
      "sSortAscending": ": Ordenar colunas de forma ascendente",
      "sSortDescending": ": Ordenar colunas de forma descendente"
    },
    "select": {
      "rows": {
        "_": "Selecionado %d linhas",
        "0": "Nenhuma linha selecionada",
        "1": "Selecionado 1 linha"
      }
    },
    "buttons": {
      "copy": "Copiar para a área de transferência",
      "copyTitle": "Cópia bem sucedida",
      "copySuccess": {
        "1": "Uma linha copiada com sucesso",
        "_": "%d linhas copiadas com sucesso"
      }
    }
  };

  constructor(private router: Router, public pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.consultado = false;
    this.dtOptions.language = this.language;
    this.dtOptions.paging = false;
    this.ckecked = true;
    this.pedidoService.getProduto().subscribe(api => {
      this.produtos = api.objects.filter((i) => {
        i.checked = false;
        return i.ativo;
      });
      console.log(this.produtos);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public setChecked(): void {
    this.list.forEach((x) => {
      x.checked = this.ckecked;
    });
  }

  private genRow(item: ItemListaPedido) {
    const row = [];
    const itensPedido: any = item.detalhe.itens;
    row.push("");
    row.push(item.numero);
    row.push(" ");
    row.push(itensPedido.map(x => x.sku + "(" + parseInt(x.quantidade) + ")").join(", "));
    row.push("Destinatário: ");
    row.push(item.detalhe.cliente.nome);
    row.push(item.detalhe.endereco_entrega.endereco);
    row.push(", ");
    row.push(item.detalhe.endereco_entrega.numero);
    row.push(item.detalhe.endereco_entrega.complemento);
    row.push(" - ");
    row.push(item.detalhe.endereco_entrega.bairro);
    row.push(item.detalhe.endereco_entrega.cidade);
    row.push(", ");
    row.push(item.detalhe.endereco_entrega.estado);
    row.push("CEP:");
    row.push(item.detalhe.endereco_entrega.cep.replace(/^([\d]{2})\.*([\d]{3})-*([\d]{3})/gim, "$1$2-$3"));
    row.push("Referência: ");
    row.push(item.detalhe.endereco_entrega.referencia);
    row.push(item.detalhe.envios[0].forma_envio.nome);
    row.push(item.detalhe.cliente.email);
    return row.join(";");
  }

  public downloadFile(): void {
    const header = ["PRÉ-PEDIDO", "PEDIDO", "ESPAÇO", "CÓDIGO", "PRÉ-DESTINATÁRIO", "DESTINATARIO",
      "RUA", "VÍRGULA", "NÚMERO", "COMPLEMENTO", "TRAÇO", "BAIRRO",
      "CIDADE", "VÍRGULA", "ESTADO", "PRÉ-CEP", "CEP", "PRÉ-REFERÊNCIA", "REFERÊNCIA",
      "MODO DE ENVIO", "E-MAIL"];
    const data: Array<ItemListaPedido> = this.list.filter(i => i.checked);
    const csv = [];
    csv.push(header.join(';'));
    data.forEach(x => csv.push(this.genRow(x)));
    const csvArray: string = csv.join('\r\n');

    const blob: Blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, "Pedidos_" + this.pesquisa.since_atualizado.substr(0, 10) + ".csv");
  }

  public filtroPorProduto(): void {
    const produtos: any = this.produtos.filter(p => p.checked);
    if (produtos.length === 0) {
      this.list = [...this.listRef];
    } else {
      this.list = this.listRef.filter(function (pedido) {
        const a = pedido.detalhe.itens.map(x => x.sku);
        const b = produtos.map(x => x.sku);
        return a.equals(b);
      });
    }
    this.dtElement.dtInstance.then((_dtInstance: DataTables.Api) => {
      _dtInstance.destroy();
      this.dtTrigger.next();
    });
    console.log(this.list);
  }

  pesquisar(url): void {
    this.list = [];
    this.consultado = true;
    this.dtElement.dtInstance.then((_dtInstance: DataTables.Api) => {
      this.getPedidos(_dtInstance, url);
    });
  }

  getPedidos(_dtInstance: any, url: string): void {
    if (_dtInstance) {
      _dtInstance.destroy();
    }
    const p: any = {
      since_atualizado: this.pesquisa.since_atualizado instanceof Date ? this.pesquisa.since_atualizado.toISOString().substr(0, 19) : this.pesquisa.since_atualizado.length <= 16 ? this.pesquisa.since_atualizado + ":00" : this.pesquisa.since_atualizado,
      until_criado: (this.pesquisa.until_criado instanceof Date ? this.pesquisa.until_criado.toISOString().substr(0, 19) : this.pesquisa.until_criado) + "T00:00:00",
      limit: this.pesquisa.since_numero === null ? 20 : 1
    }
    if (this.pesquisa.since_numero) {
      p.since_numero = this.pesquisa.since_numero;
    } else {
      p.situacao_id = this.pesquisa.situacao_id;
    }
    this.pedidoService.getListaPedido(p, url).subscribe(api => {

      if (!Array.isArray(api.objects)) {
        const item = {
          objects: [api],
          meta: {
            limit: 1,
            next: null,
            offset: 0,
            previous: null,
            total_count: 0
          }
        }
        api = item as unknown as ListaPedido;
      }

      if (api.objects.length > 0) {

        api.objects.forEach(i => {
          i.detalhe = new DetalhePedido();
        });

        this.list = this.list.concat(api.objects);
        this.listRef = [...this.list];
        this.total = (this.total || 0) + api.meta.total_count;

        if (api.meta.next && this.list.length < 40) {
          this.getPedidos(null, api.meta.next);
        } else {
          this.meta = api.meta;
          this.meta.show = true;
          this.pedidoService.setDetalhes(this.list).then((cb) => {
            cb.subscribe((x) => {
              x.forEach((d, i) => {
                this.list[i].detalhe = d;
              }, this.list);
              this.dtTrigger.next();
              this.consultado = false;
            });
          });
        }
      } else {
        this.dtTrigger.next();
        this.meta.show = false;
        this.consultado = false;
      }
    });
  }
}