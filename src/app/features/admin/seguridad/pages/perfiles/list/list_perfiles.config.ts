import { ITableListConfig } from '@shared/models/table-list.model';

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
          label: 'Ver detalles',

          tooltip: 'Ver información del perfil',

          icon: 'visibility',
          router: true,
          key: 'ide_perf',
          color: 'purple',
        },
      ],
    },

    {
      label: 'ID',
      property: 'ide_perf',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Rol',
      property: 'nombre_rol',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Nombre perfil',
      property: 'nombre_perf',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Descripción',
      property: 'descripcion_perf',

      type: 'text',
      sortable: true,
    },

    {
      label: 'Permisos',
      property: 'permissions',

      type: 'actions',

      buttonItems: [
        {
          action: 'permissions',

          label: 'Permisos',

          tooltip: 'Administrar permisos CRUD',

          icon: 'admin_panel_settings',

          key: 'ide_perf',

          color: 'success',
        },
      ],
    },

    {
      label: '',
      property: 'menu',
      type: 'ud',

      buttonItems: [
        {
          action: 'update',
          label: 'Editar',
          tooltip: 'Editar perfil',
          icon: 'edit',
          router: true,
          key: 'ide_perf',
          color: 'primary',

          disable: (row) => Number(row['ide_perf']) === 0,
        },

        {
          action: 'delete',
          label: 'Eliminar',
          tooltip: 'Eliminar perfil',
          icon: 'delete',
          key: 'ide_perf',
          color: 'red',

          disable: (row) => Number(row['ide_perf']) === 0,
        },
      ],
    },
  ],
};
