import { ITableListConfig } from "@shared/models/table-list.model";

export const ListOpcionesConfig: ITableListConfig = {
  dataKey: 'ide_opci',
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
          key: 'ide_opci',
          color: 'purple'
        }
      ]
    },

    { 
      label: 'Nombre', 
      property: 'nombre_opci', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'Ruta', 
      property: 'ruta_opci', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'Nivel', 
      property: 'nivel_opci', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'Estado', 
      property: 'activo_opci', 
      type: 'badge',
      sortable: true 
    },

    { 
      label: 'Descripción', 
      property: 'descripcion_opci', 
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
          key: 'ide_opci',
          color: 'primary'
        },
        {
          action: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          key: 'ide_opci',
          color: 'red'
        }
      ]
    }
  ]
};
