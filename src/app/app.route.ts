import { Route } from '@angular/router';
import { HeaderComponent } from './admin/header/header.component';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: HeaderComponent,
    loadChildren: () =>
      import('./admin/admin.route').then((m) => m.ADMIN_ROUTE),
  },
];
