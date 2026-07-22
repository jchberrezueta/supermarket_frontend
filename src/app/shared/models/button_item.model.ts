export type TableRow = Record<string, unknown>;
export type ButtonItemPredicate = boolean | ((row: TableRow) => boolean);

export interface IButtonItem {
  tooltip?: string;
  action: string;
  icon?: string;
  color: string;
  label?: string;
  disable?: ButtonItemPredicate;
  visible?: ButtonItemPredicate;
  condition?: string | ((row: TableRow) => boolean);
  router?: boolean;
  url?: string;
  key: string;
  cssClasses?: string[];
}
