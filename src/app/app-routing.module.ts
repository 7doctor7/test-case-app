import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from './services/auth-guard/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cameras',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'cameras',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/cameras/cameras.module').then(m => m.CamerasPageModule),
  },
  {
    path: 'reporting',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/reporting/reporting.module').then(m => m.ReportingPageModule),
  },
  {
    path: 'settings',
    canActivate: [AuthGuardService],
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
