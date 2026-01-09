import { ITableListConfig } from "@shared/models/table-list.model";

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
          label: 'Ver Detalles',
          icon: 'visibility',
          router: true,
          key: 'ide_lote',
          color: 'purple'
        }
      ]
    },
    {
      label: 'Producto',
      property: 'nombre_prod',
      type: 'text',
      sortable: true
    },
    {
      label: 'Fecha de Caducidad',
      property: 'fecha_caducidad_lote',
      type: 'text',
      sortable: true
    },
    {
      label: 'Stock',
      property: 'stock_lote',
      type: 'text',
      sortable: true
    },
    {
      label: 'Estado',
      property: 'estado_lote',
      type: 'badge',
      sortable: true
    },
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
          key: 'ide_lote',
          color: 'primary'
        },
        {
          action: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          key: 'ide_lote',
          color: 'red'
        }
      ]
    }
  ]
};