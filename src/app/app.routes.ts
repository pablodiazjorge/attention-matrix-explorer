import { Routes } from '@angular/router';
import { MatrixViewerComponent } from './features/matrix-viewer/matrix-viewer.component';

export const routes: Routes = [
  { path: '', component: MatrixViewerComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
