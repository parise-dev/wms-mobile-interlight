import { Component, OnInit } from '@angular/core';
import { Disponiveis, OrdersCheckout, Pack, PackItenv2 } from '../models/uas';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SapServiceService } from '../shared/services/sap-service.service';
import { NavController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface Lote {
  serie: string;
  status: 'CONFIRMADO' | 'EM CONFERENCIA';
}

export interface CheckoutItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  lotes: Lote[];
}

export interface ItensCheckout {
  order: string;
  visible: boolean;
  separador: string;
  status: string; 
  items: CheckoutItem[];
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  visibleAction: boolean = false;
  orderBip = new FormControl('');
  visibleItens: boolean = false;
  visibleTable: boolean = false;

  itensCheckout: ItensCheckout = {} as ItensCheckout;

  volumeBip: string = '';

  ordersCheckout: OrdersCheckout = {} as OrdersCheckout;

  newPackings: Disponiveis[] = [];
  disponiveis: Disponiveis[] = [];
  addNEwPacking: Pack = {} as Pack;
  pack: Pack[] = [];

  isToastOpen: boolean = false;
  addNewPackItemTotal: PackItenv2[] = [];
  messageToast: string = '';

  constructor(
    private router: Router,
    private service: SapServiceService,
    private navCtrl: NavController,
  ) {}

  ngOnInit() {
    this.service.getAllVolumesWithCheckout().subscribe((data) => {
      this.pack = data;
    });

    this.orderBip.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
      )
      .subscribe((texto) => {
        this.buscar((texto ?? '').trim());
      });
  }
  getStatusLabel(status?: string): string {
    const s = (status || '').toUpperCase().trim();

    if (s === 'EM CONFERENCIA') return 'Em conferência';
    if (s === 'FINALIZADO') return 'Finalizado';
    if (s === 'CONFIRMADO') return 'Confirmado';
    return s ? s.toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase()) : 'Sem status';
  }
  getStatusBadgeClass(status?: string): string {
    const s = (status || '').toUpperCase().trim();
    if (s === 'FINALIZADO') return 'text-bg-success';
    if (s === 'EM CONFERENCIA') return 'warning text-white';
    if (s === 'CONFIRMADO') return 'text-bg-primary';

    return 'text-bg-secondary';
  }
  getStatusIcon(status?: string): string {
    const s = (status || '').toUpperCase().trim();

    if (s === 'FINALIZADO') return 'bi-check2-circle';
    if (s === 'EM CONFERENCIA') return 'bi-hourglass-split';
    if (s === 'CONFIRMADO') return 'bi-shield-check';

    return 'bi-info-circle';
  }
  temLoteEmConferencia(itens: ItensCheckout): boolean {
    return (
      itens?.visible === true &&
      !!itens?.items?.some((item) =>
        item?.lotes?.some((lote) => (lote?.status || '').toUpperCase() === 'EM CONFERENCIA'),
      )
    );
  }

  exibirTable: boolean = false

  buscar(texto: string) {
    if (texto.length === 5) {
      this.messageToast = 'Código encontrado';
      this.isToastOpen = true;
      this.itensCheckout = {
        order: 'XPTO',
        visible: true,
        separador: 'HELDER',
        status: 'EM CONFERENCIA',
        items: [
          {
            itemCode: '123',
            itemName: 'XPTO TESTE',
            quantity: 2,
            lotes: [
              { serie: 'XPTOSERIE', status: 'EM CONFERENCIA' },
              { serie: 'XPTOSERIE2', status: 'CONFIRMADO' },
            ],
          },
          {
            itemCode: '321',
            itemName: 'TOMATE',
            quantity: 3,
            lotes: [
              { serie: 'TOMATE1', status: 'CONFIRMADO' },
              { serie: 'TOMATE2', status: 'CONFIRMADO' },
              { serie: 'TOMATE3', status: 'CONFIRMADO' },
            ],
          },
        ],
      };
      const exibirTable = this.temLoteEmConferencia(this.itensCheckout);

      if (exibirTable) {
      
        this.exibirTable = true
      } else {
        this.exibirTable = false
      }
    } else {
      this.messageToast = 'Código não encontrado';
      this.isToastOpen = true;
    }
  }

  clear() {
    this.volumeBip = '';
    this.orderBip.setValue('');
    this.exibirTable = false
  }

  confirmeOk() {
    if (this.volumeBip != '' && this.volumeBip != null && this.volumeBip != undefined) {
      const bip = this.volumeBip.trim().toString();

      const achadosPorVol = this.pack.filter(
        (p) => '#VOL' + p.id.toString().padStart(6, '0') == bip,
      );

      if (achadosPorVol.length > 0) {
        this.pack = achadosPorVol;
        return;
      }

      const achadosPorPedido = this.pack.filter((p) => p.docnumber.toString() === bip);

      if (achadosPorPedido.length > 0) {
        this.pack = achadosPorPedido;
        return;
      }

      this.service.getAllVolumesWithCheckout().subscribe((data) => {
        this.pack = data;
      });
      return;
    }

    this.service.getAllVolumesWithCheckout().subscribe((data) => {
      this.pack = data;
    });
  }

  onKeydown(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key === 'Enter') {
      this.pack = this.pack.filter(
        (p) => '#VOL' + p.id.toString().padStart(6, '0') == input.value.trim().toString(),
      );
    }
  }

  setOpen(bool: any) {
    this.isToastOpen = bool;
  }

  backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

  openCheckout(orderNumber: any) {
    this.navCtrl.navigateForward(`/checkout/details/${orderNumber}`, {
      replaceUrl: true,
    });
  }

  finishCheckout() {}

  formatVol(id: number) {
    return '#VOL' + id.toString().padStart(6, '0');
  }

  removeItem(indice: any) {
    if (indice >= 0 && indice < this.newPackings.length) {
      const removedItem = { ...this.newPackings[indice] };
      this.newPackings.splice(indice, 1);
      removedItem.disponivel = removedItem.inicial;
      this.disponiveis.push(removedItem);
    }
  }

  checkList(disponiveis: Disponiveis[]) {
    return !disponiveis.some((disp) => disp.disponivel > 0);
  }

  adicionarAoVolume(index: any) {
    if (this.disponiveis[index].pecas == undefined || this.disponiveis[index].pecas == 0) {
      this.messageToast = 'Informe a quantidade de Peças';
      this.setOpen(true);
      return;
    }

    if (this.disponiveis[index].weight == undefined || this.disponiveis[index].weight == 0) {
      this.messageToast = 'Informe o peso para adicionar ao volume';
      this.setOpen(true);
      return;
    }

    if (this.disponiveis[index].pecas > this.disponiveis[index].disponivel) {
      this.messageToast = 'Quantidade de Peças supera a disponível para o lote';
      this.setOpen(true);
      return;
    }

    const itensNovos = this.disponiveis[index];
    this.newPackings.push(itensNovos);

    this.disponiveis[index].disponivel =
      this.disponiveis[index].disponivel - this.disponiveis[index].pecas;
  }

  addPacking() {
    this.addNewPackItemTotal = [];

    this.addNEwPacking.createDate = moment().format('YYYY-MM-DD');
    this.addNEwPacking.id = 0;
    this.addNEwPacking.itens = 0;
    this.addNEwPacking.packItens = [];
    this.addNEwPacking.status = 'EM PREPARAÇÃO';

    this.addNEwPacking.userId = JSON.parse(localStorage.getItem('authorize') ?? '').userid;
    this.addNEwPacking.username = JSON.parse(localStorage.getItem('authorize') ?? '').slpName;

    this.newPackings.forEach((n) => {
      const addNewPackItem: PackItenv2 = {
        id: 0,
        idPack: 0,
        lineNum: n.pickEntry,
        itemCode: n.itemCode,
        description: n.dscription,
        batch: n.batch,
        quantity: n.quantity,
        docNumber: n.docNumber,
        docType: n.objType,
        obs: '',
        pack: n.pecas,
        absEntry: Number(localStorage.getItem('absEntry') ?? 0),
      };

      this.addNewPackItemTotal.push(addNewPackItem);
    });

    this.addNEwPacking.packItens = this.addNewPackItemTotal;

    this.service.createPackList(this.addNEwPacking).subscribe(() => {
      this.messageToast = 'Criado com Sucesso!';
      this.setOpen(true);
    });
  }

  reload() {
    this.service.getAllVolumesWithCheckout().subscribe((data) => {
      this.pack = data;
    });
  }

  hasLoteEmConferencia(item: CheckoutItem): boolean {
  return item?.lotes?.some(
    (l) => (l.status || '').toUpperCase().trim() === 'EM CONFERENCIA'
  );
}
}