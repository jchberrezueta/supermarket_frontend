import { ITableListConfig } from '@shared/models/table-list.model';

export const ListPedidoConfig: ITableListConfig = {
  dataKey: 'ide_pedi',
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
          key: 'ide_pedi',
          color: 'purple'
        }
      ]
    },
    {
      label: 'ID',
      property: 'ide_pedi',
      type: 'text',
      sortable: true
    },
    {
      label: 'Empresa',
      property: 'nombre_empr',
      type: 'text',
      sortable: true
    },
    {
      label: 'Fecha Pedido',
      property: 'fecha_pedi',
      type: 'text',
      sortable: true
    },
    {
      label: 'Fecha Entrega',
      property: 'fecha_entr_pedi',
      type: 'text',
      sortable: true
    },
    {
      label: 'Cantidad Total',
      property: 'cantidad_total_pedi',
      type: 'text',
      sortable: true
    },
    {
      label: 'Total',
      property: 'total_pedi',
      type: 'text',
      sortable: true
    },
    {
      label: 'Estado',
      property: 'estado_pedi',
      type: 'text',
      sortable: true
    },
    {
      label: 'Motivo',
      property: 'motivo_pedi',
      type: 'text',
      sortable: true
    },
    {
      label: 'Observación',
      property: 'observacion_pedi',
      type: 'text',
      sortable: false
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
          key: 'ide_pedi',
          color: 'primary'
        },
        {
          action: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          key: 'ide_pedi',
          color: 'red'
        }
      ]
    }
  ]
};
