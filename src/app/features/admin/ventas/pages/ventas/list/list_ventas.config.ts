import { ITableListConfig } from "@shared/models/table-list.model";

export const ListVentasConfig: ITableListConfig = {
    dataKey: 'ide_vent',
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
                    key: 'ide_vent',
                    color: 'purple'
                }
            ]
        },
        { label: 'ID', property: 'ide_vent', type: 'text', sortable: true },
        { label: 'Num. Factura', property: 'num_factura_vent', type: 'text', sortable: true },
        { label: 'Fecha', property: 'fecha_vent', type: 'date', sortable: true },
        { label: 'Cantidad', property: 'cantidad_vent', type: 'text', sortable: true },
        { label: 'Subtotal', property: 'sub_total_vent', type: 'currency', sortable: true },
        { label: 'Total', property: 'total_vent', type: 'currency', sortable: true },
        { label: 'Estado', property: 'estado_vent', type: 'text', sortable: true },
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
                    key: 'ide_vent',
                    color: 'primary'
                },
                {
                    action: 'delete',
                    label: 'Eliminar',
                    icon: 'delete',
                    key: 'ide_vent',
                    color: 'red'
                }
            ],
        }
    ]
}
