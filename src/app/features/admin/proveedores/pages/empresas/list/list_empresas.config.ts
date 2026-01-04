import { ITableListConfig } from "@shared/models/table-list.model";

export const ListEmpresasConfig: ITableListConfig = {
    dataKey: 'ide_empr',
    columns: [
        { 
            label: 'Ver Detalles', 
            property: 'view_details', 
            type: 'details',
            buttonItems: [
                {
                    action: 'details',
                    label: 'Ver Detalles',
                    icon: 'visibility',
                    router: true,
                    key: 'ide_empr',
                    color: 'purple'
                }
            ]
        },
        { label: 'ID', property: 'ide_empr', type: 'text', sortable: true },
        { label: 'Nombre', property: 'nombre_empr', type: 'text', sortable: true },
        { label: 'Responsable', property: 'responsable_empr', type: 'text', sortable: true },
        { label: 'Fecha/Contrato', property: 'fecha_contrato_empr', type: 'text', sortable: true },
        { label: 'Direccion', property: 'direccion_empr', type: 'text', sortable: true },
        { label: 'Telefono', property: 'telefono_empr', type: 'text', sortable: true },
        { label: 'Email', property: 'email_empr', type: 'text', sortable: true },
        { label: 'Estado', property: 'estado_empr', type: 'text', sortable: true },
        { label: 'Descripcion', property: 'descripcion_empr', type: 'text', sortable: true },
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
                    key: 'ide_empr',
                    color: 'primary'
                },
                {
                    action: 'delete',
                    label: 'Eliminar',
                    icon: 'delete',
                    key: 'ide_empr',
                    color: 'red'
                }
            ],
        }
    ]
}