import { Routes } from '@angular/router';
import { SpotList } from './components/spot-list/spot-list';
import { SpotMap } from './components/spot-map/spot-map';
import { SpotForm } from './components/spot-form/spot-form';
import { SpotDetail } from './components/spot-detail/spot-detail';

export const routes: Routes = [
  { path: 'spots/create', component: SpotForm },
  { path: 'spots/:id/edit', component: SpotForm },
  { path: 'spots/:id', component: SpotDetail },
  { path: 'spots', component: SpotList },
  { path: 'map', component: SpotMap },
  { path: '', redirectTo: '/spots', pathMatch: 'full' }
];