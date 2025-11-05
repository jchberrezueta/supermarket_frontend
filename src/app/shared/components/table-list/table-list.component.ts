import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnInit,
  input,
  signal,
  output,
  SimpleChanges,
  viewChild,
  inject,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RestService } from '@core/services/rest.service';
import { IQueryParams } from '@shared/models/query_param.model';
import { ITableColumn } from '@shared/models/table_column.model';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'ui-table-list',
  standalone: true,
  imports: [
    MatPaginatorModule, 
    MatTableModule, 
    MatSortModule, 
    MatCheckboxModule,
    CommonModule 
  ],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class UiTableListComponent implements OnInit {
  
  public data = signal<any[]>([]);
  public datasource = new MatTableDataSource<any>();
  public columns = input.required<ITableColumn[]>();
  public service = input.required<string>();
  public message = input<string>('!No tiene registros generados¡');
  public getInputs = input<any>();
  public queryParams = input<IQueryParams[]>();
  private _queryParams!: IQueryParams[];
  public isSelection = input<boolean>(false);
  public selection!: SelectionModel<any>;

  public onSelectRow = output<any>();
  public rowClickAction = output<any>();

  public isLoading = signal(false);
  public resultsLength = signal(0);
  public displayedColumns = signal<string[]>([])


  private readonly _restService = inject(RestService);
  @ViewChild(MatPaginator) _matPaginator!: MatPaginator;
  @ViewChild(MatSort) _matSort!: MatSort;
  private _reloadEmit!: EventEmitter<any>;
  @ViewChild(MatTable) tabla1!: MatTable<any>;

  constructor() {
    //console.log('constructor');
  }

  /*ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');
    if (changes['getInputs']) {
      if (this._matPaginator) {
        this._matPaginator.pageIndex = 0;
      }
      if (this.selection) this.selection.clear();
      this._reloadEmit.emit();
    }
    if(changes['service'] && !changes['service'].firstChange){
      this._reloadEmit.next(true);
    }
  }*/

  ngOnInit() {
    console.log('ngOnInit');
    //this.selection = new SelectionModel<any>(this.isSelection(), []);
    this.loadColumns();
    this._restService.get<any>(this.service()).subscribe(
      (res) => {
        this.data.set(res.data);
        console.log(this.data());
      }
    );
  }

  private loadColumns() {
    this.displayedColumns.set(
      this.columns()
        .filter((column) => !column.visible)
        .map((column) => column.property),
    );
    //if (this.isSelection()) this.displayedColumns().unshift('check');
    console.log(this.displayedColumns());
  }

  /*ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.datasource.paginator = this._matPaginator;
    this.datasource.sort = this._matSort;
    console.log(this.tabla1.dataSource);
    this.selection.changed.subscribe(() =>
      this.onSelectRow.emit(this.selection.selected),
    );
    merge(this._reloadEmit)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading.set(true);
          return this._restService
            .get(this.service(), { params: this._getParams() })
            .pipe(catchError(() => of(null)));
        }),
        map((data: any) => {
          this.isLoading.set(false);
          this.resultsLength.set(data?.totalItems || data?.length || 0);
          return data?.items || data;
        }),
      )
      .subscribe((data: any[]) => {
        this.data.set(data);
        if (data && !this.isSelection()) {
          this.selection.select(data[0]);
          this.onSelectRow.emit(data[0]);
        }
      });
      console.log(this.data());
  }*/


  /*public emitClickAction(action: string, row: any): void {
    this.rowClickAction.emit({ action, row });
  }*/

  /*public selectItem(item: any): void {
    if (!this.selection.isSelected(item)) {
      this.selection.select(item);
      this.onSelectRow.emit(item);
    }
  }*/


  /*private _getParams(): HttpParams {
    const paginator = {
      pageIndex: (this._matPaginator()?.pageIndex ?? 0) + 1,
      pageSize: (this._matPaginator()?.pageSize || 10)
    };

    let params = new HttpParams()
      .append('page', paginator.pageIndex)
      .append('limit', paginator.pageSize);

    if (this.queryParams?.length > 0) {
      this.queryParams()?.forEach(
        (item) => {
          if (item) params = params.append(item.param, item.value);
        }
      );
    }
    return params;
  }*/

  

  /*public toggleAllRows() {
    if (!this.isAllSelected()) {
      this.selection.select(...this.datasource.data);
    } else {
      this.selection.clear();
    }
  }*/

  /*public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }*/

  /*public checkBoxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }*/



  /*public setQueryParams(queryParams: IQueryParams[]) {
    this._queryParams = queryParams;
  }*/

  /*private update() {
    this._reloadEmit.emit();
  }*/
}