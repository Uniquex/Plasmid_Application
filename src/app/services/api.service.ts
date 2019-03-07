import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {SettingsService} from './settings.service';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AlertController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class APIService {

    url = environment.url;

    constructor(
        private http: HttpClient,
        private storage: Storage,
        private settings: SettingsService,
        private alertController: AlertController) {
    }

    showAlert(msg) {
        let alert = this.alertController.create({
            message: msg,
            header: 'Error',
            buttons: ['OK']
        });
        alert.then(alert => alert.present());
    }
    getCPULoadNew(hostname, time) {
        if (time === -1) {
            return this.http.get(`${this.url}/server/${hostname}/cpuLoad`).pipe(
                catchError(e => {
                    const status = e.status;
                    if (status === 401) {
                        this.showAlert('You are not authorized for this!');
                    }
                    throw new Error(e);
                })
            );
        } else {
            return this.http.get(`${this.url}/server/${hostname}/cpuLoad/${time}`).pipe(
                catchError(e => {
                    const status = e.status;
                    if (status === 401) {
                        this.showAlert('You are not authorized for this!');
                    }
                    throw new Error(e);
                })
            );
        }
    }
    getProcesses(hostname) {
        return this.http.get(`${this.url}/server/${hostname}/processes`).pipe(
            catchError(e => {
                const status = e.status;
                if (status === 401) {
                    this.showAlert('You are not authorized for this!');
                }
                throw new Error(e);
            })
        );
    }
    getServers() {
        return this.http.get(`${this.url}/servers`).pipe(
            catchError(e => {
                const status = e.status;
                if (status === 401) {
                    this.showAlert('You are not authorized for this!');
                }
                throw new Error(e);
            })
        );
    }
}
