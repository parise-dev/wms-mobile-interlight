import { CutsBase, Pack, PackItenv2 } from './../models/uas';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VolumesReformulated, VolViewer } from '../models/sales-orders-list';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { SapServiceService } from '../shared/services/sap-service.service';

@Component({
  selector: 'app-cuts',
  templateUrl: './cuts.page.html',
  styleUrls: ['./cuts.page.scss'],
})
export class CutsPage implements OnInit {

  cuts: string[] = [];
  qtdeNewPC: any = null;
  qtdeNewVolume: any = null;
  qtdeNewWeight: any = null;
  addNEwPacking: Pack = {} as Pack;
  newsPacks: Pack[] = [];
  qtdeNewVolumeDisable: boolean = false;
  qtdeNewVolumeConfirmed: boolean = false;
  volumes: VolumesReformulated[] = [];
  newPackingItem: PackItenv2 = {} as PackItenv2;
  addNewPackItemTotal: PackItenv2[] = [];
  cutsBase: CutsBase[] = [];
  indexCut: number = 0;
  obsNew: string = '';

  finished: boolean = false;
  //volume: VolumesReformulated = {} as VolumesReformulated;

  constructor(private navCtrl: NavController,
    private modalService: NgbModal,
    private toast: ToastrService,
    private service: SapServiceService
  ) { }

  ngOnInit() {
    this.service.getCutsBase().subscribe((data) => {
      this.cutsBase = data
    })
  }


  getOrder(docNum: number){
    this.navCtrl.navigateForward(`/cuts/cut-item/${docNum}`, { replaceUrl: true });
  }


  backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

  confirmCriacao() {

    var error = []

    this.newsPacks.forEach(it => {
      this.service.createPackList(this.addNEwPacking).subscribe(
        () => {


        }, () => {
          error.push(1)
        })
    })

    if (error.length == 0) {
      this.toast.success('Volumes criado com sucesso.')
    }


    this.service.updatePecasCutsBase(this.cutsBase[this.indexCut].id,
      this.qtdeNewVolume,
      this.cutsBase[this.indexCut].package,
     this.cutsBase[this.indexCut].docEntry,
      this.cutsBase[this.indexCut].orderLine
    ).subscribe(() => {
        console.log('atualizado com sucesso')
      })

    this.modalService.dismissAll();
    this.service.getCutsBase().subscribe((data) => {
      this.cutsBase = data
    })
  }
  createVolume() {

    if (this.addNEwPacking.package_Name == null || this.addNEwPacking.package_Name == undefined) {
      this.toast.error('Informe o tipo de embalagem para seguir')
      return
    }

    if (this.addNEwPacking.destiny == null || this.addNEwPacking.destiny == undefined) {
      this.toast.error('Informe a localização para seguir a criação do volume')
      return
    }

    let volume: VolumesReformulated = {} as VolumesReformulated;

    let total = this.volumes.reduce((soma, vol) => soma + vol?.qtdePecas, 0);

    if (this.qtdeNewPC === 0) {
      this.toast.error('Não é possivel criar volume com quantidade zerada.')
      return;
    }


    if ((total + this.qtdeNewPC) > this.qtdeNewVolume) {
      this.toast.error('Quantidade de Peças supera as disponíveis.')
      return;
    }

    volume.nameVolume = `NOVO VOLUME ${this.volumes.length + 1}`
    volume.qtdePecas = this.qtdeNewPC

    this.volumes.push(volume)

    if ((total + this.qtdeNewPC) == this.qtdeNewVolume) {
      this.finished = true;
    }

    this.addNEwPacking.createDate = moment().format('YYYY-MM-DD')
    this.addNEwPacking.id = 0,
      this.addNEwPacking.itens = 0,
      this.addNEwPacking.packItens = [],
      this.addNEwPacking.status = 'EM PREPARAÇÃO'
    this.addNEwPacking.weight = this.qtdeNewWeight
    this.addNEwPacking.userId = JSON.parse(localStorage.getItem('authorize') ?? '').userid
    this.addNEwPacking.username = JSON.parse(localStorage.getItem('authorize') ?? '').slpName

    var addNewPackItem: PackItenv2 =
    {
      id: 0,
      idPack: 0,
      lineNum: this.cutsBase[this.indexCut].lineNum,
      itemCode: this.cutsBase[this.indexCut].itemCode,
      description: this.cutsBase[this.indexCut].description,
      batch: this.cutsBase[this.indexCut].batch,
      quantity: 0,
      docNumber: this.cutsBase[this.indexCut].docNum,
      docType: '17',
      obs: this.obsNew,
      pack: this.qtdeNewPC,
      absEntry: this.cutsBase[this.indexCut].pickList
    }

    this.addNewPackItemTotal.push(addNewPackItem)

    this.addNEwPacking.packItens = this.addNewPackItemTotal

    this.newsPacks.push(this.addNEwPacking)



  }

  confirmedQtde() {

    if (this.qtdeNewVolume == 0 || this.qtdeNewVolume == null || this.qtdeNewVolume == undefined) {
      this.toast.error('Por favor informar a quantidade de peças')
    }

    this.qtdeNewVolumeDisable = true;
    this.qtdeNewVolumeConfirmed = true;

    this.qtdeNewPC = null;
    this.qtdeNewWeight = null;
    this.addNEwPacking.package_Name = '';
    this.addNEwPacking.destiny = '';
    /* var obj = {
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
    }*/

  }

  addTable() {

  }

  cancelConfirmed() {
    this.qtdeNewVolumeDisable = false;
    this.qtdeNewVolumeConfirmed = false;
    this.qtdeNewVolume = null
  }

  openModal(content: any, index: number) {

    this.indexCut = index;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }
}
