import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.page.html',
  styleUrls: ['./packing-list.page.scss'],
})
export class PackingListPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

   backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

}
