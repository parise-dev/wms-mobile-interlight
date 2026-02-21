import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  authenticated: boolean = true;

  constructor(private store: LocalStoreService, private navCtrl: NavController, private router: Router) {
    this.checkAuth();
  }

  checkAuth() {
    this.authenticated = this.store.getItem("status");
 }

  signin() {
    this.authenticated = true;
    this.store.setItem("status", true);

    this.navCtrl.navigateForward('/home', { replaceUrl: true });
    return of({});
  }

  signout() {
    this.authenticated = false;
    this.store.setItem("status", false);
    localStorage.clear()
    this.navCtrl.navigateForward('/signin', { replaceUrl: true });
  }

 

}
