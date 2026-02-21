import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular/common';
import * as moment from 'moment';
import { SapServiceService } from '../shared/services/sap-service.service';
import { DashBoardMobile } from '../models/sales-orders-list';
import { AwsService } from '../shared/services/aws.service';

export interface DashboardStatus {
  status: string
  qtde: number
}

type CardTone = 'default' | 'highlight' | 'danger';

interface CardVM {
  key: keyof DashBoardMobile;
  title: string;
  value: number;
  description: number;
  valueType: 'money' | 'number' | 'kg' | 'ratio';
  tone: CardTone;
  pill?: string;
  descriptionLabel?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {

  cards: CardVM[] = [];

  userName: string = '';
  userId: string = ''
  hoje = moment().format('DD/MM/YYYY');

  viagems: DashboardStatus[] = []

  constructor(  private navCtrl: NavController, private service: SapServiceService, private dashboardService: AwsService) { }
loading = false;
  ngOnInit() {

     this.reload();
   // this.userName = JSON.parse(localStorage.getItem('authorize') ?? '').slpName
   // this.userId = (JSON.parse(localStorage.getItem('authorize') ?? '').userid).toString();

 //   this.service.getDashboardPicking(JSON.parse(localStorage.getItem('authorize') ?? '').userid).subscribe((data)=>{
  //    this.viagems = data
  //  })
  }

  backHome(){}

   backToDocument() {
    this.navCtrl.navigateForward(``, { replaceUrl: true });
  }

  reload(): void {
    this.loading = true;

    this.dashboardService.getDashboard().subscribe({
     next: (res) => {
        this.cards = this.mapToCards(res);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

   private mapToCards(res: DashBoardMobile): CardVM[] {
    return [
      {
        key: 'onePercent',
        title: 'Faturamento (Adicional de 2%) • Hoje',
        value: res.onePercent?.value ?? 0,
        description: res.onePercent?.description ?? 0,
        valueType: 'money',
        tone: 'highlight',
        pill: 'Hoje',
        descriptionLabel: 'Acumulado no mês',
      },
      {
        key: 'markupDay',
        title: 'Markup • Dia',
        value: res.markupDay?.value ?? 0,
        description: res.markupDay?.description ?? 0,
        valueType: 'ratio',
        tone: 'default',
        descriptionLabel: 'Markup mês',
      },
      {
        key: 'ordersDayMoney',
        title: 'Pedidos Emitidos no Dia (R$)',
        value: res.ordersDayMoney?.value ?? 0,
        description: res.ordersDayMoney?.description ?? 0,
        valueType: 'money',
        tone: 'default',
        descriptionLabel: 'Pedidos desse mês',
      },
      {
        key: 'ordersDayKG',
        title: 'Pedidos Emitidos no Dia (KG)',
        value: res.ordersDayKG?.value ?? 0,
        description: res.ordersDayKG?.description ?? 0,
        valueType: 'kg',
        tone: 'default',
        descriptionLabel: 'Pedidos desse mês',
      },
      {
        key: 'orderCreated',
        title: 'Pedidos Emitidos',
        value: res.orderCreated?.value ?? 0,
        description: res.orderCreated?.description ?? 0,
        valueType: 'number',
        tone: 'default',
        pill: 'Hoje',
      },
      {
        key: 'sellersWithOrders',
        title: 'Vendedores sem Pedidos',
        value: res.sellersWithOrders?.value ?? 0,
        description: res.sellersWithOrders?.description ?? 0,
        valueType: 'number',
        tone: 'default',
      },
      /*{
        key: 'conversation',
        title: 'Conversão',
        value: res.conversation?.value ?? 0,
        description: res.conversation?.description ?? 0,
        valueType: 'number',
        tone: (res.conversation?.value ?? 0) > 0 ? 'default' : 'danger',
        descriptionLabel: 'Sem conversão',
      },
      {
        key: 'budget',
        title: 'Orçamento',
        value: res.budget?.value ?? 0,
        description: res.budget?.description ?? 0,
        valueType: 'money',
        tone: 'default',
      },*/
    ];
  }

  formatValue(card: CardVM): string {
    const v = card.value ?? 0;

    switch (card.valueType) {
      case 'money':
        return this.toBRL(v);
      case 'kg':
        return this.toNumber(v, 2) + ' kg';
      case 'ratio':
        return this.toNumber(v, 2);
      default:
        return this.toNumber(v, 0);
    }
  }

  formatDescription(card: CardVM): string {
    const d = card.description ?? 0;

    switch (card.valueType) {
      case 'money':
        return this.toBRL(d);
      case 'kg':
        return this.toNumber(d, 2) + ' kg';
      case 'ratio':
        return this.toNumber(d, 2);
      default:
        return this.toNumber(d, 0);
    }
  }

  private toBRL(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  private toNumber(value: number, digits: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  }

}

