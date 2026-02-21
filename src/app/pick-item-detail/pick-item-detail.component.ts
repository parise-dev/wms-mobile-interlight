import { ImagensCol, Line } from './../models/sales-orders-list';
import { Item, ProductsRequest, VolViewer } from 'src/app/models/sales-orders-list';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SalesOrderItensPick, UAS } from '../models/uas';
import { ActivatedRoute, Router } from '@angular/router';
import { Pack } from '../models/sales-orders-list';
import { SapServiceService } from '../shared/services/sap-service.service';
import { LoadingController, NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pick-item-detail',
  templateUrl: './pick-item-detail.component.html',
  styleUrls: ['./pick-item-detail.component.scss'],
})
export class PickItemDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  isToastOpen: boolean = false;
  loadingSpinner: boolean = false;
  saveObs: string = '';
  messageSpinner: string = '';
  volviewer: VolViewer[] = []
  messageToast: string = '';
  orderline: number = 0;
  totalRequestedPecas: number = 0;
  totalOrderUME: number = 0;
  tratativaSelected: string = '';
  tratativaObs: string = ''
  totalOrderUMV: number = 0;
  productsRequest: ProductsRequest = {} as ProductsRequest;
  teste: string = '';
  factorUnitViewer: boolean = false;

  fieldOne: boolean = false;
  fieldTwo: boolean = false;
  fieldTheere: boolean = false;

  salesOrderPick: SalesOrderItensPick = {

    itemCode: "A001",
    description: "TUBO RETANGULAR INOX 304 30 X 20 X 1,20MM DEC",
    quantity: 10,
    uaNew: '',
    um: "PC",
    uaChanged: "",
    lineNum: 0,
    obs: "Verificar formulário.",
    factor: 1,
    picked: 10,
    forms: true,
    questions: ['Há corte de barras?', 'Dimensional do item está correto?', 'O item está isento de avarias?', 'Há processo de polimento/escovamento?', 'Item com PVC?', 'O Item atende requisitos e observações do Cliente?'],
    formquestions: [{
      id: 1,
      question: 'Há corte de barras?',
      type: 'bool',
      resolution: 'true'
    }],
    address: 'GDG.E.110.001.001',
    uas: [
      {
        id: 0,
        code: 'UA0000001',
        address: 'GDG.E.110.001.001',
        batch: 'TREDFKO342',
        unitmeasure: 'PC',
        quantity: 32,
        status: false
      },
      {
        id: 1,
        code: 'UA0000002',
        address: 'GDG.E.110.001.001',
        batch: 'TREDFKO342',
        unitmeasure: 'PC',
        quantity: 32,
        status: false
      },
      {
        id: 2,
        code: 'UA0000003',
        address: 'GDG.E.110.001.001',
        batch: 'TREDFKO342',
        unitmeasure: 'PC',
        quantity: 32,
        status: false
      }]
  };

  totalRequested: number = 0;
  totalOrder: number = 0;
  absEntry: string = '';
  lineNum: string = '';
  objType: string = '';

  visibleUMV: boolean = false;
  visibleUME: boolean = false;
  visiblePECA: boolean = false;


  constructor(private router: Router,
    private spinner: NgxSpinnerService,
    private modal: NgbModal,
    private navCtrl: NavController,
    private toast: ToastrService,
    private route: ActivatedRoute, private loadingCtrl: LoadingController,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,

    private service: SapServiceService) { }


  ngAfterViewInit() {

  }

  ngOnInit() {
    this.messageSpinner = 'Carregando pedido'
    this.spinner.show()

    this.absEntry = this.route.snapshot.params['absEntry'];
    this.lineNum = this.route.snapshot.params['lineNum']; //ORDERLINE
    this.objType = this.route.snapshot.params['objType'];


    this.service.getPickingListItem(this.absEntry, this.lineNum, this.objType).subscribe((data) => {
      this.productsRequest = data

      try {
        this.checkFields(data);
        this.factorUnit(data.line.umv, data.line.factor);
        this.totalOrderUMV = this.getpickedUMV(data)
        this.totalOrderUME = this.getpickedUME(data)
        this.totalRequestedPecas = this.getpickePCK(data)
        this.cdr.detectChanges();
        setTimeout(() => {
          this.spinner.hide()
        }, 3000)

      }
      catch {
        this.cdr.detectChanges();
      }

    }, () => {
      setTimeout(() => {

        this.messageSpinner = 'Carregamento demorando mais que o comum, atualize o página'
      }, 4000)
      //this.spinner.hide()
    })

    try {
      this.totalOrder = this.salesOrderPick.uas.reduce((sum, ua) => sum + (ua.quantity || 0), 0);


    } catch {

    }
  }

  getUA() {
    this.salesOrderPick.uaNew = this.salesOrderPick.uaChanged
    //if(this.salesOrderPick.uaChanged)
  }

  checkFields(data: ProductsRequest) {

    if (this.productsRequest?.line?.factor == 1) {

      if (this.productsRequest?.line?.umv?.toUpperCase() == 'PC' &&
        this.productsRequest?.line?.ume?.toUpperCase() == 'PC') {
        this.fieldOne = false
        this.fieldTwo = false
        return;
      } else {
        this.fieldOne = false;
        this.fieldTwo = true;
        return;
      }
    }
    else {
      if (this.productsRequest?.line?.umv?.toUpperCase() == 'PC' &&
        this.productsRequest?.line?.ume?.toUpperCase() == 'PC') {
        this.fieldOne = false
        this.fieldTwo = false
        return;
      }

      if (this.productsRequest?.line?.umv?.toUpperCase() !== 'PC' &&
        this.productsRequest?.line?.ume?.toUpperCase() !== 'PC') {
        this.fieldOne = true
        this.fieldTwo = true
        return;
      } else {
        this.fieldOne = false
        this.fieldTwo = true;
        return;

      }
    }
  }

  setUA(idSelected: any) {

    console.log('ver', idSelected)

    this.salesOrderPick.uas.forEach(i => {

      if (i.id == idSelected) {
        i.status = true
      } else {
        i.status = false
      }
    })
  }


  setVisibilities(obj: ProductsRequest) {
    if (obj.line.ume.toString().toUpperCase() == 'PC' && obj.line.factor == 1) {
      this.visibleUME = false;
      this.visibleUMV = true;
      this.visiblePECA = false;
    }

    if (obj.line.ume.toString().toUpperCase() == 'PC' && obj.line.factor != 1) {
      this.visibleUME = true;
      this.visibleUMV = true;
      this.visiblePECA = false;
    }

    if (obj.line.ume.toString().toUpperCase() !== 'PC' && obj.line.factor == 1) {
      this.visibleUME = false;
      this.visibleUMV = true;
      this.visiblePECA = true;
    }
    if (obj.line.ume.toString().toUpperCase() !== 'PC' && obj.line.factor != 1) {
      this.visibleUME = true;
      this.visibleUMV = true;
      this.visiblePECA = true;
    }

  }

  openFinish(content: any, sizing: any) {

    setTimeout(() => this.takePhoto(), 300);

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', fullscreen: false,
       centered: true,
  scrollable: true,
  backdrop: 'static',
   container: 'body' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  openObsOrder(content: any, orderline: number, sizing: any) {

    this.orderline = orderline;

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title', size: 'xl', fullscreen: false, centered: true,
      scrollable: true,
      backdrop: 'static', container: 'body'
    })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  setOpen(bool: any) {
    this.isToastOpen = bool
  }

  loading = false;


  factorUnit(type: string, value: any) {
    if (type.toUpperCase() == 'PC' && value != 1) {
      this.factorUnitViewer = false;
      return;
    }

    if (value == 1) {
      this.factorUnitViewer = false;
      return;
    }

    this.factorUnitViewer = true;

  }

  selectedBatch: string | null = null;
selectedQty: number | null = null;

openAdjustModal(tpl: TemplateRef<any>) {
  this.modalService.open(tpl, { centered: true, scrollable: true, container: 'body' }); // container:'body' evita o bug
}

ajusteIndex: number | null = null;
ajusteForm = { lote: null as string | null, qtd: null as number | null, _novoAtivo: false, novoLote: '', novoQtd: null as number | null };

openAjuste(tpl: any, index: number) {
  this.ajusteIndex = index;
  this.ajusteForm = { lote: null, qtd: null, _novoAtivo: false, novoLote: '', novoQtd: null };
  this.modalService.open(tpl, { centered: true, scrollable: true, container: 'body' }); // container:'body' evita o bug
}



  checkPECA() {
    if (this.productsRequest.line.ume.toUpperCase() != 'PC'
      && this.productsRequest.line.umv.toUpperCase() != 'PC'
      && this.productsRequest.line.factor != 1) {
      return 'col-4'
    }
    return 'col-6'
  }

  checkUME() {
    if (this.productsRequest.line.factor !== 1 && this.productsRequest.line.ume.toUpperCase() != 'PC' && this.productsRequest.line.umv.toUpperCase() != 'PC') {
      return 'col-4'
    }

    return 'col-6'
  }
  checkUMV() {

    if (this.productsRequest.line.factor === 1 && this.productsRequest.line.ume.toUpperCase() == 'PC' && this.productsRequest.line.umv.toUpperCase() == 'PC') {
      return 'col-12'
    }

    if (this.productsRequest.line.factor !== 1 && this.productsRequest.line.ume.toUpperCase() != 'PC' && this.productsRequest.line.umv.toUpperCase() != 'PC') {
      return 'col-4'
    }

    return 'col-6'
  }

  pecaVisible() {
    if (this.productsRequest.line.factor === 1 && this.productsRequest.line.ume.toUpperCase() == 'PC' && this.productsRequest.line.umv.toUpperCase() == 'PC') {
      return false;
    }

    if (this.productsRequest.line.factor !== 1 && this.productsRequest.line.ume.toUpperCase() !== 'PC' && this.productsRequest.line.umv.toUpperCase() === 'PC') {
      return false;
    }

    if (this.productsRequest.line.factor !== 1 && this.productsRequest.line.ume.toUpperCase() === 'PC' && this.productsRequest.line.umv.toUpperCase() !== 'PC') {
      return false;
    }

    return true;
  }

  umeVisible() {

  }


  carregarDados() {
    this.loadingSpinner = true;

    setTimeout(() => {
      this.loadingSpinner = false; // Simula o fim do carregamento
    }, 3000);
  }

  async setSolicitado(i: number) {

    this.messageSpinner = 'Aguarde ...'

    this.spinner.show();

    // this.toast.error('Só um teste')
    //return;

    var factorUnit = this.productsRequest.line.factor;
    var unitSales = this.productsRequest.line.umv.toUpperCase();
    var unitStock = this.productsRequest.line.ume.toUpperCase();

    if (Number(this.productsRequest?.items[i]?.pickedUMV ?? 0) > Number(this.productsRequest.items[i]?.disponivel)) {
      this.toast.error('Quantidade informada, superior a disponivel nesse lote.')
      this.spinner.hide()
      return;
    }

    /*

     CENARIOS
     
     CENARIO 1 ---- FATOR UNIDADE = 1 E UMV E UME == PC
     CENARIO 2 ---- FATOR UNIDADE = 1 E UMV E UME <> PC
     -------------- SEMPRE QUE TIVER FATOR UNIDADE UME E UMV SERAO IGUAIS COM 1 EXCEÇÃO

     CENARIO 3 ---- FATOR UNIDADE <> 1 UME <> PC E UMV = PECA
 

    */

    if (factorUnit == 1 && unitSales == 'PC' && unitStock == 'PC') {

      if (this.isInvalidCheckTravasCenario1(i)) { this.spinner.hide(); return; }

      this.productsRequest.items[i].pickedPCK = this.productsRequest.items[i].pickedUMV;
      this.productsRequest.items[i].pickedUME = this.productsRequest.items[i].pickedUMV;


      this.confirmItemSAP(i);
      return;
    }

    if (factorUnit == 1 && unitSales !== 'PC' && unitStock !== 'PC') {

      if (this.isInvalidCheckTravasCenario2(i)) { this.spinner.hide(); return; }

      this.productsRequest.items[i].pickedUME = this.productsRequest.items[i].pickedUMV;

      this.confirmItemSAP(i);
      return;
    }

    if (factorUnit !== 1 && unitStock !== 'PC' && unitSales == 'PC') {

      if (this.isInvalidCheckTravasCenario3(i)) { this.spinner.hide(); return; }

      this.productsRequest.items[i].pickedPCK = this.productsRequest.items[i].pickedUMV;

      this.confirmItemSAP(i);
      return;
    }

    if (factorUnit !== 1 && unitStock == 'PC' && unitSales !== 'PC') {

      if (this.isInvalidCheckTravasCenario4(i)) { this.spinner.hide(); return; }

      this.productsRequest.items[i].pickedPCK = this.productsRequest.items[i].pickedUME;

      this.confirmItemSAP(i);
      return;
    }


    if (factorUnit !== 1 && unitStock !== 'PC' && unitSales !== 'PC') {

      if (this.isInvalidCheckTravasCenario5(i)) { this.spinner.hide(); return; }

      this.confirmItemSAP(i);
      return;
    }

    this.spinner.hide();

  }

  isInvalidCheckTravasCenario1(i: any) {

    const item = this.productsRequest.items[i];
    const itemLine = this.productsRequest.line;

    var ttpickedUMV = this.productsRequest.items.reduce((acc, it) => acc + Number(it?.pickedUMV ?? 0), 0);

    console.log('UMV TOTAL', ttpickedUMV, 'UMV', item.pickedUMV)

    if (ttpickedUMV > itemLine.quantity * (1 + (itemLine.toleranceSeparador / 100))) {
      this.toast.error('Quantidade superior a permitida')
      return true
    }

    if (item.pickedUMV == 0 || item.pickedUMV == undefined) {
      this.toast.error('Informe uma quantidade válida')
      return true;
    }

    if (item.pickedUMV > (itemLine.quantity * (1 + (itemLine.toleranceSeparador / 100)))) {
      this.toast.error('Informe uma quantidade superior a permitida')
      return true;
    }

    return false;
  }

  isInvalidCheckTravasCenario2(i: any) {

    const item = this.productsRequest.items[i];
    const itemLine = this.productsRequest.line;

    console.log('UMV', item.pickedUMV)



    var ttpickedUMV = this.productsRequest.items.reduce((acc, it) => acc + Number(it?.pickedUMV ?? 0), 0);

    console.log('UMV TOTAL', ttpickedUMV, 'UMV', item.pickedUMV)

    if (ttpickedUMV > itemLine.quantity * (1 + (itemLine.toleranceSeparador / 100))) {
      this.toast.error('Quantidade superior a permitida')
      return true
    }


    if ((item.pickedUMV == 0 || item.pickedUMV == undefined) || (item.pickedPCK == 0 || item.pickedPCK == undefined)) {
      this.toast.error('Informe uma quantidade válida')
      return true
    }

    if (this.productsRequest.line.umv == 'MT' && this.productsRequest.line.ume == 'MT') {

      if (!this.eMultiploDe(item.pickedUMV, itemLine.multiple ?? 0.01)) {
        this.toast.error(`Informe um valor múltiplo de ${itemLine.multiple ?? 0.01}`)
        return true
      }
    }

    if (item.pickedUMV > (itemLine.quantity * (1 + (itemLine.toleranceSeparador / 100)))) {
      this.toast.error('Quantidade superior a permitida')
      return true;
    }

    return false;
  }

  isInvalidCheckTravasCenario3(i: any) {

    const item = this.productsRequest.items[i];
    const itemLine = this.productsRequest.line;

    console.log('item.pickedUMV ', item.pickedUMV)
    console.log('exce ', ((itemLine.quantity * itemLine.factor) * (1 + (itemLine.toleranceSeparador / 100))))

    if ((item.pickedUMV == 0 || item.pickedUMV == undefined) || (item.pickedUME == 0 || item.pickedUME == undefined)) {
      this.toast.error('Informe uma quantidade válida')
      return true
    }

    if (item.pickedUMV > (itemLine.quantity * (1 + (itemLine.toleranceSeparador / 100)))) {
      this.toast.error(`Quantidade ${itemLine.umv} superior a permitida`)
      return true;
    }

    if (item.pickedUME > ((itemLine.quantity * itemLine.factor) * (1 + (itemLine.toleranceSeparador / 100)))) {
      this.toast.error(`Quantidade ${itemLine.ume} superior a permitida`)
      return true;
    }

    return false;
  }

  isInvalidCheckTravasCenario4(i: any) {

    const item = this.productsRequest.items[i];
    const itemLine = this.productsRequest.line;

    if ((item.pickedUMV == 0 || item.pickedUMV == undefined) || (item.pickedUME == 0 || item.pickedUME == undefined)) {
      this.toast.error('Informe uma quantidade válida')
      return true
    }

    if (item.pickedUMV > (itemLine.quantity * (1 + (itemLine.toleranceSeparador / 100)))) {
      this.toast.error(`Quantidade ${itemLine.umv} superior a permitida`)
      return true;
    }

    if (item.pickedUMV > ((itemLine.quantity * itemLine.factor) * (1 + (itemLine.toleranceSeparador / 100)))) {
      this.toast.error(`Quantidade ${itemLine.ume} superior a permitida`)
      return true;
    }

    return false;
  }

  isInvalidCheckTravasCenario5(i: any) {

    const item = this.productsRequest.items[i];
    const itemLine = this.productsRequest.line;

    if ((item.pickedUMV == 0 || item.pickedUMV == undefined) || (item.pickedUME == 0 || item.pickedUME == undefined) || (item.pickedPCK == 0 || item.pickedPCK == undefined)) {
      this.toast.error('Informe uma quantidade válida')
      return true
    }

    if (item.pickedUMV == item.pickedUME) {
      this.toast.error('Pedido possui fator unidade, a quantidade da unidade de venda do pedido deve ser diferente da quantidade da unidade de controle de estoque.')
      return true
    }

    if (item.pickedUMV > (itemLine.quantity * (1 + (itemLine.toleranceSeparador / 100)))) {
      this.toast.error(`Quantidade ${itemLine.umv} superior a permitida`)
      return true;
    }

    if (item.pickedUME > ((itemLine.quantity * itemLine.factor) * (1 + (itemLine.toleranceSeparador / 100)))) {
      this.toast.error(`Quantidade ${itemLine.ume} superior a permitida`)
      return true;
    }

    return false;
  }

  confirmItemSAP(i: any) {

    // return;
    var ppr = { ...this.productsRequest }

    ppr.items = []
    ppr.items.push(this.productsRequest.items[i])


    this.service.postConfirmItem(ppr).subscribe(() => {
      console.log('data',)
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    })

    this.totalOrderUMV = this.getpickedUMV(this.productsRequest)
    this.totalOrderUME = this.getpickedUME(this.productsRequest)
    this.totalRequestedPecas = this.getpickePCK(this.productsRequest)
    this.productsRequest.items[i].confirmed = true;

    console.log('Confirmado', this.productsRequest.items[i])

    this.toast.success('Confirmado')
  }

  /*
  
    if (((this.productsRequest.items[i].pickedUMV == 0 || this.productsRequest.items[i].pickedUMV == undefined)
      && (this.productsRequest.items[i].pickedUME == 0 || this.productsRequest.items[i].pickedUME == undefined))
      || (this.productsRequest.items[i].pickedUME == 0 || this.productsRequest.items[i].pickedUME == undefined)
    ) {
      this.messageToast = 'Informar quantidade(s) e peça para continuar';
      this.setOpen(true);
      this.spinner.hide();
      return;
    }
  
    if ((this.productsRequest.items[i].pickedUMV == 0 || this.productsRequest.items[i].pickedUMV == undefined)
      && (this.productsRequest.items[i].pickedUME != 0 && this.productsRequest.items[i].pickedUME != undefined)) {
      console.log('umv muda de valor aqui', Number(this.productsRequest.items[i].pickedUME) / Number(this.productsRequest.line.factor))
      this.productsRequest.items[i].pickedUMV = Number(this.productsRequest.items[i].pickedUME) / Number(this.productsRequest.line.factor)
    }
  
    if ((this.productsRequest.items[i].pickedUMV != 0 || this.productsRequest.items[i].pickedUMV != undefined)
      && (this.productsRequest.items[i].pickedUME == 0 && this.productsRequest.items[i].pickedUME == undefined)) {
      console.log('ume muda de valor aqui', Number(this.productsRequest.items[i].pickedUMV) * Number(this.productsRequest.line.factor))
      this.productsRequest.items[i].pickedUME = Number(this.productsRequest.items[i].pickedUMV) * Number(this.productsRequest.line.factor)
    }
  
    var totalPickedUMV = this.getpickedUMV(this.productsRequest);
    var totalPickedUME = this.getpickedUME(this.productsRequest);
  
    var toleranceSep = 1 + (this.productsRequest.line.toleranceSeparador / 100);
    var toleranceSup = 1 + (this.productsRequest.line.toleranceSupervisor / 100);
  
    var totalUMV = this.productsRequest.line.quantity;
    var factor = this.productsRequest.line.factor;
  
    console.log('PICKED', totalPickedUMV, totalPickedUME, totalUMV, toleranceSep, 'total: ', (totalUMV * toleranceSep))
  
    if ((totalPickedUMV) > ((totalUMV * factor * toleranceSep))) {
      this.productsRequest.items[i].pickedUMV = 0;
      this.productsRequest.items[i].pickedUME = 0;
      this.productsRequest.items[i].pickedPCK = 0;
      this.productsRequest.items[i].confirmed = false;
      this.productsRequest.items[i].userId = Number(JSON.parse(localStorage.getItem('authorize') ?? '').userid ?? 0);
      this.setOpen(true)
  
      this.messageToast = 'Quantidade supera a quantidade permitida do picking'
      this.spinner.hide();
      return;
    }
  
  
    this.totalOrderUMV = this.getpickedUMV(this.productsRequest)
    this.totalOrderUME = this.getpickedUME(this.productsRequest)
    this.totalRequestedPecas = this.getpickePCK(this.productsRequest)
    this.productsRequest.items[i].confirmed = true;
  
    console.log('Confirmado', this.productsRequest.items[i])
  
    var ppr = { ...this.productsRequest }
  
    ppr.items = []
    ppr.items.push(this.productsRequest.items[i])
  
  
    this.service.postConfirmItem(ppr).subscribe(() => {
      console.log('data',)
      this.spinner.hide();
    }, () => {
      this.spinner.hide();
    })
  
    console.log('item request', this.productsRequest, this.productsRequest.items[i])
    */


  eMultiploDe(num: number, base: number) {
    const resto = num % base;
    return Math.abs(resto) < 0.00001 || Math.abs(resto - base) < 0.00001;
  }

  getpickedUMV(pedido: ProductsRequest): number {
    console.log('pedido', pedido)
    return pedido.items.reduce((total, item) => total + (item.pickedUMV ?? 0), 0);
  }

  getpickedUME(pedido: ProductsRequest): number {
    return pedido.items.reduce((total, item) => total + (item.pickedUME ?? 0), 0);
  }

  getpickePCK(pedido: ProductsRequest): number {
    return pedido.items.reduce((total, item) => total + (item.pickedPCK ?? 0), 0);
  }

  finishPickingCamera(modal: any) {


    if (this.productsRequest?.line?.umv.toUpperCase() == 'KG' && this.images.length == 0) {
      this.toast.error('Para esse item é obrigatório comprovante de pesagem')
      return;
    }

    this.finishPicking()
  }

  check() {

    var error = []

    this.images.forEach(it => {
      if (it.tipo == 'I' || it.tipo == '') {
        error.push(1)
      }
    })

    if (error.length > 0) {
      this.toast.error('Selecione um tipo de Peso (bruto / liquido)')
      return;
    }

    this.stopCamera()
    this.modalService.dismissAll()
  }

  async finishPicking() {

    this.messageSpinner = 'Salvando comprovantes e finalizando picking do item no SAP',

      this.spinner.show();

    this.stopCamera();

    if (this.checkCenariosisInvalid()) {
      this.spinner.hide();
      return;
    }


    if (this.productsRequest?.line?.umv == 'KG') {
      this.service.uploadImages(this.images, this.productsRequest.line.docNum, this.productsRequest.line.orderLine).subscribe(() => {
      })
    }

    this.productsRequest.sessionId = JSON.parse(localStorage.getItem('authorize') ?? '').sessionId;

    if (this.productsRequest.line.factor != 1) {
      this.service.finishPick(this.productsRequest).subscribe(() => {
        this.spinner.hide()

        this.toast.success('Picking Finalizado com sucesso')

        setTimeout(() => {
          this.navCtrl.navigateForward(`/pick-item/${this.productsRequest.line.docNum}/${JSON.parse(localStorage.getItem('authorize') ?? '').userid}`, { replaceUrl: true });


        }, 1000)

      }, (e) => {
        this.toast.error(e.error)
        this.spinner.hide()
      })

      return;
    }

    this.service.finishPickWihoutFU(this.productsRequest.line.orderLine, this.productsRequest.line.absEntry, this.saveObs, JSON.parse(localStorage.getItem('authorize') ?? '').sessionId)
      .subscribe(() => {
        this.spinner.hide()
        this.setOpen(true)
        this.messageToast = 'Picking Finalizado'

        setTimeout(() => {

          this.navCtrl.navigateForward(`/pick-item/${this.productsRequest.line.docNum}/${JSON.parse(localStorage.getItem('authorize') ?? '').userid}`, { replaceUrl: true });

        }, 1000)

      }, (e) => {
        this.setOpen(true)
        this.messageToast = `${e.error}`
        this.spinner.hide()
      });

  }

  checkCenariosisInvalid() {


    var min = this.productsRequest?.line?.quantity * 0.8;
    var minReal = this.getpickedUMV(this.productsRequest)
    var max = this.productsRequest?.line?.quantity * 1.30
    var maxReal = this.getpickedUMV(this.productsRequest)

    if (maxReal > max) {
      this.toast.error('Quantidade separada supera a quantidade do pedido')
      return true
    }

    if (minReal < min) {
      this.toast.error('Não foi separada a quantidade total solicitada do pedido, conclua o picking antes de finalizar')
      return true
    }

    return false;
  }


  saveObsPicking() {

    var obj = {
      comments: this.saveObs,
      absEntry: this.productsRequest.line.docNum,
      pickLine: this.orderline
    }

    this.service.saveObsPicking(obj).subscribe(() => {
      this.toast.success('Salvo com sucesso!')
      this.modalService.dismissAll();
    }, () => {
      this.toast.error('Erro ao salvar a observação')
    })


  }
  createIssue() {
    var obj = {
      id: 0,
      createDate: moment().format('YYYY-DD-MMTHH:mm:ssz'),
      docEntry: this.productsRequest.line.orderEntry,
      objType: '17',
      lineNum: this.productsRequest.line.orderLine,
      userId: JSON.parse(localStorage.getItem('authorize') ?? '').userid,
      subject: this.tratativaSelected,
      details: this.tratativaObs,
      answer: null,
      status: "O",
      closeDate: null,
      userAnswerId: null
    }

    this.service.createIssuer(obj).subscribe(() => {
      this.modalService.dismissAll()
      this.setOpen(true);
      this.messageToast = 'Salvo com sucesso'
    })
  }

  backToDocument() {
    this.navCtrl.navigateForward(`/pick-item/${this.productsRequest.line.docNum}/${JSON.parse(localStorage.getItem('authorize') ?? '').userid}`, { replaceUrl: true });
  }

  clear(i: Item, p: ProductsRequest) {
    this.spinner.show();

    var session = JSON.parse(localStorage.getItem('authorize') ?? '').sessionId;

    this.service
      .desfazPick(p.line.docNum,
        p.line.orderLine,
        i.batch,
        session
      ).subscribe(() => {
        this.toast.success('Limpo com sucesso.');

        this.service.getPickingListItem(this.absEntry, this.lineNum, this.objType).subscribe((data) => {
          this.productsRequest = data

          try {
            this.checkFields(data);
            this.factorUnit(data.line.umv, data.line.factor);
            this.totalOrderUMV = this.getpickedUMV(data)
            this.totalOrderUME = this.getpickedUME(data)
            this.totalRequestedPecas = this.getpickePCK(data)
            this.cdr.detectChanges();
            setTimeout(() => {
              this.spinner.hide()
            }, 3000)

          }
          catch {
            this.cdr.detectChanges();
          }

        }, () => {
          setTimeout(() => {

            this.messageSpinner = 'Carregamento demorando mais que o comum, atualize o página'
          }, 4000)
          //this.spinner.hide()
        })
      },
        () => {
          this.spinner.hide()
        })

  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  captureImage() {
    if (!this.videoElement || !this.videoElement.nativeElement) {
      console.error('Elemento de vídeo não encontrado!');
      return;
    }

    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      var obj = {
        imagem: canvas.toDataURL('image/png'),
        tipo: ''
      }

      this.images.push(obj);
    }
  }


  images: ImagensCol[] = [];
  private stream: MediaStream | null = null;
  photo: string = '';

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64, // Para salvar como Base64
      source: CameraSource.Camera,
    });

    this.photo = `data:image/jpeg;base64,${image.base64String}`;

    var obj = {
      imagem: this.photo,
      tipo: ''
    }

    this.images.push(obj)
  }


  async startCamera() {
    try {


      const constraints = {
        video: {
          facingMode: "environment" // Usa a câmera traseira no celular
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (!this.videoElement || !this.videoElement.nativeElement) {
        console.error('Elemento de vídeo não encontrado!');
        return;
      }

      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.stream;
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
    }
  }

    supervisorPass = '';
  supervisorError = '';

  // referência do item que está sendo ajustado
  public uaSelecionada: any = null;
 isReady = false;
  // ajuste (existente)
  ajusteLotesMock: string[] = ['ABC', 'DFE'];
  ajusteLoteSelecionado: string | null = null;
  ajusteQuantidade: number | null = null;

  // novo lote
  ajusteCriandoNovoLote = false;
  novoLoteCodigo: string = '';
  novoLoteQuantidade: number | null = null;

  // chame quando terminar de montar dados (ex.: no subscribe)
  markReady() {
    this.isReady = true;
  }

  openModalZerado(modalSupervisor: any){
     this.modal.open(modalSupervisor, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-verificacao'
    });
  }

  openAdjustFlow(modalSupervisor: any, modalAjuste: any, ua: any, type: any = null) {

    this.uaSelecionada = ua || null;
    this.supervisorPass = '';
    this.supervisorError = '';
    this.ajusteCriandoNovoLote = false;
    this.ajusteLoteSelecionado = null;
    this.ajusteQuantidade = null;
    this.novoLoteCodigo = '';
    this.novoLoteQuantidade = null;

    this.modal.open(modalSupervisor, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-verificacao'
    });
    // o próximo modal será aberto dentro de verifySupervisor() ao autorizar
  }

  verifySupervisor(supervisorRef: NgbModalRef, modalAjuste: any) {
    if (this.supervisorPass === '12345') {
      supervisorRef.close();
      // abre o modal de ajuste
      setTimeout(() => {
        this.modal.open(modalAjuste, {
          centered: true,
          backdrop: 'static',
          keyboard: false,
          windowClass: 'modal-ajuste'
        });
      }, 50);
    } else {
      this.supervisorError = 'Senha incorreta.';
    }
  }

  toggleCriarNovoLote() {
    this.ajusteCriandoNovoLote = !this.ajusteCriandoNovoLote;
    // limpa campos ao alternar
    this.ajusteLoteSelecionado = null;
    this.ajusteQuantidade = null;
    this.novoLoteCodigo = '';
    this.novoLoteQuantidade = null;
  }

  podeConfirmarAjuste(): boolean {
    if (this.ajusteCriandoNovoLote) {
      return !!this.novoLoteCodigo && (this.novoLoteQuantidade ?? 0) > 0;
    }
    return !!this.ajusteLoteSelecionado && (this.ajusteQuantidade ?? 0) > 0;
  }

  confirmarAjuste(modalRef: NgbModalRef) {
    const ajuste = this.ajusteCriandoNovoLote
      ? { batch: this.novoLoteCodigo, qty: this.novoLoteQuantidade }
      : { batch: this.ajusteLoteSelecionado, qty: this.ajusteQuantidade };

    // aplica no item selecionado sem quebrar se não existir
    if (this.uaSelecionada) {
      this.uaSelecionada.ajuste = ajuste;
    }

    modalRef.close();
  }

mostrarSelecaoLote = false;
}
