export interface IButtonItem {
  tooltip?: string;
  action: string;
  icon?: string;
  color?: 'primary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
  label?: string;
  disable?: boolean;
  visible?(event: any): void;
  condition?: string;
  router?: boolean;
  key?: string;
  cssClasses?: string[];
}
