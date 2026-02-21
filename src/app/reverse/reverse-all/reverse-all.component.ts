import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pack } from 'src/app/models/sales-orders-list';
import { ReserveV1, ReserveV1Documents, ReversePackAllList } from 'src/app/models/uas';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';

@Component({
  selector: 'app-reverse-all',
  templateUrl: './reverse-all.component.html',
  styleUrls: ['./reverse-all.component.scss'],
})
export class ReverseAllComponent  implements OnInit {

  pack: Pack[] = [];
  reprovedMotived: string = '';
  reprovedDestiny: string = '';
  visibleLocal: boolean = false;
  localDestiny: string = '';
  id: string = '';
  reversePackAllList: ReversePackAllList[] = [];


  addressDestiny: string = '';
  visibleAddress: boolean = false;
  reverves: ReserveV1Documents[] = []

  idReverse: number = 0
  
  volumeBip: string = '';
  isToastOpen: boolean = false;

  messageToast: string = 'Carregando... '
  
  constructor(private router: Router, private spinner: NgxSpinnerService, private route: ActivatedRoute, private service: SapServiceService, private navCtrl: NavController, private modalService: NgbModal) { }

  setOpen(bool: any) {
    this.isToastOpen = bool
  }

  backHome(){
   this.navCtrl.navigateForward('/reverse/list', { replaceUrl: true });
  }

  formatVol(id: number) {
    return '#VOL' + id.toString().padStart(6, '0')
  }


  openReproved(content: any, id: any){

    this.idReverse = id
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', fullscreen: false})
    .result.then((result) => {
        console.log(result);
    }, (reason) => {
        console.log('Err!', reason);
    });
  }

  saveReproved()
  {
    var obj = {
      id: this.idReverse,
      type: this.reprovedDestiny,
      message: this.reprovedDestiny + '' + this.addressDestiny
    }

    this.service.patchReversaNew(obj).subscribe(()=>{
      this.modalService.dismissAll()
      this.isToastOpen = true;
      this.messageToast = 'Reversa aberta com sucesso'

      this.service.getAllReverseByVolumes(this.id).subscribe((data)=>{
        console.log('reserve', data)
        this.reverves  = data
      })
    })
  }

  confirmExcluir() {
  // TODO: implemente chamada ao service
}

confirmDesfazer() {
  // TODO: implemente chamada ao service
}


/** Clique do OK no input */
onSubmitVolume() {
  if (!this.volumeBip) return;
  // sua lógica de busca/rota aqui
}


  ngOnInit() {

    this.spinner.show();

    this.id = this.route.snapshot.params['id'];

    this.service.getAllReverseByVolumes(this.route.snapshot.params['id']).subscribe((data)=>{
         console.log('reserve', data)
      this.reverves  = data
      this.spinner.hide()
    },()=>{
      this.spinner.hide()
    })
  }

  setDestiny(){
    if(this.reprovedDestiny == 'ESTOQUE'){
      this.visibleAddress = true
      this.visibleLocal = false
    }

    if(this.reprovedDestiny == 'RETORNE'){
      this.visibleAddress = false
      this.visibleLocal = false
    }
    
    if(this.reprovedDestiny == 'LOCAL'){
      this.visibleAddress = false
      this.visibleLocal = true
    }
  }


  reload(){
     this.service.getAllReverseByVolumes(this.id).subscribe((data)=>{
        console.log('reserve', data)
        this.reverves  = data
      })
  }
}
