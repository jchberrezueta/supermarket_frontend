import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  input,
  signal,
  output,
  SimpleChanges,
  viewChild,
  inject
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RestService } from '@core/services/rest.service';
import { IQueryParams } from '@shared/models/query_param.model';
import { ITableColumn } from '@shared/models/table_column.model';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import {DashIfEmptyPipe} from '@shared/pipes/dashIfEmpty.pipe'
import { UiButtonComponent } from "../button/button.component";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '@core/services/auth.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'ui-table-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    CommonModule,
    DashIfEmptyPipe,
    UiButtonComponent,
],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class UiTableListComponent implements OnInit {
  
  private data = signal<any[]>([]);
  protected matDatasource = new MatTableDataSource<any>();
  public columns = input.required<ITableColumn[]>();
  public serviceApi = input.required<string>();
  public message = input<string>('!No tiene registros generados¡');
  public isSelection = input<boolean>(false);
  public selection!: SelectionModel<any>;

  public onSelectRow = output<any>();
  public rowClickAction = output<any>();

  public resultsLength = signal(0);
  public displayedColumns = signal<string[]>([])

  private readonly _restService = inject(RestService);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  
  private readonly _matSort = viewChild(MatSort);
  private readonly _matPaginator = viewChild(MatPaginator);

  private rutaActual: string = '';
  private rutaUpdate: string = '';
  protected canUpdate: boolean = false;
  protected canDelete: boolean = false;

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

  public selectItem(item: any): void {
    if (!this.selection.isSelected(item)) {
      this.selection.select(item);
      this.onSelectRow.emit(item);
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

  public filterData(params: any[]) {
    this.requestData(this.serviceApi()+`/filtrar?${params.toString()}`);
  }

  protected hasPermissionsUD() {
      this.rutaActual = this.getSegmentsRoute().map(p => p).join('/');
      this.canUpdate = this._authService.canUpdate(this.rutaActual);
      this.canDelete = this._authService.canDelete(this.rutaActual);
  }

  protected redirectUD(clickAction: string, listaIds:number[]) {
    if(clickAction === 'update'){
      this.generateUpdateRoute(this.getSegmentsRoute(), listaIds[0]);
      this._router.navigate([this.rutaUpdate]);
    }
    else if(clickAction === 'delete'){
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
          Swal.fire({
            title: "Eliminado Exitosamente!",
            text: "El elemento ha sido eliminado",
            icon: "success"
          });
        }
      });
    }
  }

  private generateUpdateRoute(segments: string[], id: number) {
    segments.push('update');
    segments.push(id+'');
    this.rutaUpdate = segments.map(p => p).join('/');
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