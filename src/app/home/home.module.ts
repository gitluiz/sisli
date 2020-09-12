import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from "./HomeComponent";
import { SharedModule } from '../shared/shared.module';
import {DataTablesModule} from 'angular-datatables';
import { CreditCardMaskPipe } from  './CreditCardMaskPipe';

@NgModule({
  declarations: [HomeComponent, CreditCardMaskPipe],
  imports: [CommonModule, SharedModule, HomeRoutingModule, DataTablesModule]
})
export class HomeModule {}
