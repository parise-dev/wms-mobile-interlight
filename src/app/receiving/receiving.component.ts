import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Viagens } from '../models/sales-orders-list';
import { SapServiceService } from '../shared/services/sap-service.service';
import { Router } from '@angular/router'
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-receiving',
  templateUrl: './receiving.component.html',
  styleUrls: ['./receiving.component.scss'],
})
export class ReceivingComponent implements OnInit, AfterViewInit {

  viagems: Viagens[] = [];

  @ViewChild('meuInput') meuInput!: ElementRef<HTMLInputElement>;


  isToastOpen: boolean = false;
  messageToast: string = '';
  ultimosCincoDias: { label: string, value: string }[] = [];
  volumeBip: any;
  pedidoOrViagem: any = '';
  dataSelecionada: string = moment().format('YYYY-MM-DD')

  constructor(private service: SapServiceService, private navCtrl: NavController, private route: Router) { }

  ngAfterViewInit() {

    //this.clear()
    setTimeout(() => {
      this.meuInput.nativeElement.focus();
      
    });
  }

  ionViewWillEnter() {
    // Executado toda vez que a página é "exibida"
    //this.clear();
  }
  viagemI: string = ''

  ngOnInit() {

     if (localStorage.getItem('VIAGEM') != null && localStorage.getItem('VIAGEM') != undefined) {
     
      console.log('entrei')
      this.dataSelecionada = 'Todos'
      this.volumeBip = localStorage.getItem('VIAGEM')?.toString()
      this.service.getViagemByVisit(localStorage.getItem('VIAGEM')?.toString().replace(/^V/i, "") ?? '').subscribe((data) => {
        this.viagems = data
      })


    }else
    {
      this.clear()
    }

    this.ultimosCincoDias = this.getUltimosCincoDias();

  }

  backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

  clear() {

    this.volumeBip = null
    this.dataSelecionada = 'Todos'
    localStorage.removeItem('VIAGEM')
    this.service.getViagemByFilters(this.volumeBip, this.dataSelecionada).subscribe((data) => {
      this.viagems = data
    })

  }

  confirmeOk() {

    const viagem = this.volumeBip.replace(/^V/i, "");

    if (this.volumeBip.toString().startsWith('V')) {
      this.service.getViagemByVisit(viagem).subscribe((data) => {
        this.viagems = data

        localStorage.setItem('VIAGEM', this.volumeBip)
      })

      return;
    }

    console.log('todos', this.volumeBip)

    localStorage.setItem('dataSelecionada', this.dataSelecionada)

    this.service.getViagemByFilters(this.volumeBip, this.dataSelecionada).subscribe((data) => {
      this.viagems = data
    })

  }

  confirmeDate() {

  }


  getUltimosCincoDias(): { label: string, value: string }[] {
    const dias: { label: string, value: string }[] = [];
    for (let i = 0; i < 5; i++) {
      const date = moment().subtract(i, 'days');
      dias.push({
        label: date.format('DD/MM/YYYY'),
        value: date.format('YYYY-MM-DD')
      });
    }

    dias.push({
      label: 'Qualquer Data',
      value: 'Todos'
    });

    return dias;
  }

  setOpen(bool: any) {
    this.isToastOpen = bool
  }
}
