import { ITableListConfig } from "@shared/models/table-list.model";

export const ListProductosConfig: ITableListConfig = {
  dataKey: 'ide_prod',
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
          key: 'ide_prod',
          color: 'purple'
        }
      ]
    },

    { label: 'ID', property: 'ide_prod', type: 'text', sortable: true },
    { label: 'Categoría', property: 'nombre_cate', type: 'text', sortable: true },
    { label: 'Marca', property: 'nombre_marc', type: 'text', sortable: true },

    { label: 'Código Barra', property: 'codigo_barra_prod', type: 'text', sortable: true },
    { label: 'Nombre', property: 'nombre_prod', type: 'text', sortable: true },

    { label: 'Precio Venta', property: 'precio_venta_prod', type: 'text', sortable: true },
    { label: 'IVA', property: 'iva_prod', type: 'text', sortable: true },
    { label: 'Dcto Promo', property: 'dcto_promo_prod', type: 'text', sortable: true },

    { label: 'Stock', property: 'stock_prod', type: 'text', sortable: true },
    { label: 'Disponible', property: 'disponible_prod', type: 'text', sortable: true },
    { label: 'Estado', property: 'estado_prod', type: 'text', sortable: true },

    { label: 'Descripción', property: 'descripcion_prod', type: 'text', sortable: true },
    /*{ label: 'URL Imagen', property: 'url_img_prod', type: 'text', sortable: false },*/

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
          key: 'ide_prod',
          color: 'primary'
        },
        {
          action: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          key: 'ide_prod',
          color: 'red'
        }
      ],
    }
  ]
};
