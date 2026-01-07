import { ITableListConfig } from "@shared/models/table-list.model";

export const ListConfig: ITableListConfig = {
    dataKey: 'ide_prov',
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
                    key: 'ide_prov',
                    color: 'purple'
                }
            ]
        },
        { label: 'ID', property: 'ide_prov', type: 'text', sortable: true },
        { label: 'Empresa', property: 'nombre_empr', type: 'text', sortable: true },
        { label: 'Cedula', property: 'cedula_prov', type: 'text', sortable: true },
        { label: 'Nombres/Apellidos', property: 'nombre_completo', type: 'text', sortable: true },
        { label: 'Fecha/Nacimiento', property: 'fecha_nacimiento_prov', type: 'text', sortable: true },
        { label: 'Edad', property: 'edad_prov', type: 'text', sortable: true },
        { label: 'Telefono', property: 'telefono_prov', type: 'text', sortable: true },
        { label: 'Email', property: 'email_prov', type: 'text', sortable: true },
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
                    key: 'ide_prov',
                    color: 'primary'
                },
                {
                    action: 'delete',
                    label: 'Eliminar',
                    icon: 'delete',
                    key: 'ide_prov',
                    color: 'red'
                }
            ],
        }
    ]
}