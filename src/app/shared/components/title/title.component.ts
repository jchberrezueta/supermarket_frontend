import { Component, inject, input } from '@angular/core';
import { UiButtonComponent } from "../button/button.component";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'ui-title',
  standalone: true,
  imports: [UiButtonComponent],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class UiTitleComponent {
  private _router = inject(Router);
  private _authService = inject(AuthService);

  public title = input.required<string>();
  private rutaActual: string = '';
  private rutaInsert: string = '';
  protected canInsert: boolean = false;


  constructor() {
    console.log('ui-title listo :)');
  }

  ngOnInit(): void {
    this.mostrarBotonAgregar();
  }

  protected mostrarBotonAgregar() {
    this.rutaActual = this.getSegmentsRoute().map(p => p).join('/');
    this.canInsert = this._authService.canInsert(this.rutaActual);
  }

  protected generateRouteInsert(segments:string[]) {
    segments.push('insert');
    this.rutaInsert = segments.map(p => p).join('/');
  }

  protected redirect(event:any){
    if(this.canInsert){
      this.generateRouteInsert(this.getSegmentsRoute());
      this._router.navigate([this.rutaInsert]);
    }
  }

  private getSegmentsRoute(): string[] {
    const segments = this._router.url.split('/');
    const posFinal = segments.length-1;
    if(segments[posFinal] === 'list'){
      segments.pop(); 
    }
    return segments;
  }

  public get getTitle(): string {
    return this.title();
  }
}
