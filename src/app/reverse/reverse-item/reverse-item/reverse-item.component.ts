import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PackFinsh, ReversePackItem, VolumesItem } from 'src/app/models/uas';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';

@Component({
  selector: 'app-reverse-item',
  templateUrl: './reverse-item.component.html',
  styleUrls: ['./reverse-item.component.scss'],
})
export class ReverseItemComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private service: SapServiceService,
    private toast: ToastrService,
    private navCtrl: NavController,
    private modalService: NgbModal) { }

  id = '';
  id2 = '';
  lineNum: number = 0;
  itemSelecionado: any; // ou o tipo correto do seu objeto


  reversePackItem: ReversePackItem[] = [];
  itemsInVolumes: VolumesItem[] = [];


  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.id2 = this.route.snapshot.params['id2'];

    //this.id = '89353'; docNum
    //this.id2 = '76'; vol

    this.service.getPackByDocNumAndVol(this.id, this.id2).subscribe((data) => {
      console.log('id: ', this.id, 'id 2: ', this.id2, 'data', data)
      this.reversePackItem = data
    })
    console.log('id: ', this.id, 'id 2: ', this.id2)
  }


  backHome() {
    this.navCtrl.navigateForward(`reverse/docnum/${this.id}`)
  }

  openModal(content: any, lineNum: number, docnum: any, itemCode: any) {

    this.lineNum = lineNum

    this.service.getPackByDocNumAndItemCode(docnum, itemCode).subscribe((data) => {
      this.itemsInVolumes = data
    })

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      .result.then((result) => {
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  confirmExcluir() {
    // TODO: coloque a lógica que já existe no seu sistema
    console.log("Excluir confirmado");
  }

  recriar() {
    this.spinner.show()

    var reverse: any[] = []

    var base = this.reversePackItem[0];

    var obj = {
      id: this.id2,
      pick: base.absEntry,
      lineNum: base.lineNum,
      reason: "",
      obs: ''
    }

    console.log('obj 1', obj)
    reverse.push(obj)


    this.service.postCreatePackReversaNew(reverse).subscribe((data) => {
      this.toast.success('Reversa concluida com sucesso')
      this.navCtrl.navigateForward(`/reverse/docnum/${this.id}`, { replaceUrl: true });
      this.spinner.hide()

    }, (e) => {
      this.toast.error(`${e.error}`)
      this.spinner.hide()
    })
  }

  retomarUA(absEntry: number, lineNum: number) {
    
    this.spinner.show()
      
      var obj = {
        id: this.id2,
        pick: absEntry,
        lineNum: lineNum,
        reason: "",
        obs: ''
      }

      let sessionId = JSON.parse(localStorage.getItem('authorize') ?? '').sessionId;

    this.service.postRetornaUANew(obj, sessionId).subscribe((data) => 
    {
      this.toast.success('Reversa concluida com sucesso')
      this.navCtrl.navigateForward(`/reverse/docnum/${this.id}`, { replaceUrl: true });
      this.spinner.hide()

    }, (e) => {
      this.toast.error(`${e.error}`)
      this.spinner.hide()
    })
  }

  confirmDesfazer() {
    // TODO: coloque a lógica que já existe no seu sistema
    console.log("Desfazer confirmado");
  }

  formatVol(id?: number) {

    if (id == null || id == undefined) {
      return '-'
    }


    return '#VOL' + id.toString().padStart(6, '0')
  }

}













































































































































































