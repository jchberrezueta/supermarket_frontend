import { ITableListConfig } from "@shared/models/table-list.model";

export const ListConfig: ITableListConfig = {
    dataKey: 'ide_cate',
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
                    key: 'ide_cate',
                    color: 'purple'
                }
            ]
        },
        { label: 'ID', property: 'ide_cate', type: 'text', sortable: true },
        { label: 'Nombre', property: 'nombre_cate', type: 'text', sortable: true },
        { label: 'Descripcion', property: 'descripcion_cate', type: 'text', sortable: true },
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
                    key: 'ide_cate',
                    color: 'primary'
                },
                {
                    action: 'delete',
                    label: 'Eliminar',
                    icon: 'delete',
                    key: 'ide_cate',
                    color: 'red'
                }
            ],
        }
    ]
}