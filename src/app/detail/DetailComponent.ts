import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ItemListaPedido } from '../shared/model/ItemListaPedido';
import { PedidoService } from '../shared/service/PedidoService';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements AfterViewInit, OnDestroy, OnInit {


  @ViewChild(DataTableDirective, { static: false })

  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger = new Subject();
  public consultado: boolean;
  public ckecked: boolean;
  public list: ItemListaPedido[] = [];
  public produtos: any[] = [];

  public meta: any = {
    total_count: 0,
    previous: null,
    next: null,
    show: false
  };

  public hoje(): string {
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
  };

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
    this.pedidoService.getProduto().subscribe(api => {
      this.produtos = api.data;
      console.log(this.produtos);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private genRow(item: ItemListaPedido) {
    const row = [];
    const itensPedido: any = item.detalhe.itens;
    row.push("");
    row.push(item.numero);
    row.push(" ");
    row.push(itensPedido.map(x => x.sku + (parseInt(x.quantidade) > 1 ? "(" + parseInt(x.quantidade) + ")" : "")).join(", "));
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
    row.push("CEP: ");
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

    const blob: Blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, "Pedidos_" + this.pesquisa.since_atualizado.substr(0, 10) + ".csv");
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
    };

    this.pedidoService.getListaPedido(p, url).subscribe(api => {
      if (api.objects.length > 0) {

        this.list = this.list.concat(api.objects);

        if (api.meta.next && this.list.length < 41) {
          this.getPedidos(null, api.meta.next);
        } else {
          this.meta = api.meta;
          this.meta.show = true;
        }
        
      } else {
        this.dtTrigger.next();
        this.meta.show = false;
        this.consultado = false;
      }
    });
  }

}
