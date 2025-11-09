import { ITableListConfig } from "@shared/models/table-list.model";

export const ListEmpresasConfig: ITableListConfig = {
    columns: [
        { label: 'ID', property: 'ide_empr', type: 'text' },
        { label: 'Nombre', property: 'nombre_empr', type: 'text' },
        { label: 'Responsable', property: 'responsable_empr', type: 'text' },
        { label: 'Fecha/Contrato', property: 'fecha_contrato_empr', type: 'text' },
        { label: 'Direccion', property: 'direccion_empr', type: 'text' },
        { label: 'Telefono', property: 'telefono_empr', type: 'text' },
        { label: 'Email', property: 'email_empr', type: 'text' },
        { label: 'Estado', property: 'estado_empr', type: 'text' },
        { label: 'Descripcion', property: 'descripcion_empr', type: 'text' },
        {
            label: '',
            property: 'menu',
            type: 'buttonGroup',
            width: 15,
            buttonItems: [
                {
                    action: '',
                    label: 'Editar',
                    icon: 'edit',
                    router: true,
                    key: 'ide_empr',
                    color: 'primary'
                },
                {
                    action: '',
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