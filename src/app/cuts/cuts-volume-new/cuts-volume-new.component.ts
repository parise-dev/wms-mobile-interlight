import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Disponiveis, Pack, PackItenv2 } from 'src/app/models/uas';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';

@Component({
  selector: 'app-cuts-volume-new',
  templateUrl: './cuts-volume-new.component.html',
  styleUrls: ['./cuts-volume-new.component.scss'],
})
export class CutsVolumeNewComponent implements OnInit {

  disponiveis: Disponiveis[] = [];
  isToastOpen: boolean = false;
  messageToast: string = '';

  newPackings: Disponiveis[] = [];

  addNewPackItem: PackItenv2 = {} as PackItenv2;

  addNewPackItemTotal: PackItenv2[] = []

  addNEwPacking: Pack = {} as Pack;

  ids: string = '';
  userid: string = '';

  constructor(private service: SapServiceService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private spinner: NgxSpinnerService,
    private router: Router) { }

  quantidade: number = 0;

  ngOnInit() {

    this.ids = localStorage.getItem('absEntryCut')?.toString() ?? ''
    this.userid = JSON.parse(localStorage.getItem('authorize') ?? '').userid

    this.service.getDisponiveisByDocnumWithPack(localStorage.getItem('absEntryCut')).subscribe((data) => {
      data.forEach(i => {
        i.inicial = i.disponivel
      })

      this.disponiveis = data
    }) //
  }

  setOpen(bool: any) {
    this.isToastOpen = bool
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
      this.disponiveis[index].weight = 1;
    }

    if (this.disponiveis[index].pecas > this.disponiveis[index].disponivel) {
      this.messageToast = 'Quantidade de Peças supera a disponível para o lote'
      this.setOpen(true)
      return
    }

    console.log('new pack antes da adição', this.newPackings)
    console.log('disponiveis antes da adição', this.disponiveis)

    const itensNovos = { ... this.disponiveis[index] }

    this.newPackings.push(itensNovos)

    this.disponiveis[index].disponivel = (this.disponiveis[index].disponivel - this.disponiveis[index].pecas)

    console.log('new pack após  adição', this.disponiveis)

  }

  selecionarItem() {

  }

  checkList(disponiveis: Disponiveis[]) {
    return !disponiveis.some(disp => disp.disponivel > 0);
  }


  removeItem(indice: any) {
    if (indice >= 0 && indice < this.newPackings.length) {
      const removedItem = { ...this.newPackings[indice] };

      this.newPackings.splice(indice, 1);

      console.log('item removiodo', removedItem)
      console.log('concluido ', this.disponiveis)

      const itemToUpdate = this.disponiveis.find(
        its => its.pickEntry === removedItem.pickEntry && its.pickList === removedItem.pickList
      );

      if (itemToUpdate) {
        itemToUpdate.disponivel += removedItem.pecas;
        itemToUpdate.pecas = 0; 
      }

     // this.disponiveis.filter(its => its.pickEntry === removedItem.pickEntry && its.pickList === its.pickList)[0].disponivel += removedItem.pecas
     // this.disponiveis.filter(its => its.pickEntry === removedItem.pickEntry && its.pickList === its.pickList)[0].pecas = 0

    }
  }

  async addPacking() {

    if (this.addNEwPacking.package_Name == null || this.addNEwPacking.package_Name == undefined) {
      this.messageToast = 'Informe o tipo de embalagem para seguir'
      this.setOpen(true)
      return
    }

    if (this.addNEwPacking.destiny == null || this.addNEwPacking.destiny == undefined) {
      this.messageToast = 'Informe a localização para seguir a criação do volume'
      this.setOpen(true)
      return
    }

    if ((this.addNEwPacking.weight == null || this.addNEwPacking.weight == undefined || this.addNEwPacking.weight == 0)
      &&
      (this.addNEwPacking.package_Name == 'ES' || this.addNEwPacking.package_Name == 'CX')) {
      this.messageToast = 'Informe o peso para seguir a criação do volume'
      this.setOpen(true)
      return
    }

    this.spinner.show();

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
        absEntry: n.pickList
      }


      this.addNewPackItemTotal.push(addNewPackItem)
    })

    this.addNEwPacking.packItens = this.addNewPackItemTotal

    console.log('pack', this.addNEwPacking, this.newPackings)

    this.service.createPackListV2(this.addNEwPacking).subscribe(
      () => {
        this.messageToast = 'Criado com Sucesso!'
        this.setOpen(true)
        this.spinner.hide()
        this.navCtrl.navigateForward(`cuts/cut-item/${this.ids}`, { replaceUrl: true });

      }, () => {
        this.spinner.hide();
      })
  }


}
