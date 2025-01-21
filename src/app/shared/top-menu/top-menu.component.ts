import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'top-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css',
})
export class TopMenuComponent {
  title = 'SVTickets';
  #authService = inject(AuthService);
  #router = inject(Router);
  loggedCheck = computed(() => { return this.#authService.getLogged() });

  logout() {
    this.#authService.logout();
    this.#router.navigate(['/auth/login']);
  }
}
