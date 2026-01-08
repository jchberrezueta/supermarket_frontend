import { ITableListConfig } from "@shared/models/table-list.model";

export const ListAccesosUsuarioConfig: ITableListConfig = {
  dataKey: 'ide_acce',
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
          key: 'ide_acce',
          color: 'purple'
        }
      ]
    },

    { label: 'ID', property: 'ide_acce', type: 'text', sortable: true },

    { 
      label: 'Usuario', 
      property: 'usuario_cuen', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'Navegador', 
      property: 'navegador_acce', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'Fecha Acceso', 
      property: 'fecha_acce', 
      type: 'text', 
      sortable: true 
    },

    { 
      label: 'IP', 
      property: 'ip_acce', 
      type: 'text', 
      sortable: false 
    },

    { 
      label: 'Intentos Fallidos', 
      property: 'num_int_fall_acce', 
      type: 'text', 
      sortable: true 
    }
  ]
};
