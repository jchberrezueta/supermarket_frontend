import { ITableListConfig } from "@shared/models/table-list.model";

export const ListEmpleadosConfig: ITableListConfig = {
    dataKey: 'ide_empl',
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
                    key: 'ide_empl',
                    color: 'purple'
                }
            ]
        },

        { label: 'ID', property: 'ide_empl', type: 'text', sortable: true },
        { label: 'Cédula', property: 'cedula_empl', type: 'text', sortable: true },
        { label: 'Empleado', property: 'nombre_completo', type: 'text', sortable: true },
        { label: 'Rol', property: 'nombre_rol', type: 'text', sortable: true },
        { label: 'Título', property: 'titulo_empl', type: 'text', sortable: true },
        { label: 'RMU', property: 'rmu_empl', type: 'text', sortable: true },
        { label: 'Estado', property: 'estado_empl', type: 'text', sortable: true },

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
                    key: 'ide_empl',
                    color: 'primary'
                },
                {
                    action: 'delete',
                    label: 'Eliminar',
                    icon: 'delete',
                    key: 'ide_empl',
                    color: 'red'
                }
            ]
        }
    ]
};
