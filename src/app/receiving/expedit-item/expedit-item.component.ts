import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ViagemsListMobileV2, VolumesListMobileV2 } from 'src/app/models/sales-orders-list';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';

@Component({
  selector: 'app-expedit-item',
  templateUrl: './expedit-item.component.html',
  styleUrls: ['./expedit-item.component.scss'],
})
export class ExpeditItemComponent implements OnInit {

  volume: VolumesListMobileV2[] = []

  constructor(private service: SapServiceService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private navCtrl: NavController
  ) { }

  idtravel: string = '';
  idVolume: string = '';
  userId: string = '';

  
  ngOnInit() {
    this.idtravel = this.route.snapshot.params['id'];
    this.idVolume = this.route.snapshot.params['id2'];
    
    const auth = localStorage.getItem('authorize');
    this.userId = auth ? JSON.parse(auth)?.userid?.toString() ?? '' : '';

    this.service
      .getVolumesListMobileV2(this.route.snapshot.params['id'],
        this.route.snapshot.params['id2'])
      .subscribe((data) => {
        this.volume = data
      })
  }

  backHome() {
    this.navCtrl.navigateForward(`receiving/receiving-item/${this.idtravel}`, { replaceUrl: true });
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  setCarregado(i: any) {
    this.volume[i].carregado = 'Y'
  }

  concluirCarregado() {
    this.spinner.show()
    var teste = [...this.volume.filter(i => i.carregado == 'Y')]

    console.log('teste', teste)

    try {

      teste.forEach(it => {
        this.service.updateTravel(it.id, this.userId).subscribe(() => {
          console.log('atualizado')
        })

      })
    } catch {

    }

    setTimeout(() => {
      this.spinner.hide()
      this.toast.success('Carregamento confirmado')
      this.backHome()
    }, 6000);

  }
}
