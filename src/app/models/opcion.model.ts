export enum EnumEstadosOpcion {
  SI = 'si',
  NO = 'no',
}

export const ListEstadosOpcion = [
  {
    value: EnumEstadosOpcion.SI,
    label: 'Activo',
  },
  {
    value: EnumEstadosOpcion.NO,
    label: 'Inactivo',
  },
];

export const ListVisibilidadOpcion = [
  {
    value: true,
    label: 'Visible en el menú',
  },
  {
    value: false,
    label: 'Oculta en el menú',
  },
];

export interface IOpcionForm {
  ideOpci: number;
  nombreOpci: string;
  rutaOpci: string;
  activoOpci: EnumEstadosOpcion;
  descripcionOpci: string;
  nivelOpci: number;
  padreOpci: number | null;
  iconoOpci: string;
  visibleOpci: boolean;
}

export interface ICreateOpcion {
  nombreOpci: string;
  rutaOpci: string;
  activoOpci: EnumEstadosOpcion;
  descripcionOpci: string | null;
  nivelOpci: number;
  padreOpci: number | null;
  iconoOpci: string | null;
  visibleOpci: boolean;
}

export interface IUpdateOpcion extends ICreateOpcion {
  ideOpci: number;
}

export interface IOpcionResult {
  ide_opci: number;
  nombre_opci: string;
  ruta_opci: string;
  activo_opci: EnumEstadosOpcion;

  descripcion_opci: string | null;

  nivel_opci: number;

  padre_opci: number | null;

  icono_opci: string | null;

  visible_opci: boolean;

  usua_ingre?: string | null;
  fecha_ingre?: string | Date | null;
  usua_actua?: string | null;
  fecha_actua?: string | Date | null;
}

export interface IResultDataOpciones {
  data: IOpcionResult[];
  response: string;
}

export interface IFiltroOpciones {
  nombreOpci: string;
  rutaOpci: string;

  activoOpci: EnumEstadosOpcion | '';

  nivelOpci: number | '';

  padreOpci: number | '';

  visibleOpci: string;
}
