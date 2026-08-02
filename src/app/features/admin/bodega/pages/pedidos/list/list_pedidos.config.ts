import { ITableListConfig } from '@shared/models/table-list.model';
import { TableRow } from '@shared/models/button_item.model';

const esBorrador = (row: TableRow): boolean =>
  row['estado_pedi'] === 'borrador';

const esCancelable = (row: TableRow): boolean =>
  row['estado_pedi'] === 'borrador' || row['estado_pedi'] === 'emitido';

const esParcial = (row: TableRow): boolean => row['estado_pedi'] === 'parcial';

export const ListPedidoConfig: ITableListConfig = {
  dataKey: 'ide_pedi',
  columns: [
    {
      label: 'Detalles',
      property: 'view_details',
      type: 'actions',
      buttonItems: [
        {
          action: 'view',
          label: '',
          tooltip: 'Ver pedido',
          icon: 'visibility',
          color: 'purple',
          key: 'ide_pedi',
        },
      ],
    },
    { label: 'ID', property: 'ide_pedi', type: 'text', sortable: true },
    { label: 'Empresa', property: 'nombre_empr', type: 'text', sortable: true },
    {
      label: 'Fecha Pedido',
      property: 'fecha_pedi',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Entrega esperada',
      property: 'fecha_entr_pedi',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Cantidad Total',
      property: 'cantidad_total_pedi',
      type: 'text',
      sortable: true,
    },
    { label: 'Total', property: 'total_pedi', type: 'text', sortable: true },
    { label: 'Estado', property: 'estado_pedi', type: 'text', sortable: true },
    { label: 'Motivo', property: 'motivo_pedi', type: 'text', sortable: true },
    {
      label: 'Observación',
      property: 'observacion_pedi',
      type: 'text',
      sortable: false,
    },
    {
      label: 'Acciones',
      property: 'acciones',
      type: 'actions',
      buttonItems: [
        {
          action: 'edit',
          label: 'Editar',
          tooltip: 'Editar borrador',
          icon: 'edit',
          color: 'primary',
          key: 'ide_pedi',
          visible: esBorrador,
        },
        {
          action: 'delete',
          label: 'Eliminar',
          tooltip: 'Eliminar borrador',
          icon: 'delete',
          color: 'red',
          key: 'ide_pedi',
          visible: esBorrador,
        },
        {
          action: 'emit',
          label: 'Emitir',
          tooltip: 'Emitir pedido',
          icon: 'send',
          color: 'green',
          key: 'ide_pedi',
          visible: esBorrador,
        },
        {
          action: 'cancel',
          label: 'Cancelar',
          tooltip: 'Cancelar pedido conservando su historial',
          icon: 'cancel',
          color: 'red',
          key: 'ide_pedi',
          visible: esCancelable,
        },

        {
          action: 'close-incomplete',
          label: 'Cerrar incompleto',
          tooltip: 'Cerrar un pedido entregado parcialmente',
          icon: 'lock',
          color: 'orange',
          key: 'ide_pedi',
          visible: esParcial,
        },
      ],
    },
  ],
};
