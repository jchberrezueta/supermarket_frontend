import { IButtonItem } from "./button_item.model";

export interface ITableColumn {
  property: string;
  type:
    | 'text'
    | 'textTruncate'
    | 'price'
    | 'person'
    | 'link'
    | 'icon'
    | 'image'
    | 'badge'
    | 'progress'
    | 'checkbox'
    | 'button'
    | 'periodo'
    | 'date'
    | 'datetime'
    | 'clickButton'
    | 'currency'
    | 'byteConversion'
    | 'buttonGroup'
    | 'semaforo'
    | 'crud'
    | 'ud'
    | 'remove'
    | 'edit'
    | 'redirect'
    | 'sendMail'
    | 'details';
  label: string;
  buttonItems?: IButtonItem[];
  visible?: boolean;
  width?: number;
  cssClasses?: string[];
  badgeStyle?: any;
  sortable?: boolean;
  sticky?: boolean;
}