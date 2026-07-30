import { ITableListConfig } from '@shared/models/table-list.model';
import { TableRow } from '@shared/models/button_item.model';

const esCompletada = (row: TableRow): boolean =>
  row['estado_vent'] === 'completado';

export const ListVentasConfig: ITableListConfig = {
  dataKey: 'ide_vent',
  columns: [
    {
      label: 'Acciones',
      property: 'acciones',
      type: 'actions',
      buttonItems: [
        {
          action: 'details',
          label: 'Ver',
          tooltip: 'Ver venta y trazabilidad',
          icon: 'visibility',
          key: 'ide_vent',
          color: 'purple',
        },
        {
          action: 'cancel',
          label: 'Anular',
          tooltip: 'Anular venta y restaurar los lotes consumidos',
          icon: 'undo',
          key: 'ide_vent',
          color: 'red',
          visible: esCompletada,
        },
      ],
    },
    { label: 'ID', property: 'ide_vent', type: 'text', sortable: true },
    {
      label: 'Num. Factura',
      property: 'num_factura_vent',
      type: 'text',
      sortable: true,
    },
    { label: 'Fecha', property: 'fecha_vent', type: 'date', sortable: true },
    { label: 'Canal', property: 'canal_vent', type: 'text', sortable: true },
    {
      label: 'Forma de pago',
      property: 'tipo_pago_vent',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Cantidad',
      property: 'cantidad_vent',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Subtotal',
      property: 'sub_total_vent',
      type: 'currency',
      sortable: true,
    },
    {
      label: 'Total',
      property: 'total_vent',
      type: 'currency',
      sortable: true,
    },
    {
      label: 'Estado',
      property: 'estado_vent',
      type: 'text',
      sortable: true,
    },
  ],
};
