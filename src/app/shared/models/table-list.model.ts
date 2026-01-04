import { ITableColumn } from "./table_column.model";

export interface ITableListConfig {
    columns: ITableColumn[];
    dataKey: string;
}

interface IBreadCumb {
    label: string;
}