import { Route } from '@angular/router';
import { navigationConfig } from './navigation.config';

const appTitle: string = 'Agreement Management';

export const appRoutes: Route[] = [
    {
      path: '',
      loadComponent: () => import('@org/featureComponents').then((m) => m.LayoutComponent),
      data: {
        appTitle: appTitle,
        mainNavigation: navigationConfig
      },
      children: [
        {
          path: 'create',
          loadComponent: () => import('lib/featureComponents/src/lib/shared/association/create/association.component').then(m => m.AssociationComponent)
        },
        {
          path: 'delete',
          loadComponent: () => import('lib/featureComponents/src/lib/shared/association/delete/association-delete.component').then(m => m.AssociationDeleteComponent)
        },
        {
          path: 'number',
          loadComponent: () => import('lib/featureComponents/src/lib/shared/my-number/my-number.component').then(m => m.MyNumberComponent)
        }
      ]
    }
]

