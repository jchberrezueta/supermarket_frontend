import { ITableColumn } from "./table_column.model";

export interface ITableListConfig {
    columns: ITableColumn[];
    dataKey: string;
    breadCumbs?: IBreadCumb[];
}

interface IBreadCumb {
    label: string;
}