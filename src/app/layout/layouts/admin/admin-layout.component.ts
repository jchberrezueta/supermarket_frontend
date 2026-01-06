import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { 
  UiHeaderComponent, 
  UiSidebarComponent
} from '@shared/components/index';
import { UiLoadingComponent } from '@shared/components/loading/loading.component';
import { SidebarService } from '@shared/services/sidebar.service';

const IMPORTS = [
  UiHeaderComponent, 
  UiSidebarComponent, 
  RouterOutlet,
  UiLoadingComponent
]

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export default class AdminLayoutComponent {
  protected readonly _sidebarService = inject(SidebarService);

  constructor() {}
  
}