import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../shared/service/PedidoService'
import { ListaPedido } from '../shared/model/ListaPedido';
import { ItemListaPedido } from '../shared/model/ItemListaPedido';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

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

  public api: ListaPedido;
  public list: ItemListaPedido[] = [];
  public pesquisa: any = {
    since_atualizado: new Date(),
    situacao_id: 1
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
    this.dtOptions.processing = true
    this.dtOptions.language = this.language;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private genRow(item: ItemListaPedido) {
    const row = [];
    const itensPedido:any = item.detalhe.itens;
    row.push(item.numero);
    row.push(itensPedido.map(x => x.sku).join(", "));
    row.push("Destinatário:");
    row.push(item.detalhe.cliente.nome);
    row.push(" ");
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
    row.push(item.detalhe.endereco_entrega.cep);
    row.push("Referência:");
    row.push(item.detalhe.endereco_entrega.referencia);
    row.push(item.detalhe.envios[0].forma_envio.nome);
    return row.join(";");
  }

  public downloadFile(): void {
    const header = ["NÚMERO DA VENDA", "CÓDIGO DOS PRODUTOS", "PRÉ-DESTINATÁRIO", "DESTINATÁRIO", "ESPAÇO", "RUA", "VÍRGULA", "NÚMERO", "COMPLEMENTO", "TRAÇO PRETO", "BAIRRO", "CIDADE", "VÍRGULA", "ESTADO", "PRÉ-CEP", "CEP", "PRÉ: REFERÊNCIA", "REFERÊNCIA", "MODO DE ENVIO"];
    const data: Array<ItemListaPedido> = this.list.filter(i => i.checked);
    const csv = [];
    csv.push(header.join(';'));
    data.forEach(x => csv.push(this.genRow(x)));
    const csvArray: string = csv.join('\r\n');

    const blob: Blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, "etiquetas.csv");
  }

  pesquisar(): void {
    this.dtElement.dtInstance.then((_dtInstance: DataTables.Api) => {
      _dtInstance.destroy();
      this.getPedidos();
    });
  }

  getPedidos(): void {
    this.pesquisa.since_atualizado = this.pesquisa.since_atualizado instanceof Date ? this.pesquisa.since_atualizado.toISOString() : this.pesquisa.since_atualizado;
    this.pedidoService.getListaPedido(this.pesquisa).subscribe(api => {
      this.api = api;
      this.list = api.response;
      this.pedidoService.setDetalhes(this.list);
      this.dtTrigger.next();
    });
  }
}