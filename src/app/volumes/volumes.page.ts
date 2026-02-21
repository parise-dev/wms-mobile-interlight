import { Component, OnInit } from '@angular/core';
import { Pack, Volumes, VolViewer } from '../models/sales-orders-list';
import { SapServiceService } from '../shared/services/sap-service.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-volumes',
  templateUrl: './volumes.page.html',
  styleUrls: ['./volumes.page.scss'],
})
export class VolumesPage implements OnInit {

  volumes: Pack[] = [];
   volviewer: VolViewer[] = []
  id: any
  isToastOpen: boolean = false;
  messageToast: string = '';
userid:string = '';

  constructor(private service: SapServiceService, private spinner: NgxSpinnerService, private toast: ToastrService, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.userid = JSON.parse(localStorage.getItem('authorize') ?? '').userid
   
    localStorage.setItem('absEntry', this.route.snapshot.params['id']);
    
    this.service.getAllVolumesByPickList(this.route.snapshot.params['id'], JSON.parse(localStorage.getItem('authorize') ?? '').userid).subscribe((data)=>{
      this.volumes = data
    })
  }

  printer()
  {
       var vols = this.volumes.filter(p => p.selected == true)
       var ipPrint = localStorage.getItem('printers')

       console.log('vol', this.volumes)

       vols.forEach(v =>
      {
        var obj = {
          idPack: v.id,
          ipPrinters: ipPrint
        }

        console.log('aqui')
        this.service.printTag(obj).subscribe(()=>
        {
          this.messageToast = 'Impresso com sucesso'
          this.setOpen(true)
        })

       })
    
   
  }

  cancelarVolume(){
    this.spinner.show()
    const x = [...this.volumes.filter(s => s.selected)]
    console.log('volumes x', x)

    x.forEach( it => {
      this.service.cancelPack(it.id).subscribe(()=>{
        console.log('Cancelado')
      })
    })
   
    this.service.getAllVolumesByPickList(this.id, JSON.parse(localStorage.getItem('authorize') ?? '')).subscribe((data)=>{
      this.volumes = data
      this.toast.success('Cancelado com sucesso')
      this.spinner.hide()
    }, ()=>{
      this.spinner.hide()
    })

    
  }

  openObsOrder(content: any, id: any, sizing: any){

    this.service.getPackItensViewer(id).subscribe((data)=>{
      this.volviewer = data
    })
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', fullscreen: false})
    .result.then((result) => {
        console.log(result);
    }, (reason) => {
        console.log('Err!', reason);
    });
  }


  setOpen(bool: any) {
    this.isToastOpen = bool
  }

  showInputs: boolean = false;

  toggleInputs(event: any): void {
    this.showInputs = event.detail.checked;
  }

  formatName(i: any){
    return '#VOL'+ i.toString().padStart(6, '0')
  }

  reload(){
    
  }
}
