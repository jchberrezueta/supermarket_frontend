import { Component, inject } from '@angular/core';
import { UiNavbarComponent } from "../navbar/navbar.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { SidebarService } from '@shared/services/sidebar.service';
import { Router } from '@angular/router';

const IMPORTS = [
  UiNavbarComponent, 
  MatButtonModule, 
  MatIconModule
];

@Component({
  selector: 'ui-header',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class UiHeaderComponent {
  protected readonly _sidebarService = inject(SidebarService);
  private readonly _router = inject(Router);
  
  constructor() {}

  protected toggleSidebar() {
    this._sidebarService.toggle();
  }

  protected redirectHome() {
    this._router.navigate(['/admin']);
  }
}