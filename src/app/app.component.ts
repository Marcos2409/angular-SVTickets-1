import { Component } from '@angular/core';
import { TopMenuComponent } from './shared/top-menu/top-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-root',
    imports: [RouterOutlet, TopMenuComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {

}
