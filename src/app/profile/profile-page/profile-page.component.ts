import { Component } from '@angular/core';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';

@Component({
  selector: 'profile-page',
  imports: [OlMapDirective, OlMarkerDirective],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
 
}

//TODO implement profile data (if no id providen, show logged user's profile)
//TODO implement map with user's location
//TODO implement profile editing, one button for each element. Only if loged user's profile
//TODO links to event page filtering with: events created by user, events user is attending (user queryparams)