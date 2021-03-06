import { Subject } from 'rxjs';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pt-menu',
  templateUrl: './pt-menu.component.html',
  styleUrls: ['./pt-menu.component.scss']
})
export class PtMenuComponent implements OnInit {

  readonly visible$ = new Subject<boolean>();
  @ViewChild(TemplateRef,{static: true}) menuTemplate: TemplateRef<any>;
  constructor() { }

  ngOnInit(): void {
  }

}
