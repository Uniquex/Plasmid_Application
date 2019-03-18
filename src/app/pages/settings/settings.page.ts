import {Component, Injectable, ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})

@Injectable()
export class SettingsPage {
  @ViewChild('ApiIP') url;

    constructor(private storage: Storage, private auth: AuthService) {
  }
  ionViewWillEnter() {
    this.url.value = environment.url;
  }

  ionViewWillLeave() {
    // this.storage.set('API_IP', this.ip.value);
    // this.storage.set('API_Port', this.port.value);
    environment.url = this.url.value;
  }

    logout() {
        this.auth.logout();
    }
}
