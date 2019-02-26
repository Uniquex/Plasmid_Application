import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {SettingsService} from './settings.service';
import {promise} from 'selenium-webdriver';

@Injectable({
    providedIn: 'root'
})
export class APIService {
    constructor(private http: HttpClient, private storage: Storage, private settings: SettingsService) {
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

    getCPULoad(time) {
        let query;
        if (time !== -1 && time !== undefined) {
            query = 'SELECT "CPU_Usage" FROM "RPI"."autogen"."server_load_short" WHERE time > now() - ' + time + 'h';
        } else {
            query = 'SELECT "CPU_Usage" FROM "RPI"."autogen"."server_load_short"';
        }
        return new Promise((resolve, reject) => {
            this.makeRequest(query).then((prom) => {
                resolve(prom);
            });
        });
    }

    getMemoryLoad(time) {
        const url = 'SELECT "RAM_Usage" FROM "RPI"."autogen"."server_load_short" WHERE time > now() - ' + time + 'h';

        return new Promise((resolve, reject) => {
            this.makeRequest(url).then((prom) => {
                resolve(prom);
            });
        });
    }

    getTraces(time) {
        let query1, query2;
        if (time !== -1 && time !== undefined) {
            query1 = 'SELECT "CPU_Usage" FROM "RPI"."autogen"."server_load_short" WHERE time > now() - ' + time + 'h';
            query2 = 'SELECT "RAM_Usage" FROM "RPI"."autogen"."server_load_short" WHERE time > now() - ' + time + 'h';
        } else {
            query1 = 'SELECT "CPU_Usage" FROM "RPI"."autogen"."server_load_short"';
            query2 = 'SELECT "RAM_Usage" FROM "RPI"."autogen"."server_load_short"';
        }
        return new Promise((resolve, reject) => {
            let trace1, trace2;
            this.makeRequest(query1).then((res1) => {
                trace1 = this.convertToTrace(res1, 'CPU');
                this.makeRequest(query2).then((res2) => {
                    trace2 = this.convertToTrace(res2, 'RAM');
                    resolve([trace1, trace2]);
                });
            });
        });
    }

    convertToTrace(response, name) {
        const x = response.body.results[0];
        const y = x.series[0];
        const columns = y.columns;
        const values = y.values;
        const datay = [];
        const datax = [];
        for (let i = 0; i < values.length; i++) {
            datax[i] = values[i][0];
            datay[i] = values[i][1];
        }
        const trace = {
            x: datax,
            y: datay,
            type: 'scatter',
            name: name
        };
        return trace;
    }

    getCPULoadAsTrace(time) {
        return new Promise((resolve, reject) => {
            this.getCPULoad(time).then(response => {
                // @ts-ignore
                const x = response.body.results[0];
                const y = x.series[0];
                const columns = y.columns;
                const values = y.values;
                const datay = [];
                const datax = [];
                for (let i = 0; i < values.length; i++) {
                    datax[i] = values[i][0];
                    datay[i] = values[i][1];
                }
                const trace = {
                    x: datax,
                    y: datay,
                    type: 'scatter'
                };
                resolve(trace);
            });
        });
    }

    getProcesses() {
        const query = 'SHOW TAG VALUES ON "RPI" FROM "process_list" WITH KEY = "pName"';
        return new Promise((resolve, reject) => {
            this.makeRequest(query).then((prom) => {
                resolve(prom);
            });
        });

    }

    getProcessDetails(first, time, pname) {
        const process = pname;
        if (first) {
            return new Promise((resolve, reject) => {
                const query = 'SELECT pCPU, pMemory FROM "RPI"."autogen"."process_list" where "pName"=\'' + process + '\' ORDER BY DESC LIMIT 1';
                this.makeRequest(query).then((prom) => {
                    resolve(prom);
                });
            });
        } else {
            const query = 'SELECT pCPU, pMemory FROM "RPI"."autogen"."process_list" where "pName"=\'' + pname + '\' and time = ' + time;
            return new Promise((resolve, reject) => {
                this.makeRequest(query).then((prom) => {
                    resolve(prom);
                });
            });
        }

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

    getServerDetailsMD(name) {
        const url = 'http://192.168.31.103:5000/server/' + name;
        return this.http.get(url, {
            params: {},
            observe: 'response'
        }).toPromise();
}

// getPredictionValues() {
//   const query = 'SELECT CPU_Usage , RAM_Usage FROM \"RPI\".\"autogen\".\"server_load_short\"';
//   return new Promise((resolve, reject) => {
//     this.makeRequest(query).then((prom) => {
//       // @ts-ignore
//       resolve(prom.body.results[0].series[0]);
//     });
//   });
// }
}
