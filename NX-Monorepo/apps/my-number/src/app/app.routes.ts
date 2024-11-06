import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'number',
    loadComponent: () => import('lib/featureComponents/src/lib/shared/my-number/my-number.component').then(m => m.MyNumberComponent)
  },
];
