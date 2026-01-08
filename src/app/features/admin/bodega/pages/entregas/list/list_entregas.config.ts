import { ITableListConfig } from '@shared/models/table-list.model';

export const ListEntregasConfig: ITableListConfig = {
  dataKey: 'ide_entr',
  columns: [
    {
      label: 'Detalles',
      property: 'view_details',
      type: 'details',
      buttonItems: [
        {
          action: 'details',
          label: 'Ver Detalles',
          icon: 'visibility',
          router: true,
          key: 'ide_entr',
          color: 'purple',
        },
      ],
    },

    { label: 'ID', property: 'ide_entr', type: 'text', sortable: true },
    { label: 'Pedido', property: 'ide_pedi', type: 'text', sortable: true },

    // del JOIN pedido -> empresa
    { label: 'Empresa', property: 'nombre_empr', type: 'text', sortable: true },

    // del JOIN proveedor (nombre completo)
    { label: 'Proveedor', property: 'proveedor', type: 'text', sortable: true },

    // formateada con TO_CHAR en el SQL
    { label: 'Fecha Entrega', property: 'fecha_entr', type: 'text', sortable: true },

    { label: 'Cantidad', property: 'cantidad_total_entr', type: 'text', sortable: true },
    { label: 'Total', property: 'total_entr', type: 'text', sortable: true },
    { label: 'Estado', property: 'estado_entr', type: 'text', sortable: true },
    { label: 'Observación', property: 'observacion_entr', type: 'text', sortable: true },

    {
      label: '',
      property: 'menu',
      type: 'ud',
      buttonItems: [
        {
          action: 'update',
          label: 'Editar',
          icon: 'edit',
          router: true,
          key: 'ide_entr',
          color: 'primary',
        },
        {
          action: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          key: 'ide_entr',
          color: 'red',
        },
      ],
    },
  ],
};
