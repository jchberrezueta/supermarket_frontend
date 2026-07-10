import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  SimpleChanges,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { IResultData } from '@core/models';
import { AuthService } from '@core/services/auth.service';
import { RestService } from '@core/services/rest.service';
import { ITableColumn } from '@shared/models/table_column.model';
import { DashIfEmptyPipe } from '@shared/pipes/dashIfEmpty.pipe';
import { LoadingService } from '@shared/services/loading.service';
import Swal from 'sweetalert2';
import { UiButtonComponent } from '../button/button.component';

const IMPORTS = [
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatCheckboxModule,
  UiButtonComponent,
  DashIfEmptyPipe,
  CommonModule,
];

@Component({
  selector: 'ui-table-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
})
export class UiTableListComponent implements OnInit {
  public serviceApi = input<string>('');
  public inputData = input<any[]>([]);
  public serviceApiReal = input<string>('');
  public serviceApiFilter = input<string>('');
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
  private readonly _loadingService = inject(LoadingService);

  private readonly _matSort = viewChild(MatSort);
  private readonly _matPaginator = viewChild(MatPaginator);

  private rutaActual: string = '';
  private rutaUpdate: string = '';
  private rutaDetails: string = '';

  protected canUpdate: boolean = false;
  protected canDelete: boolean = false;
  protected canList: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serviceApi'] && !changes['serviceApi'].isFirstChange()) {
      this.refreshData();
    }

    if (changes['inputData'] && !changes['inputData'].isFirstChange()) {
      this.setData();
    }
  }

  ngOnInit(): void {
    this.selection = new SelectionModel<any>(this.isSelection(), []);
    this.loadColumns();

    if (this.serviceApi() !== '') {
      this.requestData(this.serviceApi());
      this.hasPermissionsUD();
      return;
    }

    if (this.inputData()) {
      this.setData();
    }
  }

  public refreshData(): void {
    if (this.serviceApi() === '') {
      this.setData();
      return;
    }

    this.requestData(this.serviceApi());
    this.hasPermissionsUD();
  }

  private setData(): void {
    this.data.set(this.inputData() ?? []);
    this.matDatasource.data = this.data();
    this.resultsLength.set(this.matDatasource.data.length);
    this.bindTableControls();
  }

  private requestData(ruta: string): void {
    this._loadingService.show();

    this._restService.get<IResultData>(ruta).subscribe({
      next: (res) => {
        this.data.set(res.data ?? []);
        this.matDatasource.data = this.data();
        this.resultsLength.set(this.matDatasource.data.length);
        this.bindTableControls();
        this._loadingService.hide();
      },
      error: () => {
        this.data.set([]);
        this.matDatasource.data = [];
        this.resultsLength.set(0);
        this._loadingService.hide();
      },
    });
  }

  public filterData(params: URLSearchParams): void {
    if (this.serviceApiFilter() === '') {
      this.requestData(`${this.serviceApi()}/filtrar?${params.toString()}`);
      return;
    }

    if (this.serviceApiFilter()) {
      this.requestData(`${this.serviceApiFilter()}?${params.toString()}`);
    }
  }

  private loadColumns(): void {
    this.displayedColumns.set(
      this.columns()
        .filter((column) => !column.visible)
        .map((column) => column.property),
    );

    if (this.isSelection()) {
      this.displayedColumns().unshift('check');
    }
  }

  public emitClickAction(action: string, row: any): void {
    this.rowClickAction.emit({ action, row });
  }

  public selectCheckBox(action: string, row: any): void {
    if (!this.selection.isSelected(row)) {
      this.selection.clear();
    }

    this.selection.toggle(row);

    if (this.selection.isSelected(row)) {
      this.rowClickAction.emit({ action, row });
      return;
    }

    this.rowClickAction.emit(null);
  }

  public selectItem(row: any): void {
    if (!this.selection.isSelected(row)) {
      this.selection.select(row);
      this.onSelectRow.emit(row);
    }
  }

  public toggleAllRows(): void {
    if (!this.isAllSelected()) {
      this.selection.select(...this.matDatasource.data);
      return;
    }

    this.selection.clear();
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

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  protected hasPermissionsUD(): void {
    this.rutaActual = this.getSegmentsRoute().join('/');
    this.canUpdate = this._authService.canUpdate(this.rutaActual);
    this.canDelete = this._authService.canDelete(this.rutaActual);
    this.canList = this._authService.canList(this.rutaActual);
  }

  protected redirectUD(clickAction: string, id: number): void {
    if (clickAction === 'update' && this.canUpdate) {
      this.generateUpdateRoute(this.getSegmentsRoute(), id);
      this._router.navigate([this.rutaUpdate]);
      return;
    }

    if (clickAction === 'delete' && this.canDelete) {
      Swal.fire({
        title: '¿Está seguro de eliminar este elemento?',
        text: 'No se podrá revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: this.getCssVariable(
          '--sm-color-primary',
          '#2563eb',
        ),
        cancelButtonColor: this.getCssVariable('--sm-color-danger', '#dc2626'),
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteRow(id);
        }
      });
    }
  }

  protected viewDetails(clickAction: string, id: number): void {
    if (clickAction === 'details' && this.canList) {
      this.generateDetailsRoute(this.getSegmentsRoute(), id);
      this._router.navigate([this.rutaDetails]);
    }
  }

  protected redirectToUrl(clickAction: string, url: string = ''): void {
    if (clickAction === 'redirect') {
      this._router.navigate([url]);
    }
  }

  private deleteRow(id: number): void {
    const baseUrl =
      this.serviceApiReal() !== '' ? this.serviceApiReal() : this.serviceApi();

    this._restService.delete<any>(`${baseUrl}/eliminar/${id}`).subscribe({
      next: () => {
        Swal.fire({
          title: 'Eliminado correctamente',
          text: 'El elemento ha sido eliminado.',
          icon: 'success',
          confirmButtonColor: this.getCssVariable(
            '--sm-color-primary',
            '#2563eb',
          ),
        });

        this.requestData(this.serviceApi());
      },
      error: () => {
        Swal.fire({
          title: 'No se pudo eliminar',
          text: 'Revise si el registro está relacionado con otros procesos.',
          icon: 'error',
          confirmButtonColor: this.getCssVariable(
            '--sm-color-danger',
            '#dc2626',
          ),
        });
      },
    });
  }

  private generateUpdateRoute(segments: string[], id: number): void {
    segments.push('update');
    segments.push(id.toString());
    this.rutaUpdate = segments.join('/');
  }

  private generateDetailsRoute(segments: string[], id: number): void {
    segments.push('details');
    segments.push(id.toString());
    this.rutaDetails = segments.join('/');
  }

  private getSegmentsRoute(): string[] {
    const segments = this._router.url.split('/');
    const posFinal = segments.length - 1;

    if (segments[posFinal] === 'list') {
      segments.pop();
    }

    return segments;
  }

  private bindTableControls(): void {
    const sort = this._matSort();
    const paginator = this._matPaginator();

    if (sort) {
      this.matDatasource.sort = sort;
    }

    if (paginator) {
      this.matDatasource.paginator = paginator;
    }
  }

  private getCssVariable(name: string, fallback: string): string {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();

    return value || fallback;
  }
}
