import { Component, OnInit } from '@angular/core';
import { Pack } from '../models/sales-orders-list';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SapServiceService } from '../shared/services/sap-service.service';
import { ReserveV1Documents } from '../models/uas';

@Component({
  selector: 'app-reverse',
  templateUrl: './reverse.page.html',
  styleUrls: ['./reverse.page.scss'],
})
export class ReversePage implements OnInit {

  pack: Pack[] = [];
  
  volumeBip: string = '';
  isToastOpen: boolean = false;
  documents: ReserveV1Documents[] = [];
  messageToast: string = 'Carregando... '

  constructor(private router: Router, private navCtrl: NavController, private service: SapServiceService){

  }

  ngOnInit() {
    this.service.getAllReverseByDocNum().subscribe((data)=>{
      this.documents = data
    })
  }

  setOpen(bool: any) {
    this.isToastOpen = bool
  }

  backHome(){
   this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

  reload(){
    
  }
}
