import { ITableListConfig } from '@shared/models/table-list.model';
import { TableRow } from '@shared/models/button_item.model';

const esBorrador = (row: TableRow): boolean => row['estado_pedi'] === 'borrador';

export const ListPedidoConfig: ITableListConfig = {
  dataKey: 'ide_pedi',
  columns: [
    { label: 'ID', property: 'ide_pedi', type: 'text', sortable: true },
    { label: 'Empresa', property: 'nombre_empr', type: 'text', sortable: true },
    { label: 'Fecha Pedido', property: 'fecha_pedi', type: 'text', sortable: true },
    { label: 'Entrega esperada', property: 'fecha_entr_pedi', type: 'text', sortable: true },
    { label: 'Cantidad Total', property: 'cantidad_total_pedi', type: 'text', sortable: true },
    { label: 'Total', property: 'total_pedi', type: 'text', sortable: true },
    { label: 'Estado', property: 'estado_pedi', type: 'text', sortable: true },
    { label: 'Motivo', property: 'motivo_pedi', type: 'text', sortable: true },
    { label: 'Observación', property: 'observacion_pedi', type: 'text', sortable: false },
    {
      label: 'Acciones', property: 'acciones', type: 'actions',
      buttonItems: [
        { action: 'view', label: 'Ver', tooltip: 'Ver pedido', icon: 'visibility', color: 'purple', key: 'ide_pedi' },
        { action: 'edit', label: 'Editar', tooltip: 'Editar borrador', icon: 'edit', color: 'primary', key: 'ide_pedi', visible: esBorrador },
        { action: 'delete', label: 'Eliminar', tooltip: 'Eliminar borrador', icon: 'delete', color: 'red', key: 'ide_pedi', visible: esBorrador },
        { action: 'emit', label: 'Emitir', tooltip: 'Emitir pedido', icon: 'send', color: 'green', key: 'ide_pedi', visible: esBorrador },
      ],
    },
  ],
};
