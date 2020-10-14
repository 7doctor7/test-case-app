import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportingPageRoutingModule } from './reporting-routing.module';

import { ReportingPage } from './reporting.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReportingPageRoutingModule, ComponentsModule],
  declarations: [ReportingPage],
})
export class ReportingPageModule {}
