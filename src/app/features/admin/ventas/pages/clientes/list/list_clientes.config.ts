import { ITableListConfig } from "@shared/models/table-list.model";

export const ListClientesConfig: ITableListConfig = {
    dataKey: 'ide_clie',
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
                    key: 'ide_clie',
                    color: 'purple'
                }
            ]
        },
        { label: 'ID', property: 'ide_clie', type: 'text', sortable: true },
        { label: 'Cédula', property: 'cedula_clie', type: 'text', sortable: true },
        { label: 'Nombre', property: 'primer_nombre_clie', type: 'text', sortable: true },
        { label: 'Apellido', property: 'apellido_paterno_clie', type: 'text', sortable: true },
        { label: 'Teléfono', property: 'telefono_clie', type: 'text', sortable: true },
        { label: 'Email', property: 'email_clie', type: 'text', sortable: true },
        { label: 'Socio', property: 'es_socio', type: 'text', sortable: true },
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
                    key: 'ide_clie',
                    color: 'primary'
                },
                {
                    action: 'delete',
                    label: 'Eliminar',
                    icon: 'delete',
                    key: 'ide_clie',
                    color: 'red'
                }
            ],
        }
    ]
}
