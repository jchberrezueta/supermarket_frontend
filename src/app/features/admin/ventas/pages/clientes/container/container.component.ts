import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { UiBreadcumbsComponent } from '@shared/components/breadcumbs/breadcumbs.component';
import { IBreadcumb } from '@shared/models/breadcumb.model';
import { UiTitleComponent } from "@shared/components/title/title.component";
import { filter } from 'rxjs';


const breadcumbs = [
  {
    label: 'Dashboard',
    url: '/admin'
  },
  {
    label: 'Modulo Ventas',
  },
  {
    label: 'Clientes',
    url: '/admin/ventas/clientes'
  }
];

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [RouterOutlet, UiBreadcumbsComponent, UiTitleComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export default class containerComponent {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  protected readonly title: string = 'Listado Clientes';
  public breadcumbs: IBreadcumb[] = breadcumbs;
  protected showAddButton = false;

  ngOnInit(): void {
    this._router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        let r: ActivatedRoute | null = this._route;
        while (r?.firstChild) r = r.firstChild;
        this.showAddButton = !!r?.snapshot.data?.['showAddButton'];
      });

    let r: ActivatedRoute | null = this._route;
    while (r?.firstChild) r = r.firstChild;
    this.showAddButton = !!r?.snapshot.data?.['showAddButton'];
  }
}
