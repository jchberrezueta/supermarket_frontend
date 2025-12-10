import { ITableListConfig } from "@shared/models/table-list.model";

export const ListEmpresasConfig: ITableListConfig = {
    columns: [
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
            type: 'crud',
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
                    router: true,
                    key: 'ide_empr',
                    color: 'red'
                },
            ],
        }
    ],
    dataKey: 'ide_empr',
    breadCumbs: [{label: 'Proveedores'}, {label: 'Empresas'}]
}