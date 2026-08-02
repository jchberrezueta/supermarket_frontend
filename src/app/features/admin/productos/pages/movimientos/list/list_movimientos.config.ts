import { ITableListConfig } from '@shared/models/table-list.model';

export const ListMovimientosConfig: ITableListConfig = {
  dataKey: 'ide_movi',

  columns: [
    {
      label: 'Detalles',
      property: 'view_details',
      type: 'details',

      buttonItems: [
        {
          action: 'details',
          label: 'Ver detalles',
          tooltip: 'Consultar trazabilidad del movimiento',
          icon: 'visibility',
          router: true,
          key: 'ide_movi',
          color: 'purple',
        },
      ],
    },
    {
      label: 'ID',
      property: 'ide_movi',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Fecha',
      property: 'fecha_ingre',
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
      label: 'Lote',
      property: 'ide_lote',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Tipo',
      property: 'tipo_movi_label',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Cantidad',
      property: 'cantidad_movi',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Stock producto',
      property: 'stock_prod_rango',
      type: 'text',
    },
    {
      label: 'Stock lote',
      property: 'stock_lote_rango',
      type: 'text',
    },
    {
      label: 'Documento',
      property: 'documento_origen',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Canal',
      property: 'canal_origen',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Usuario',
      property: 'usua_ingre',
      type: 'text',
      sortable: true,
    },
    {
      label: 'Observación',
      property: 'observacion_movi',
      type: 'text',
    },
  ],
};
