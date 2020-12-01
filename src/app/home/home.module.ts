import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { CoronaDataService } from '../services/corona-data.service';
import { HttpClientModule } from '@angular/common/http';
import { SuperTabsModule } from '@ionic-super-tabs/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SuperTabsModule,
    ReactiveFormsModule,
  ],
  providers: [
    HttpClientModule,
    CoronaDataService
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
