import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { CamerasPageRoutingModule } from './cameras-routing.module';

import { CamerasPage } from './cameras.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CamerasPageRoutingModule, ComponentsModule, TranslateModule],
  declarations: [CamerasPage],
})
export class CamerasPageModule {}
