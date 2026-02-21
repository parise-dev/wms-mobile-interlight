import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService,
    private navCtrl: NavController
  ) { }

  canActivate(): any {
    if (this.auth.authenticated) {
      return true;
    } else {
       this.navCtrl.navigateForward('/signin', { replaceUrl: true });
    }
  }
}
