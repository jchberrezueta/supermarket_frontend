import { Component } from '@angular/core';
import { UiNavbarComponent } from "../navbar/navbar.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';

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
  protected sidebarOpen: boolean = false;

  constructor() {}

  protected toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}