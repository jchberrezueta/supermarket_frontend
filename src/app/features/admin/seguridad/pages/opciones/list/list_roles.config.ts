import { ITableListConfig } from "@shared/models/table-list.model";

export const ListRolesConfig: ITableListConfig = {
    dataKey: 'ide_rol',
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
                    key: 'ide_rol',
                    color: 'purple'
                }
            ]
        },
        { label: 'ID', property: 'ide_rol', type: 'text', sortable: true },
        { label: 'Nombre', property: 'nombre_rol', type: 'text', sortable: true },
        { label: 'Descripcion', property: 'descripcion_rol', type: 'text', sortable: true },
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
                    key: 'ide_rol',
                    color: 'primary'
                },
                {
                    action: 'delete',
                    label: 'Eliminar',
                    icon: 'delete',
                    key: 'ide_rol',
                    color: 'red'
                }
            ],
        }
    ]
}