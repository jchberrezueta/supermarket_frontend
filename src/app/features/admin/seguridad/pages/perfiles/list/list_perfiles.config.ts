import { ITableListConfig } from "@shared/models/table-list.model";

export const ListPerfilesConfig: ITableListConfig = {
  dataKey: 'ide_perf',
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
          key: 'ide_perf',
          color: 'purple'
        }
      ]
    },
    {
      label: 'ID',
      property: 'ide_perf',
      type: 'text',
      sortable: true
    },
    {
      label: 'Rol',
      property: 'nombre_rol',
      type: 'text',
      sortable: true
    },
    {
      label: 'Nombre Perfil',
      property: 'nombre_perf',
      type: 'text',
      sortable: true
    },
    {
      label: 'Descripción',
      property: 'descripcion_perf',
      type: 'text',
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
          key: 'ide_perf',
          color: 'primary'
        },
        {
          action: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          key: 'ide_perf',
          color: 'red'
        }
      ]
    }
  ]
};
