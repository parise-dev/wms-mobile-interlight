import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-empilhadeira',
  templateUrl: './empilhadeira.component.html',
  styleUrls: ['./empilhadeira.component.scss'],
})
export class EmpilhadeiraComponent  implements OnInit {

  constructor(private navCtrl: NavController, private modalService: NgbModal) { }

  ngOnInit() {}

   backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

   openModalDefault(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

}
