import { ITableListConfig } from '@shared/models/table-list.model';

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
          label: 'Ver detalles',

          tooltip: 'Consultar evento de autenticación',

          icon: 'visibility',
          router: true,
          key: 'ide_acce',
          color: 'purple',
        },
      ],
    },

    {
      label: 'ID',
      property: 'ide_acce',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Usuario',
      property: 'usuario_cuen',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Usuario intentado',
      property: 'usuario_intentado',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Resultado',
      property: 'resultado_acce',
      type: 'boolean',
      sortable: true,
    },

    {
      label: 'Problema',
      property: 'motivo_acce',
      type: 'textTruncate',
      sortable: true,
    },

    {
      label: 'Estado cuenta',
      property: 'estado_cuen',
      type: 'boolean',
      sortable: true,
    },

    {
      label: 'Fecha/Acceso',
      property: 'fecha_acce',
      type: 'date',
      sortable: true,
    },

    {
      label: 'IP',
      property: 'ip_acce',
      type: 'text',
      sortable: false,
    },

    {
      label: 'Intentos/Fallidos',
      property: 'num_int_fall_acce',
      type: 'text',
      sortable: true,
    },

    {
      label: 'Navegador',
      property: 'navegador_acce',
      type: 'textTruncate',
      sortable: true,
    },
  ],
};
