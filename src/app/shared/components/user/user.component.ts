import { Component } from '@angular/core';

const options = [
  {
    label: 'Mi Cuenta'
  },
  {
    label: 'Cerrar Sesión'
  }
];

@Component({
  selector: 'ui-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UiUserComponent {
  protected genero: string = 'femenino';
  protected optionsList = options;
  protected open: boolean = false;
   
  constructor() {}

  protected toggle() {
    this.open = !this.open;
  }

  protected emitValue(event: any) {

  }
}