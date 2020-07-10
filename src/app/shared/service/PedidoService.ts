import * as core from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { ListaPedido } from '../model/ListaPedido';
import { DetalhePedido } from '../model/DetalhePedido';
import { ItemListaPedido } from '../model/ItemListaPedido';

@core.Injectable({
  providedIn: 'root'
})
export class PedidoService {

  servico;
  apiuri = "https://api.awsli.com.br";
  defaultFlag = '?chave_api=x&chave_aplicacao=x&situacao_id=4&limit=20';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) {
    this.servico = this;
  }

  private defaultFlagCreate(obj: any): string {
    if (obj === null) {
      return "";
    }
    let flag = "&";
    for (const prop in obj) {
      flag = `${flag + prop}=${obj[prop]}&`;
    }
    return flag.substring(0, (flag.length - 1));
  }

  setDetalhes(list: Array<ItemListaPedido>): Promise<any> {
    if (list) {
      list.forEach((x) => {
        x.checked = true;
      });
      return Promise.resolve(forkJoin(list.map(x => this.getDetalhes(x.resource_uri))));
      // return Promise.all(list.map((x) => {
      //   this.getDetalhes(x.resource_uri).subscribe(d => {
      //     x.detalhe = d;
      //   });
      // }));
    } else {
      return Promise.resolve(null);
    }
  }

  public getDetalhes(resource_uri: string): Observable<DetalhePedido> {
    const myUrl = this.apiuri + resource_uri + this.defaultFlag;
    return this.httpClient.get<DetalhePedido>(myUrl);
  }

  public getListaPedido(pesquisa: any, url: string): Observable<ListaPedido> {
    const myUrl = this.apiuri + (url || ("/v1/pedido/search/" + this.defaultFlag + this.defaultFlagCreate(pesquisa)));
    return this.httpClient.get<ListaPedido>(myUrl);
  }

}
