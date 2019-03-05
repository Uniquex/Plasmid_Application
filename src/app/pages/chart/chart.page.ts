import {Component, OnInit, ViewChild} from '@angular/core';


import * as Plotly from 'plotly.js-basic-dist';
import {ActivatedRoute} from '@angular/router';
import {interval, Subscription} from 'rxjs';
import {APIService} from '../../services/api.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
})
export class ChartPage implements OnInit {

  @ViewChild('graphContainer') graphContainer;
  interval;

  dropdownOptions = ['1h', '2h', '4h', '1d', '1w', '1m', 'all'];

  pTimeFrame;
  subscription: Subscription;
  pTitle;
  pTraces;

  constructor(
      private api: APIService,
      private route: ActivatedRoute) {
  }

  getTraces(data) {
    const columns = data.series[0].columns;
    data = data.series[0];
    const traces = [];
    for (let z = 1; z < columns.length; z++) {
      console.log();
      const values = data.values;
      const datay = [];
      const datax = [];
      for (let i = 0; i < values.length; i++) {
        datax[i] = values[i][0];
        datay[i] = values[i][z];
      }
      const trace = {
        x: datax,
        y: datay,
        name: columns[z],
        type: 'scatter'
      };
      traces.push(trace);
    }

    console.log(traces);
    return traces;
  }


  setGraphContainerData(trace1, trace2) {

    this.pTraces = [trace1, trace2];

    const layout = {
      yaxis: {range: [0, 100]}
    };
    // @ts-ignore
    Plotly.newPlot(this.graphContainer.nativeElement, this.pTraces, layout);
    // .then(
    // html => {
    //     this.setOnClickListener(html);
    // });
  }

  setPageData() {
    this.api.getCPULoadNew(this.pTitle, 2).subscribe(
        response => {
          console.log(response);
          const traces = this.getTraces(response);
          this.setGraphContainerData(traces[0], traces[1]);
        },
        response => {
          console.log('No connection');
          console.log(response);
        }
    );
  }

  setOnClickListener(html) {
    html.on('plotly_click', function (data) {
      let pts = '';
      for (let i = 0; i < data.points.length; i++) {
        pts = 'x = ' + data.points[i].x + '\ny = ' +
            data.points[i].y.toPrecision(4) + '\n\n';
      }
      console.log('Closest point clicked:\n\n' + pts);
    });
  }

  rebuildGraph() {
    let timeframe = 2;

    const layout = {
      yaxis: {range: [0, 100]}
    };

    // @ts-ignore
    console.log('pDropdownValue' + this.pTimeFrame);
    if (this.pTimeFrame !== undefined) {
      switch (this.pTimeFrame) {
        case('1h'): {
          timeframe = 1;
          break;
        }
        case('2h'): {
          timeframe = 2;
          break;
        }
        case('4h'): {
          timeframe = 4;
          break;
        }
        case('1d'): {
          timeframe = 24;
          break;
        }
        case('1w'): {
          timeframe = 168;
          break;
        }
        case('1m'): {
          timeframe = 744;
          break;
        }
        case('all'): {
          timeframe = -1;
          break;
        }
        default: {
          timeframe = 2;
        }
      }
    }
    this.api.getCPULoadNew(this.pTitle, timeframe).subscribe((result) => {
      Plotly.newPlot(this.graphContainer.nativeElement, this.getTraces(result), layout);
    });
  }

  ngOnInit() {
    this.pTitle = this.route.snapshot.paramMap.get('hostname');
    this.rebuildGraph();

    //  sequence every 60 second
    const source = interval(60000);
    this.subscription = source.subscribe(val => this.rebuildGraph());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ionViewWillLeave() {
    console.log('clearing interval');
    window.clearInterval(this.interval);
    this.subscription.unsubscribe();

  }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  ionViewDidEnter() {
    // this.androidFullScreen.isImmersiveModeSupported()
    //     .then(() => this.androidFullScreen.immersiveMode());
  }
}
