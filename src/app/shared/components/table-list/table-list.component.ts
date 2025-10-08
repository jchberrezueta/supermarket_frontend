import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table-list',
  standalone: true,
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
  imports: [MatPaginatorModule, MatTableModule, MatSortModule, CommonModule],
})
export class TableListComponent implements OnInit, AfterViewInit {
  
  @Input() data: any[] = [];
  @Input() columns: { def: string; header: string; cell: (row: any) => string }[] = [];
  @Output() onSelectRow = new EventEmitter<any>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    console.log('NgOnInit');
    this.displayedColumns = this.columns.map(c => c.def);
    this.dataSource.data = this.data;
  }

  ngAfterViewInit() {
    console.log('NgAfterViewInit');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //Emite Eventos al Componente Padre
  selectRow(row: any) {
    this.onSelectRow.emit(row);
  }
}