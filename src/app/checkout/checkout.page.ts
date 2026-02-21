import { Component, OnInit } from '@angular/core';
import { Disponiveis, OrdersCheckout, Pack, PackItenv2 } from '../models/uas';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SapServiceService } from '../shared/services/sap-service.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  constructor(
    private router: Router,
    private service: SapServiceService,
    private navCtrl: NavController
  ) { }

  volumeBip: string = '';

  ordersCheckout: OrdersCheckout = {} as OrdersCheckout;

  newPackings: Disponiveis[] = [];
  disponiveis: Disponiveis[] = [];
  addNEwPacking: Pack = {} as Pack;
  pack: Pack[] = [];

  isToastOpen: boolean = false;
  addNewPackItemTotal: PackItenv2[] = []
  messageToast: string = '';


  ngOnInit() {

    this.service.getAllVolumesWithCheckout().subscribe((data) => {
      this.pack = data
    })

  }

  clear(){
    this.volumeBip = ''
      this.service.getAllVolumesWithCheckout().subscribe((data) => {
        this.pack = data
    })
  }

  confirmeOk() {
    
    if (this.volumeBip != '' && this.volumeBip != null && this.volumeBip != undefined)
    {
        console.log('achados', this.pack.filter(p => ('#VOL' + p.id.toString().padStart(6, '0')) == this.volumeBip.trim().toString()).length)

        
        if(this.pack.filter(p => ('#VOL' + p.id.toString().padStart(6, '0')) == this.volumeBip.trim().toString()).length > 0)
        {
            this.pack = this.pack.filter(p => ('#VOL' + p.id.toString().padStart(6, '0')) == this.volumeBip.trim().toString())
            return;
        }
       
        console.log('pedidos achados', this.pack = this.pack.filter(p=> p.docnumber.toString() === this.volumeBip.trim()))

        if(this.pack.filter(p=> p.docnumber.toString() === this.volumeBip.trim()).length > 0 )
        {
              this.pack = this.pack.filter(p=> p.docnumber.toString() === this.volumeBip.trim())
              return;
        }
        
        this.service.getAllVolumesWithCheckout().subscribe((data) => { this.pack = data })
    }

    this.service.getAllVolumesWithCheckout().subscribe((data) => {
        this.pack = data
    })

  }

  onKeydown(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key === 'Enter') {

      this.pack = this.pack.filter(p => ('#VOL' + p.id.toString().padStart(6, '0')) == input.value.trim().toString())

      //'#VOL'+ id.toString().padStart(6, '0')
      //alert(`Código escaneado: ${input.value}`)
      //console.log('Código escaneado:', input.value);
      // Processar o código aqui...

      //input.value = ''; // Limpa o input após a leitura
    }
  }

  setOpen(bool: any) {
    this.isToastOpen = bool
  }

  backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

  openCheckout(orderNumber: any) {
    this.navCtrl.navigateForward(`/checkout/details/${orderNumber}`, { replaceUrl: true });
  }

  finishCheckout() {

  }

  formatVol(id: number) {
    return '#VOL' + id.toString().padStart(6, '0')
  }

  removeItem(indice: any) {
    if (indice >= 0 && indice < this.newPackings.length) {
      const removedItem = { ...this.newPackings[indice] };

      this.newPackings.splice(indice, 1);

      removedItem.disponivel = removedItem.inicial

      console.log('item removiodo', removedItem)
      this.disponiveis.push(removedItem);
    }
  }

  checkList(disponiveis: Disponiveis[]) {
    return !disponiveis.some(disp => disp.disponivel > 0);
  }

  adicionarAoVolume(index: any) {

    console.log('disponivel', this.disponiveis[index].disponivel)
    console.log('pecas', this.disponiveis[index].pecas)
    console.log('weight', this.disponiveis[index].weight)

    if (this.disponiveis[index].pecas == undefined || this.disponiveis[index].pecas == 0) {
      this.messageToast = 'Informe a quantidade de Peças'
      this.setOpen(true)
      return
    }

    if (this.disponiveis[index].weight == undefined || this.disponiveis[index].weight == 0) {
      this.messageToast = 'Informe o peso para adicionar ao volume'
      this.setOpen(true)
      return
    }

    if (this.disponiveis[index].pecas > this.disponiveis[index].disponivel) {
      this.messageToast = 'Quantidade de Peças supera a disponível para o lote'
      this.setOpen(true)
      return
    }

    console.log('new pack antes da adição', this.newPackings)
    console.log('disponiveis antes da adição', this.disponiveis)

    const itensNovos = this.disponiveis[index]

    this.newPackings.push(itensNovos)

    this.disponiveis[index].disponivel = (this.disponiveis[index].disponivel - this.disponiveis[index].pecas)

    console.log('new pack após  adição', this.disponiveis)

  }

  addPacking() {

    this.addNewPackItemTotal = []

    this.addNEwPacking.createDate = moment().format('YYYY-MM-DD')
    this.addNEwPacking.id = 0,
      this.addNEwPacking.itens = 0,
      this.addNEwPacking.packItens = [],
      this.addNEwPacking.status = 'EM PREPARAÇÃO'
    this.addNEwPacking.userId = JSON.parse(localStorage.getItem('authorize') ?? '').userid
    this.addNEwPacking.username = JSON.parse(localStorage.getItem('authorize') ?? '').slpName

    this.newPackings.forEach(n => {

      var addNewPackItem: PackItenv2 =
      {
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
        absEntry: Number(localStorage.getItem('absEntry') ?? 0)
      }

      this.addNewPackItemTotal.push(addNewPackItem)
    })

    this.addNEwPacking.packItens = this.addNewPackItemTotal

    console.log('pack', this.addNEwPacking, this.newPackings)
    this.service.createPackList(this.addNEwPacking).subscribe(() => {
      this.messageToast = 'Criado com Sucesso!'
      this.setOpen(true)
    })
  }

  reload() {
    this.service.getAllVolumesWithCheckout().subscribe((data) => {
      this.pack = data
    })
  }

}
