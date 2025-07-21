import { Component, Input } from '@angular/core';
import { Empresa } from '@models/proveedores';
import { TableListComponent } from '@shared/components/index';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [TableListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export default class ListComponent {

  @Input() empresas: Empresa;



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
    console.log(this.empresas.email);
  }
}
