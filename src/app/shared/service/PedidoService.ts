import * as core from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListaPedido } from '../model/ListaPedido';
import { DetalhePedido } from '../model/DetalhePedido';
import { ItemListaPedido } from '../model/ItemListaPedido';

@core.Injectable({
  providedIn: 'root'
})
export class PedidoService {

  servico;
  defaultFlag = ''; //'?since_numero=345&situacao_id=1&pagamento_id=1&limit=10';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Content-Length': '0'
    })
  };

  constructor(private httpClient: HttpClient) {
    this.servico = this;
  }

  private defaultFlagCreate(obj: any): string {
    if (obj === null) {
      return null;
    }
    let flag = "?";
    for (const prop in obj) {
      flag = `${flag + prop}=${obj[prop]}&`;
    }
    return flag;
  }

  public setDetalhes(list: Array<ItemListaPedido>): void {
    list.forEach(function (i) {
      this.getDetalhes(i.id).subscribe(x => i.detalhe = x[0]);
    }, this.servico);
  }

  public getDetalhes(id: any): Observable<DetalhePedido> {
    const myUrl = `http://localhost:3000/detalhe?${id}`;
    return this.httpClient.get<DetalhePedido>(myUrl);
  }

  public getListaPedido(pesquisa: any): Observable<ListaPedido> {
    const myUrl = "http://localhost:3000/api" + (this.defaultFlagCreate(pesquisa) || this.defaultFlag);
    return this.httpClient.get<ListaPedido>(myUrl);
  }

}
