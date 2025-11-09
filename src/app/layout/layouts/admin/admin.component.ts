import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { 
  UiHeaderComponent, 
  UiSidebarComponent
} from '@shared/components/index';

const IMPORTS = [
  UiHeaderComponent, 
  UiSidebarComponent, 
  RouterOutlet,
]

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export default class AdminComponent {

}
