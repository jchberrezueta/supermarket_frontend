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
  inject,
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
import { RouterLink } from "@angular/router";

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
    RouterLink
],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class UiTableListComponent implements OnInit {
  
  private data = signal<any[]>([]);
  public matDatasource = new MatTableDataSource<any>();
  public columns = input.required<ITableColumn[]>();
  public service = input.required<string>();
  public message = input<string>('!No tiene registros generados¡');
  public getInputs = input<any>();
  public queryParams = input<IQueryParams[]>();
  public isSelection = input<boolean>(false);
  public selection!: SelectionModel<any>;

  public onSelectRow = output<any>();
  public rowClickAction = output<any>();

  public isLoading = signal(false);
  public resultsLength = signal(0);
  public displayedColumns = signal<string[]>([])


  private readonly _restService = inject(RestService);
  private readonly _matSort = viewChild(MatSort);
  private readonly _matPaginator = viewChild(MatPaginator);
  private _reloadEmit!: EventEmitter<any>;

  constructor() {
    console.log('constructor');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');
    if (changes['getInputs']) {
      if (this._matPaginator()) {
        //this._matPaginator.pageIndex? = 0;
      }
      if (this.selection) this.selection.clear();
      this._reloadEmit.emit(true);
    }
    if(changes['service'] && !changes['service'].firstChange){
      this._reloadEmit.emit(true);
    }
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.selection = new SelectionModel<any>(this.isSelection(), []);
    this._reloadEmit = new EventEmitter<any>();
    this.loadColumns();
    this._restService.get<any>(this.service()).subscribe(
      (res) => {
        this.data.set(res.data);
        this.matDatasource.data = this.data();
        this.resultsLength.set(this.matDatasource.data.length);
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


  private _getParams(): HttpParams {
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

  public update() {
    console.log('vamos');
    this._reloadEmit.emit();
    console.log('emitido');
  }
}