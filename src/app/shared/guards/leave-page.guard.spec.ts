import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from './leave-page.guard';

export const leavePageGuard: CanDeactivateFn<CanComponentDeactivate> = () => {
  return confirm('¿Quieres abandonar la página?. Los cambios se perderán...');
};
