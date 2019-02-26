import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public API_IP;
  public API_Port;

  constructor(private storage: Storage) {}

  fetchSettings() {
    return new Promise((resolve => {
      this.storage.get('API_IP').then(result => {
        this.API_IP = result;
        this.storage.get('API_Port').then(result2 => {
          this.API_Port = result2;
          console.log(this.API_IP + ':' + this.API_Port);
          resolve();
        });
      });
    }));
  }
}
