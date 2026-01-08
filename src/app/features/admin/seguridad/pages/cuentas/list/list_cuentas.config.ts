import { ITableListConfig } from "@shared/models/table-list.model";

export const ListCuentasConfig: ITableListConfig = {
  dataKey: 'ide_cuen',
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
          key: 'ide_cuen',
          color: 'purple'
        }
      ]
    },

    { 
      label: 'ID', 
      property: 'ide_cuen', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'Usuario', 
      property: 'usuario_cuen', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'Empleado', 
      property: 'nombre_empleado', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'Perfil', 
      property: 'nombre_perf', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'Estado', 
      property: 'estado_cuen', 
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
          key: 'ide_cuen',
          color: 'primary'
        },
        {
          action: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          key: 'ide_cuen',
          color: 'red'
        }
      ]
    }
  ]
};
