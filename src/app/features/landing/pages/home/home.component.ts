import { Component } from '@angular/core';
import {TableListComponent} from '@shared/components/table-list/table-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent {
  datasource = [
    {primero: "uno", segundo: "dos", tercero: "tres"},
    {primero: "cuatro", segundo: "cinco", tercero: "seis"},
    {primero: "siete", segundo: "ocho", tercero: "nueve"},
    {primero: "diez", segundo: "once", tercero: "doce"},
    {primero: "trece", segundo: "catorce", tercero: "quince"},
    {primero: "dieciseis", segundo: "diecisiete", tercero: "dieciocho"},
    {primero: "diecinueve", segundo: "veinte", tercero: "veintiuno"},
    {primero: "veintidos", segundo: "veintitres", tercero: "veinticuatro"},
    {primero: "veinticinco", segundo: "veintiseis", tercero: "veintesiete"},
  ];
  columnas = [
    {def: "primero", header: "columna1", cell: (row:any) => row.primero},
    {def: "segundo", header: "columna2", cell: (row:any) => row.segundo},
    {def: "tercero", header: "columna3", cell: (row:any) => row.tercero}
  ];


  imprimir(event: any): void{
    console.log(event);
  }
}

export interface columnaFormat{
  primero: string;
  segundo: string;
  tercero: string;
}
