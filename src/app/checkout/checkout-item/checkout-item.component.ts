import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Disponiveis, Pack, PackFinsh, PackItenv2 } from 'src/app/models/uas';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss'],
})
export class CheckoutItemComponent implements OnInit {

  newPackings: Disponiveis[] = [];
  disponiveis: Disponiveis[] = [];
  saveObs: string = '';
  reprovedMotived: string = '';
  reprovedDestiny: string = '';
  addressDestiny: string = '';
  listaImagens: any[] = [];
  visibleAddress: boolean = false;

  obsConferente: string = '';


  addNEwPacking: Pack = {} as Pack;
  packing: PackItenv2 = {} as PackItenv2;

  isToastOpen: boolean = false;
  addNewPackItemTotal: PackItenv2[] = []
  messageToast: string = '';
  id: string = '';
  itens: PackItenv2[] = [];
  obj: PackFinsh[] = []

  constructor(private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private router: Router, private service: SapServiceService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.service.getPackItens(this.route.snapshot.params['id']).subscribe((data) => {
      this.itens = data

      if (data.length > 0) {
        this.obsConferente = this.itens?.[0]?.obsconferente ?? ''
      }
    })
  }

  removeItem(indice: any) {
    this.id = this.route.snapshot.params['id'];

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

  saveObsCheckout() {

    var obj = {
      idPack: this.itens[0].idPack,
      comments: this.obsConferente
    }

    this.service.saveObsConference(obj).subscribe(() => {
      this.toast.success('Atualizado com sucesso')
    })
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

  async addPacking() {

    if (this.addNEwPacking == null || this.addNEwPacking == undefined) {
      this.messageToast = 'Informe a localização para seguir a criação do volume'
      this.setOpen(true)
      return
    }

    const loading = await this.loadingCtrl.create({
      message: 'Criando volume',
      spinner: 'circles'
    });

    await loading.present();

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
      loading.dismiss();
    }, (e) => {
      loading.dismiss();
    })
  }


  setOpen(bool: any) {
    this.isToastOpen = bool
  }

  saveReproved() {

    var reverse: any[] = []

    
    if(this.itens.filter(s => s.selected).length === 0){
      this.modalService.dismissAll()
      this.toast.error('Selecione o(s) item(ns) que estão com o motivo informado.')
      return ;
    }
    this.itens.forEach(s => {

      if (s.selected) {

        var obj = {
          id: this.id,
          pick: s.absEntry,
          lineNum: s.lineNum,
          reason: this.reprovedMotived,
          obs: ''
        }
        reverse.push(obj)
      }
    })

    console.log('reverse', reverse)

    this.service.postReversaNew(reverse).subscribe(() => {
      this.modalService.dismissAll()
      this.isToastOpen = true;
      this.messageToast = 'Reversa aberta com sucesso'

      this.backHome()
    })
  }

  setDestiny() {
    if (this.reprovedDestiny == 'Estoque (Gaveta)') {
      this.visibleAddress = true
    }
    else {
      this.visibleAddress = false
    }
  }

  openModal(docNum: any, itemCode: string, content: any) {
    this.spinner.show()
    this.service.getImages(docNum, itemCode).subscribe((data) => {
      this.listaImagens = data
      this.spinner.hide()
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
        .result.then((result) => {
          console.log(result);
        }, (reason) => {
          console.log('Err!', reason);
        });
    })


  }
  openReproved(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }


  openModalDefault(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }


  backHome() {
    this.navCtrl.navigateForward('/checkout', { replaceUrl: true });
  }


  openCheckout(orderNumber: any) {
    this.navCtrl.navigateForward(`/checkout/details/${orderNumber}`, { replaceUrl: true });
  }

  finishCheckout() {

  }

  async conferir() {

    this.spinner.show()

    this.obj = []
    this.itens.forEach(it => {

      var ob: PackFinsh = {
        absEntry: it.absEntry,
        idPack: it.idPack,
        lineNum: it.lineNum,
        idPackLine: it.id,
        pck: it.qty ?? 0,
        userId: Number(JSON.parse(localStorage.getItem('authorize') ?? '').userid)
      }

      console.log('obj 1', ob)
      this.obj.push(ob)

    });

    this.service.finishCheckout(this.obj).subscribe((data) => {
      this.messageToast = 'Conferência finalizada'
      this.setOpen(true)
      this.spinner.hide()
      this.navCtrl.navigateForward('/checkout', { replaceUrl: true });

    }, (e) => {
      this.messageToast = `${e.error}`
      this.spinner.hide()
      this.setOpen(true)
    })
  }

  getImages() {
    console.log('teste')


  }


}
