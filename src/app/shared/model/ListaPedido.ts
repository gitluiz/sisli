import { MetaListaPedido } from './MetaListaPedido';
import { ItemListaPedido } from './ItemListaPedido';
import { Notifications } from './Notification';

export class ListaPedido {
  "meta": MetaListaPedido;
  "objects": Array<ItemListaPedido>;
  "notification": Notifications;
}