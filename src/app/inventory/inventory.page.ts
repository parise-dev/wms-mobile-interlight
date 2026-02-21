import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

     backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }


}
