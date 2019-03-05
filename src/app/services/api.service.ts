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

    getAPIUrl(): Promise<string> {
        const settings = this.settings;
        return new Promise<string>(function (resolve, reject) {
            if (settings.API_Port === undefined || settings.API_IP === undefined) {
                settings.fetchSettings().then(() => {
                    resolve(('http://' + settings.API_IP + ':' + settings.API_Port + '/query'));
                });
            } else {
                resolve(('http://' + settings.API_IP + ':' + settings.API_Port + '/query'));
            }
        });
    }

    makeRequest(query) {
        return new Promise((resolve, reject) => {
            this.getAPIUrl().then((url) => {
                resolve(this.http.get(url, {
                    params: {
                        db: 'RPI',
                        q: query
                    },
                    observe: 'response'
                }).toPromise());
            });
        });
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
        const query = 'SHOW TAG VALUES ON "RPI" FROM "server" WITH KEY = "host"';
        return new Promise((resolve, reject) => {
            this.makeRequest(query).then((prom) => {
                resolve(prom);
            });
        });
    }

    getServerDetails(name) {
        const query = 'SELECT * FROM "RPI"."autogen"."server" WHERE host = \'' + name + '\'';
        return new Promise((resolve, reject) => {
            this.makeRequest(query).then((prom) => {
                resolve(prom);
            });
        });
    }
}
