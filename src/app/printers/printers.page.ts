import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.page.html',
  styleUrls: ['./printers.page.scss'],
})
export class PrintersPage implements OnInit {
  isToastOpen: boolean = false;
  constructor(private router: Router, private navCtrl: NavController) { }

  ipPrinters: string = '';

  messageToast: string = '';
  
  ngOnInit() {
  }
  backHome() {
     this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

  setImpressora(){
    localStorage.setItem('printers', this.ipPrinters)
    this.messageToast = 'Impressora salva com sucesso'
    this.setOpen(true)

    setTimeout(()=>{
       this.navCtrl.navigateForward('/home', { replaceUrl: true });
    }, 2000)
  }

  
  setOpen(bool: any) {
    this.isToastOpen = bool
  }

}
