import * as core from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { ListaPedido } from '../model/ListaPedido';
import { DetalhePedido } from '../model/DetalhePedido';
import { ItemListaPedido } from '../model/ItemListaPedido';

@core.Injectable({
  providedIn: 'root'
})
export class PedidoService {

  servico;
  apiuri = "https://api.awsli.com.br";

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
  public getProduto(): Observable<any> {
    const myUrl = this.apiProduto;
    return this.httpClient.get<any>(myUrl);
  }

  public getDetalhes(resource_uri: string): Observable<DetalhePedido> {
    const myUrl = this.apiuri + resource_uri + this.defaultFlag;
    return this.httpClient.get<DetalhePedido>(myUrl);
  }

  public getListaPedido(pesquisa: any, url: string): Observable<ListaPedido> {
    const myUrl = this.apiuri + (url || ((pesquisa.since_numero ? "/v1/pedido_envio/" + pesquisa.since_numero : "/v1/pedido/search/") + this.defaultFlag + this.defaultFlagCreate(pesquisa)));
    return this.httpClient.get<ListaPedido>(myUrl);
  }

  public getPedidoPorRastreamento(params: string): Promise<any> {
    const myUrl = this.apiuri + "/v1/pedido_envio/";
    const list = params.split(/(,|, )/gim);
    if (list) {
      return Promise.resolve(forkJoin(list.map((i) => {
        const url = myUrl.concat(i).concat(this.defaultFlag);
        return this.httpClient.get<any>(url);
      })));
    } else {
      return Promise.resolve(null);
    }
  }
}