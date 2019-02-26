import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {APIService} from '../../services/api.service';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.page.html',
    styleUrls: ['./details.page.scss'],
})

export class DetailsPage implements OnInit {
    pTitle;
    pInterfaces: Observable<Array<any>>;
    pDetails = {
        'host': undefined,
        'timestamp': undefined,
        'system': {
            'system': undefined,
            'system_alias': undefined,
            'release': undefined,
            'machine': undefined,
            'version': undefined
        },
        'cpu': {
            'cpu_cores': undefined,
            'cpu_freq': undefined,
            'cpu_load': undefined,
            'cpu_temp': undefined
        },
        'memory': {
            'memory_size': undefined,
            'memory_load': undefined
        },
        'disk': {
            'disk_total': undefined,
            'disk_free': undefined,
            'disk_used': undefined,
            'disk_percent': undefined
        },
        'network': undefined
    };

    constructor(private route: ActivatedRoute, private apiService: APIService, private authService: AuthService) {
    }

    ngOnInit() {
        this.pTitle = this.route.snapshot.paramMap.get('hostname');
        // this.apiService.getServerDetailsMD(this.pTitle).then((response) => {
        //     console.log(response);
        //     this.pDetails = JSON.parse(response.body.toString());
        //     // @ts-ignore
        //     const nw = this.pDetails.network;
        //     const interfaces = [];
        //     for (let key in this.pDetails.network) {
        //         console.log(key);
        //         console.log(nw[key]);
        //         interfaces.push({
        //             'interface': key,
        //             'address': nw[key][0][1],
        //             'gateway': nw[key][0][2]
        //         });
        //     }
        //     // @ts-ignore
        //     this.pInterfaces = interfaces;
        //
        //     console.log(this.pDetails);
        //     console.log(this.pInterfaces);
        // });

        this.authService.getServerDetails(this.pTitle).subscribe(res => {
            console.log(res);
            // @ts-ignore
            this.pDetails = res;
            // @ts-ignore
            const nw = this.pDetails.network;
            const interfaces = [];
            for (let key in this.pDetails.network) {
                console.log(key);
                console.log(nw[key]);
                interfaces.push({
                    'interface': key,
                    'address': nw[key][0][1],
                    'gateway': nw[key][0][2]
                });
            }
            // @ts-ignore
            this.pInterfaces = interfaces;

            console.log(this.pDetails);
            console.log(this.pInterfaces);
        });
    }

    incrementLoadBar() {
        this.pDetails.disk.disk_percent += 10;
    }
}
