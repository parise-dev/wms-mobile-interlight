import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PickingList, SalesOrderDetails } from '../models/uas';
import { SapServiceService } from '../shared/services/sap-service.service';
import { Pack, VolViewer } from '../models/sales-orders-list';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingController, NavController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pick-item',
  templateUrl: './pick-item.page.html',
  styleUrls: ['./pick-item.page.scss'],
})
export class PickItemPage implements OnInit, AfterViewInit {

  slpCodeRoute: Number = 0;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private modalService: NgbModal,
    private navCtrl: NavController,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private service: SapServiceService) { }


  ngAfterViewInit() {

    this.id = this.route.snapshot.params['id'];

    this.slpCodeRoute = this.route.snapshot.params['slpCode'];

    this.service.getPickingList(this.id, this.slpCodeRoute).subscribe((data) => {
      console.log('increment', data)
      this.pickingList = data
    }
    )

    this.service.getAllVolumesByPickList(this.route.snapshot.params['id'], this.route.snapshot.params['slpCode']).subscribe((data) => {
      this.volumes = data
    })
  }


  id: string = '';
  volumes: Pack[] = [];
  ipPrinters: string = '';
  volviewer: VolViewer[] = []
  isToastOpen: boolean = false;
  messageToast: string = '';

  salesOrder: SalesOrderDetails = {
    docNum: 98765,
    cardName: 'METALURGICA VENANCIO LTDA',
    obs: 'Cliente do Ramo Alimenticio , não enviar material danificado e nem com marcas de ferrugem.',
    qtyItens: 3,
    conferred: 1,
    pending: 2,
    pack: 0,
    itens: [
      {
        itemCode: "A001",
        description: "TUBO RETANGULAR INOX 304 30 X 20 X 1,20MM DEC",
        quantity: 10,
        um: "PC",
        lineNum: 0,
        status: "conferred",
        comments: "Nenhum problema identificado.",
        address: "DG-01-02-01",
        factor: 1,
      },
      {
        itemCode: "A002",
        description: "TUBO RETANGULAR INOX 304 30 X 20 X 1,20MM DEC",
        quantity: 5,
        um: "PC",
        lineNum: 0,
        status: "pending",
        comments: "Faltam 3 unidades.",
        address: "DG-01-02-01",
        factor: 2,
      },
      {
        itemCode: "A002",
        description: "TUBO RETANGULAR INOX 304 30 X 20 X 1,20MM DEC",
        quantity: 5,
        um: "PC",
        lineNum: 0,
        status: "waiting",
        comments: "Faltam 3 unidades.",
        address: "DG-01-02-01",
        factor: 1,
      }]
  };

  pickingList: PickingList[] = [];

  ngOnInit() {

    this.spinner.show();

    this.id = this.route.snapshot.params['id'];

    this.slpCodeRoute = this.route.snapshot.params['slpCode'];

    this.service.getPickingList(this.id, this.slpCodeRoute).subscribe((data) => {
      console.log('increment', data)
      this.pickingList = data
    })

    this.service.getAllVolumesByPickList(this.route.snapshot.params['id'],this.route.snapshot.params['slpCode'])
      .subscribe((data) => {
        this.volumes = data
        this.spinner.hide();
      },()=>{
         this.spinner.hide();
      })
  }

  addUrlNewPage() {

    localStorage.setItem('absEntry', this.id)
    this.navCtrl.navigateForward('volumes/volumes-new', { replaceUrl: true });
  }

  openObsOrder(content: any, id: any, sizing: any) {
    this.spinner.show()
    this.service.getPackItensViewer(id).subscribe((data) => {
      this.volviewer = data
      this.spinner.hide()
    }, () => {
      this.spinner.hide()
    })
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', fullscreen: false })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }


  setImpressora() {
    localStorage.setItem('printers', this.ipPrinters)
    this.toast.success('Salvo Impressora.')
  }

  printer() {
    var vols = this.volumes.filter(p => p.selected == true)
    var ipPrint = localStorage.getItem('printers')

    console.log('vol', this.volumes)

    vols.forEach(v => {
      var obj = {
        idPack: v.id,
        ipPrinters: ipPrint
      }

      console.log('aqui')
      this.service.printTag(obj).subscribe(() => {
        this.toast.success(`Enviado para impressora ${ipPrint}`)
      })

    })
  }

  cancelarVolume() {
    const x = [...this.volumes.filter(s => s.selected)]
    console.log('volumes x', x)

    this.spinner.show()

    x.forEach(it => {
      this.service.cancelPack(it.id).subscribe(() => {
        console.log('Cancelado')
      })
    })

    this.service.getAllVolumesByPickList(Number(this.id), Number(this.slpCodeRoute)).subscribe((data) => {
      this.volumes = data
      this.spinner.hide()
    }, () => {
      this.spinner.hide()
      this.toast.success('Cancelado com sucesso.')
    })

  }



  async reload() {

    this.spinner.show();

    this.service.getPickingList(this.id, this.slpCodeRoute).subscribe(
    (data) => {
      console.log('increment', data)
      this.pickingList = data
    }, 
    () => {
      this.spinner.hide();
    })

    this.service.getAllVolumesByPickList(this.route.snapshot.params['id'],this.route.snapshot.params['slpCode']).subscribe((data) => {
      this.volumes = data
    }, () => {
      this.spinner.hide()
    })
    this.spinner.hide()
  }

  backPicking() {
    this.navCtrl.navigateForward('/picking', { replaceUrl: true });
  }


  formatName(i: any) {
    return '#VOL' + i.toString().padStart(6, '0')
  }

  jsonReturn(x: any) {
    console.log('json parse ', x)
  }

}
