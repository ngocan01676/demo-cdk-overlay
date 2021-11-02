import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PtMenuTriggerDirective } from './pt-menu-trigger.directive';
import {OverlayModule} from '@angular/cdk/overlay';
import {MatButtonModule} from '@angular/material/button';
import { PtMenuComponent } from './pt-menu/pt-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    PtMenuTriggerDirective,
    PtMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OverlayModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
