import {Component} from '@angular/core';

import {NavController} from '@ionic/angular';
import {APIService} from '../../services/api.service';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  // @ViewChild('pieCPU') pieCPU;

  constructor(
      private apiService: APIService,
      private settings: SettingsService,
      private navCtrl: NavController
  ) {}
  servers = [];

  getServers() {
    this.apiService.getServers().subscribe(response => {
      // @ts-ignore
      for (let x = 0; x < response.length; x++) {
        this.servers.push(response[x]);
      }
    });
  }


  ngOnInit() {
    this.settings.fetchSettings().then(() => {
      this.getServers();
    });
  }
}
