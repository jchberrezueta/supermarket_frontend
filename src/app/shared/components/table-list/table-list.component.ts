import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  input,
  signal,
  output,
  SimpleChanges,
  viewChild,
  inject
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RestService } from '@core/services/rest.service';
import { ITableColumn } from '@shared/models/table_column.model';
import { SelectionModel } from '@angular/cdk/collections';
import {DashIfEmptyPipe} from '@shared/pipes/dashIfEmpty.pipe'
import { UiButtonComponent } from "../button/button.component";
import { Router } from "@angular/router";
import { AuthService } from '@core/services/auth.service';

import Swal from 'sweetalert2'

const IMPORTS = [
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatCheckboxModule,
  UiButtonComponent,
  DashIfEmptyPipe,
  CommonModule
];

@Component({
  selector: 'ui-table-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class UiTableListComponent implements OnInit {
  public serviceApi = input.required<string>();
  public columns = input.required<ITableColumn[]>();
  public message = input<string>('!No tiene registros generados¡');
  public isSelection = input<boolean>(false);
  private data = signal<any[]>([]);
  protected matDatasource = new MatTableDataSource<any>();
  
  public selection!: SelectionModel<any>;

  public onSelectRow = output<any>();
  public rowClickAction = output<any>();

  public resultsLength = signal(0);
  public displayedColumns = signal<string[]>([]);

  private readonly _restService = inject(RestService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  
  private readonly _matSort = viewChild(MatSort);
  private readonly _matPaginator = viewChild(MatPaginator);

  private rutaActual: string = '';
  private rutaUpdate: string = '';
  private rutaDetails: string = '';
  protected canUpdate: boolean = false;
  protected canDelete: boolean = false;
  protected canList: boolean = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnInit() {
    this.selection = new SelectionModel<any>(this.isSelection(), []);
    this.loadColumns();
    this.requestData(this.serviceApi())
    this.hasPermissionsUD();
  }

  private requestData(ruta: string) {
    this._restService.get<any>(ruta).subscribe(
      (res) => {
        this.data.set(res.data);
        this.matDatasource.data = this.data();
        this.resultsLength.set(this.matDatasource.data.length);

        const s = this._matSort();
        const p = this._matPaginator();
        if (s) this.matDatasource.sort = s;
        if (p) this.matDatasource.paginator = p;
      }
    );
  }

  public filterData(params: URLSearchParams) {
    this.requestData(this.serviceApi()+`/filtrar?${params.toString()}`);
  }

  private loadColumns() {
    this.displayedColumns.set(
      this.columns()
        .filter((column) => !column.visible)
        .map((column) => column.property),
    );
    if (this.isSelection()) this.displayedColumns().unshift('check');
  }

  public emitClickAction(action: string, row: any): void {
    this.rowClickAction.emit({ action, row });
  }

  public selectItem(row: any): void {
    if (!this.selection.isSelected(row)) {
      this.selection.select(row);
      this.onSelectRow.emit(row);
    }
  }

  public toggleAllRows() {
    if (!this.isAllSelected()) {
      this.selection.select(...this.matDatasource.data);
    } else {
      this.selection.clear();
    }
  }

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.matDatasource.data.length;
    return numSelected === numRows;
  }

  public checkBoxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  protected hasPermissionsUD() {
    this.rutaActual = this.getSegmentsRoute().map(p => p).join('/');
    this.canUpdate = this._authService.canUpdate(this.rutaActual);
    this.canDelete = this._authService.canDelete(this.rutaActual);
    this.canList = this._authService.canList(this.rutaActual);
  }

  protected redirectUD(clickAction: string, id:number) {
    if(clickAction === 'update' && this.canUpdate){
      this.generateUpdateRoute(this.getSegmentsRoute(), id);
      this._router.navigate([this.rutaUpdate]);
    }
    else if(clickAction === 'delete' && this.canDelete){
      Swal.fire({
        title: "Esta seguro de eliminar este elemento?",
        text: "No se podra revertir esta accion!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!"
      }).then((result) => {
        if (result.isConfirmed) {
          this._restService.delete<any>(this.serviceApi()+`/eliminar/${id}`).subscribe(
            (res) => {
              Swal.fire({
                title: "Eliminado Exitosamente!",
                text: "El elemento ha sido eliminado",
                icon: "success"
              });
              this.requestData(this.serviceApi());
            }
          );
          
        }
      });
    }
  }

  protected viewDetails(clickAction: string, id:number) {
    if(clickAction === 'details' && this.canList){
      this.generateDetailsRoute(this.getSegmentsRoute(), id);
      this._router.navigate([this.rutaUpdate]);
    }
  }

  protected redirectToUrl(clickAction: string, url:string='') {
    this._router.navigate([url]);
  }

  private generateUpdateRoute(segments: string[], id: number) {
    segments.push('update');
    segments.push(id+'');
    this.rutaUpdate = segments.map(p => p).join('/');
  }

    private generateDetailsRoute(segments: string[], id: number) {
    segments.push('details');
    segments.push(id+'');
    this.rutaDetails = segments.map(p => p).join('/');
  }

  private getSegmentsRoute(): string[] {
    const segments = this._router.url.split('/');
    const posFinal = segments.length-1;
    if(segments[posFinal] === 'list'){
      segments.pop();
    }
    return segments;
  }

}