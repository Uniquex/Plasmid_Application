import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-load-bar',
  templateUrl: './loadBar.component.html',
  styleUrls: ['./loadBar.component.scss']
})
export class LoadBarComponent implements OnInit {

  @Input() load = 10;
  @Input() usedSize = 0;
  @Input() size = 0;

  constructor() { }

  ngOnInit() {}

}
