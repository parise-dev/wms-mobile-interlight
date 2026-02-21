import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-uas',
  templateUrl: './uas.page.html',
  styleUrls: ['./uas.page.scss'],
})
export class UasPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

   backToHome() {
    this.navCtrl.navigateForward(`home`, { replaceUrl: true });
  }
}
