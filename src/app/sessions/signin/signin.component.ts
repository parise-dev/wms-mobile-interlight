import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AwsService } from 'src/app/shared/services/aws.service';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  loading: boolean = false;
  loadingText: string = 'Entrar';

  signinForm: FormGroup = this.fb.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router,
    private navCtrl: NavController,
    //rivate service: SapServiceService,
    private service: AwsService,
    private auth: AuthService
  ) {}

  ngOnInit() {
  
  }
  
  /*signin() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
    this.loading = false;
    this.loadingText = 'Entrar';
    this.auth.signin().subscribe(() => {});
  }*/
 
  signin() {

    this.spinner.show();

    let login:  any = {
                allowAccess: 'Y',
                userProfile: 'Admin',
                email: 'lucas',
                sessionId: '1234-32322-13223-1233-32334',
                slpCode: '149',
                slpName: 'Lucas'
                }

                localStorage.setItem('authorize', JSON.stringify(login));

                 localStorage.setItem(
          'slpCode',
          login.slpCode == 0 ? 'all' : login.slpCode.toString()
        );
        this.navCtrl.navigateForward('/home', { replaceUrl: true });
        this.loading = false;
        this.loadingText = 'Entrar';
        
        this.spinner.hide();

        this.auth.signin().subscribe(() => {});

        /*

    this.service.postLogin(this.signinForm.value).subscribe(
      (d: any) => {
        if (d.allowAccess == 'N') {
          alert(
            "Você não tem acesso ao WMS, solicite ao time de tecnologia autorização','Não autorizado"
          );
          return;
        }

        localStorage.setItem('authorize', JSON.stringify(d));
        localStorage.setItem(
          'slpCode',
          d.slpCode == 0 ? 'all' : d.slpCode.toString()
        );
        this.navCtrl.navigateForward('/home', { replaceUrl: true });
        this.loading = false;
        this.loadingText = 'Entrar';
        
        this.spinner.hide();

        this.auth.signin().subscribe(() => {});
      },
      (e) => {
        this.spinner.hide();
        this.auth.signout();
      }
    ); */
  }
  
  isToastOpen = false;

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
