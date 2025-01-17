import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'top-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css',
})
export class TopMenuComponent {
  title = 'SVTickets';
  #authService = inject(AuthService);

  logout() {
    this.#authService.logout();
  }
}
