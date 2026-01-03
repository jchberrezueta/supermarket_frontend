import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IBreadcumb } from '@shared/models/breadcumb.model';

@Component({
  selector: 'ui-breadcumbs',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './breadcumbs.component.html',
  styleUrl: './breadcumbs.component.scss'
})
export class UiBreadcumbsComponent {
  public breadcumbs = input.required<IBreadcumb[]>();
  private readonly _router = inject(Router);

  public navigateToUrl(url?: string){
    if(url) this._router.navigate([url]);
  }
}
