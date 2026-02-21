import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SapServiceService } from '../shared/services/sap-service.service';
import { SalesOrdersList } from '../models/sales-orders-list';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-picking',
  templateUrl: './picking.page.html',
  styleUrls: ['./picking.page.scss'],
})
export class PickingPage implements OnInit {

  constructor(private router: Router,
    private navCtrl: NavController,
    private service: SapServiceService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) { }

  salesOrdersLists: SalesOrdersList[] = [];
  finishVol: SalesOrdersList[] = [];
  rangeOrders: string = 'ATRASADOS';
  userID: string = '';
  pickingReference: string = '';


  statusList = [
    { name: 'Atrasado', count: 2, color: 'danger', value: 'ATRASADOS' },
    { name: 'D0', count: 2, color: 'info', value: 'D0' },
    { name: 'D1', count: 0, color: 'tertiary', value: 'D1' },
    { name: 'D2', count: 0, color: 'tertiary', value: 'D2' },
    { name: 'DX', count: 0, color: 'tertiary', value: 'DX' },
  ];

  ngOnInit() {

    this.spinner.show();

    this.userID = JSON.parse(localStorage.getItem('authorize') ?? '').userid;

    this.service.getOrderByUser(this.rangeOrders, JSON.parse(localStorage.getItem('authorize') ?? '').userid).subscribe((data) => {
      this.salesOrdersLists = data;
      this.finishVol = data.filter(d => d.faltaVol === 1)
      this.spinner.hide();

    })

  }

  routerCheck(numero: number)
  {
    if(numero == 1)
    {
      return;
    }

    if(this.finishVol.length > 0)
    {
      this.toast.error('Crie primeiro os volumes pendentes antes de começar outro pedido','Pedido Incompleto')
    }
  }

  getOrders(range: string) {
    this.spinner.show()
    this.salesOrdersLists = []
    this.service.getOrderByUser(range, this.userID).subscribe((data) => {
      this.salesOrdersLists = data
      this.spinner.hide()
    })
  }

  changeOrders() {
    this.spinner.show()
    this.salesOrdersLists = []
    this.service.getOrderByUser(this.rangeOrders, this.userID).subscribe((data) => {
      this.salesOrdersLists = data
      this.spinner.hide()
    })
  }


  backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }


  openModal(content: any) {
   
    if(this.finishVol.length > 0 && this.userID?.toString() !='381' && this.userID?.toString() !='384')
    {
      this.toast.error('Finalize todos os pedidos com volumes em aberto antes de seguir com a separação do próximo pedido.')
      return;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  goOrder(){

    if(this.pickingReference == '' || this.pickingReference == undefined)
    {
      this.toast.error('Informe um número de picking para acessar')
      return;
    }

    this.navCtrl.navigateForward(`/pick-item/${this.pickingReference}/${JSON.parse(localStorage.getItem('authorize') ?? '').userid}`, { replaceUrl: true });
    this.modalService.dismissAll()
  }
}