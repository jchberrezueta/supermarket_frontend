import { Component } from '@angular/core';
import { HeaderComponent, FooterComponent, UiSidebarComponent} from '@shared/components/index';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, UiSidebarComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export default class AdminComponent {

}
