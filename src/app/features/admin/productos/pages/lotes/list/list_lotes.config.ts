import { ITableListConfig } from '@shared/models/table-list.model';

export const ListLotesConfig: ITableListConfig = {
  dataKey: 'ide_lote',

  columns: [
    {
      label: 'Detalles',
      property: 'view_details',
      type: 'details',

      buttonItems: [
        {
          action: 'details',
          label: 'Ver detalles',

          tooltip: 'Consultar información del lote',

          icon: 'visibility',
          router: true,
          key: 'ide_lote',
          color: 'purple',
        },
      ],
    },

    {
      label: 'ID',
      property: 'ide_lote',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Producto',
      property: 'nombre_prod',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Fecha de caducidad',

      property: 'fecha_caducidad_lote',

      type: 'text',
      sortable: true,
    },

    {
      label: 'Stock',
      property: 'stock_lote',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Estado',
      property: 'estado_lote',
      type: 'text',
      sortable: true,
    },
  ],
};
