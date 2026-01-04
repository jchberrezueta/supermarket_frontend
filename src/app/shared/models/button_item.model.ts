export interface IButtonItem {
  tooltip?: string;
  action: string;
  icon?: string;
  color: string;
  label?: string;
  disable?: boolean;
  visible?(event: any): void;
  condition?: string;
  router?: boolean;
  url?: string;
  key: string;
  cssClasses?: string[];
}
