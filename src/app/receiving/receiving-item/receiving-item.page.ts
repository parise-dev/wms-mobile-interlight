import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ViagemsListMobile, ViagemsListMobileV2 } from 'src/app/models/sales-orders-list';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';

@Component({
  selector: 'app-receiving-item',
  templateUrl: './receiving-item.page.html',
  styleUrls: ['./receiving-item.page.scss'],
})
export class ReceivingItemPage implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute,
    private navCtrl: NavController, private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private service: SapServiceService) { }


  ionViewWillEnter() {
    // Executado toda vez que a página é "exibida"
    this.reload();
  }


  @ViewChild('meuInput') meuInput!: ElementRef<HTMLInputElement>;


  viagem: ViagemsListMobileV2[] = [];

  v: ViagemsListMobileV2 = {} as ViagemsListMobileV2

  volumeBip: any

  id: string = '';

  isToastOpen: boolean = false;
  messageToast: string = '';

  setOpen(bool: any) {
    this.isToastOpen = bool
  }

  userid: string = ''

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    const auth = localStorage.getItem('authorize');
    this.userid = auth ? JSON.parse(auth)?.userid?.toString() ?? '' : '';

    this.viagem = []
    this.reload()
  }
  ngAfterViewInit() {

    this.reload()
  }
  reload() {
    this.spinner.show()


    setTimeout(() => {
      this.service.getViagemsMobileV2(this.route.snapshot.params['id']).subscribe((data) => {
        this.viagem = data
      }, () => {

      })
      this.spinner.hide()
    }, 3000)
  }

  backHome() {
    this.navCtrl.navigateForward('/receiving', { replaceUrl: true });
  }

  clear() {
    this.volumeBip = null;
    this.reload()
  }

  sendEnvioPacking() {

    var error = []
    this.viagem.forEach(it => {

      if (it.itens > it.carregado) {
        error.push('teste')
      }
    })

    if (error.length > 0) {
      this.toast.error('Não é possivel concluir viagem sem confirmar todos os volumes')
      return;
    }

    this.spinner.show();

    this.service.finishEnvioExpedition(this.id, this.userid).subscribe(() => {

      this.toast.success('Expedição concluida.')
      this.spinner.hide()
      this.navCtrl.navigateForward('/receiving', { replaceUrl: true });
    }, () => {

    })
  }

  onKeydown(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key === 'Enter') {

      // this.pack = this.pack.filter(p => ('#VOL' + p.id.toString().padStart(6, '0')) == input.value.trim().toString())

      //'#VOL'+ id.toString().padStart(6, '0')
      //alert(`Código escaneado: ${input.value}`)
      //console.log('Código escaneado:', input.value);
      // Processar o código aqui...

      //input.value = ''; // Limpa o input após a leitura
    }
  }

  marked(i: number) {


  }

  formatVol(id: string) {
    if (id == "SEM VOLUME") {
      return '#' + id.toString()
    }
    return '#VOL' + id.toString().padStart(6, '0')
  }

  checkStatus(v: ViagemsListMobileV2) {

    if (v.carregado == v.itens) {
      return 'CARREGADO'
    }

    if ((v.itens > v.carregado)) {
      if (v.carregado == 0 && v.pack != 'SEM VOLUME') {
        return 'AG CARREGAMENTO'
      }

      if (v.carregado == 0 && v.pack == 'SEM VOLUME') {
        return 'AG CONCLUSÃO DO ITEM'
      }
    }

    return 'EM CARREGAMENTO'
  }

  canFinishTrip(): boolean {
  if (!this.viagem || this.viagem.length === 0) return false;
  return this.viagem.every(v => v.carregado == v.itens);
}

  getObs(p: any): string {
    return (p?.observation ?? p?.observacao ?? p?.obs ?? '').toString().trim();
  }

  hasObs(p: any): boolean {
    return this.getObs(p).length > 0;
  }
  confirmeOk() {
    if (this.volumeBip == '' || this.volumeBip == null || this.volumeBip == undefined) {
      this.reload()
    }

    this.viagem = this.viagem.filter(p => ('#VOL' + p.pack.toString().padStart(6, '0')).toUpperCase().includes(this.volumeBip.toUpperCase()))
  }
}
