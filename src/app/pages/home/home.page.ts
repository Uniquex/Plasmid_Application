import {Component, ViewChild} from '@angular/core';

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
    this.apiService.getServers().then(response => {
      // @ts-ignore
      const sList = response.body.results[0].series[0].values;
      for (let x = 0; x < sList.length; x++) {
        this.apiService.getServerDetails(sList[x][1]).then(response2 => {
          const obj = {};
          // @ts-ignore
          const iList = response2.body.results[0].series[0];
          for (let y = 0; y < iList.columns.length; y++) {
            obj[iList.columns[y]] = iList.values[0][y];
          }
          this.servers.push(obj);
        });
      }
    });
  }


  ngOnInit() {
    this.settings.fetchSettings().then(() => {
      this.getServers();
    });
  }
}
