import { ITableListConfig } from '@shared/models/table-list.model';

export const PreciosEmpresaConfig: ITableListConfig = {
  dataKey: 'ide_empr_prod',
  columns: [
    { label: 'ID', property: 'ide_empr_prod', type: 'text'},
    { label: 'Producto', property: 'nombre_prod', type: 'text' },
    { label: 'Precio Compra', property: 'precio_compra_prod', type: 'text' },
    { label: 'Dcto Compra', property: 'dcto_compra_prod', type: 'text' },
    { label: 'Dcto Caducidad', property: 'dcto_caducidad_prod', type: 'text' },
    { label: 'IVA', property: 'iva_prod', type: 'text' }
  ]
};
