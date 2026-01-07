import { ITableListConfig } from "@shared/models/table-list.model";

export const ListConfig: ITableListConfig = {
    dataKey: 'ide_marc',
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
                    key: 'ide_marc',
                    color: 'purple'
                }
            ]
        },
        { label: 'ID', property: 'ide_marc', type: 'text', sortable: true },
        { label: 'Nombre', property: 'nombre_marc', type: 'text', sortable: true },
        { label: 'Pais Origen', property: 'pais_origen_marc', type: 'text', sortable: true },
        { label: 'Calidad', property: 'calidad_marc', type: 'text', sortable: true },
        { label: 'Descripcion', property: 'descripcion_marc', type: 'text', sortable: true },
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
                    key: 'ide_marc',
                    color: 'primary'
                },
                {
                    action: 'delete',
                    label: 'Eliminar',
                    icon: 'delete',
                    key: 'ide_marc',
                    color: 'red'
                }
            ],
        }
    ]
}