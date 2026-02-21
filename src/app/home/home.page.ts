import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  userName: string = ''
  constructor(private auth: AuthService, private navCtrl: NavController) {

   
  }
  
  ngOnInit() 
  {
     const raw = localStorage.getItem('authorize');
    console.log('valor do raw', raw)
    if (raw) {
      try {
        const auth = JSON.parse(raw);
        this.userName = auth?.slpName ?? '';
      } catch {
          console.log('deu um erro')
        this.userName = '';
      }
    } else {
      console.log('caiu no else')
      this.userName = '';
    }
  }

  signout() {
    this.auth.signout();
  }

  printers() {
    this.navCtrl.navigateForward('/printers', { replaceUrl: true });
  }

  menu = [
    { label: 'Resumo', icon: 'bi-card-text', router: 'dashboard' },
    { label: 'Expedição', icon: 'bi-box-seam-fill', router: 'receiving' },
    { label: 'Visitas', icon: 'bi-box', router: 'receiving/loading' },
    { label: 'Canhoto', icon: 'bi-box', router: 'receiving/baixa' },
    { label: 'Reversa', icon: 'bi-clipboard-check', router: 'reverse/list' },
    { label: 'UA\'S', icon: 'bi-diagram-3', router: 'uas' },
    { label: 'Separação', icon: 'bi-basket', router: 'picking' },
    { label: 'Conferência', icon: 'bi-cart-check', router: 'checkout' },
    { label: 'Realocação', icon: 'bi bi-markdown', router: 'packing-list' },
    { label: 'Inventário', icon: 'bi-bar-chart-line', router: 'inventory' },
    { label: 'Cortes', icon: 'bi bi-scissors', router: 'cuts' },
    { label: 'Reimpressão', icon: 'bi bi-printer-fill', router: 'printers/reprint' },
    { label: 'Empilhadeira', icon: 'bi bi-box', router: 'empilhadeira' }
  ];

}
