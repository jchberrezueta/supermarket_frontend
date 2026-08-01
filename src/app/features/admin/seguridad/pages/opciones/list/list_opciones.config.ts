import { ITableListConfig } from '@shared/models/table-list.model';

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
          label: 'Ver detalles',
          tooltip: 'Consultar la opción',
          icon: 'visibility',
          router: true,
          key: 'ide_opci',
          color: 'purple',
        },
      ],
    },

    {
      label: 'ID',
      property: 'ide_opci',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Nombre',
      property: 'nombre_opci',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Ruta',
      property: 'ruta_opci',
      type: 'textTruncate',
      sortable: true,
    },

    {
      label: 'Nivel',
      property: 'nivel_opci',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Padre',
      property: 'padre_opci',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Estado',
      property: 'estado',
      type: 'boolean',
      sortable: true,
    },

    {
      label: 'Visible',
      property: 'visible',
      type: 'boolean',
      sortable: true,
    },

    {
      label: 'Descripción',
      property: 'descripcion_opci',
      type: 'textTruncate',
      sortable: true,
    },

    {
      label: 'Icono',
      property: 'icono_opci',
      type: 'icon',
      sortable: true,
    },

    {
      label: '',
      property: 'menu',
      type: 'ud',

      buttonItems: [
        {
          action: 'update',
          label: 'Editar',
          tooltip: 'Editar opción',
          icon: 'edit',
          router: true,
          key: 'ide_opci',
          color: 'primary',
        },

        {
          action: 'delete',
          label: 'Eliminar',
          tooltip: 'Eliminar opción',
          icon: 'delete',
          key: 'ide_opci',
          color: 'red',
        },
      ],
    },
  ],
};
