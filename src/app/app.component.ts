import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.setTheme();
  }

  setTheme() {  
    document.body.setAttribute('color-theme', 'light');
  }
}
