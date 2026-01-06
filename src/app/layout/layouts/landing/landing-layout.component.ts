import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './landing-layout.component.html',
  styleUrls: ['./landing-layout.component.scss']
})
export default class LandingLayoutComponent {}
