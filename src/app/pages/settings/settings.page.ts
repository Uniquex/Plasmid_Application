import {Component, Injectable, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})

@Injectable()
export class SettingsPage {
  @ViewChild('ApiIP') ip;
  @ViewChild('ApiPort') port;

    constructor(private storage: Storage, private auth: AuthService) {
  }
  ionViewWillEnter() {
    this.storage.get('API_IP').then( val => {
      this.ip.value = val;
      console.log('Setting ip to ' + val);
    });
    this.storage.get('API_Port').then( val => {
      this.port.value = val;
      console.log('Setting port to ' + val);
    });
  }

  ionViewWillLeave() {
    this.storage.set('API_IP', this.ip.value);
    this.storage.set('API_Port', this.port.value);
    console.log('Setting api ip to ' + this.ip.value);
    console.log('Setting api port to ' + this.port.value);
  }

    logout() {
        this.auth.logout();
    }
}
