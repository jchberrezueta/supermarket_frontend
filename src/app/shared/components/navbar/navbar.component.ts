import { Component } from '@angular/core';
import { UiUserComponent } from "../user/user.component";

@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [UiUserComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class UiNavbarComponent {

}
