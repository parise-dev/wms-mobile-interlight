import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';

@Component({
  selector: 'app-reprint',
  templateUrl: './reprint.component.html',
  styleUrls: ['./reprint.component.scss'],
})
export class ReprintComponent implements OnInit {

  ipPrinters: string = '';
  typeTag: string = '';
  volume: string = '';

  constructor(private navCtrl: NavController,
    private service: SapServiceService,
    private toast: ToastrService) { }

  ngOnInit() { }

  backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

  setImpressora() {

    var vol = this.formatVolumeCode(this.volume);

    var obj = {
      idPack: vol,
      ipPrinters: this.ipPrinters
    }

    this.service.printTag(obj).subscribe(() => {
      this.toast.success('Enviado para impressora.')
    })
  }

  formatVolumeCode(code: string): string {
    if (!code) return "";

    let cleaned = code.replace(/#/g, "").replace(/vol/gi, "");

    cleaned = cleaned.replace(/^0+/, "");

    return cleaned;
  }
}
