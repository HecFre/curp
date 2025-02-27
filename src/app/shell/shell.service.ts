import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Route, Routes } from '@angular/router';
import { ShellComponent } from './shell.component';

/**
 * Provides helper methods to create routes.
 */
export class Shell {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: 'tabs',
      component: ShellComponent,
      children: routes,
      canActivate: [AngularFireAuthGuard],
      data: {
        authGuardPipe: () => redirectUnauthorizedTo(`login?continue=${location.pathname}`),
      },
    };
  }
}
