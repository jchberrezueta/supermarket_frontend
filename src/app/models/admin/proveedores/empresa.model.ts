import { EnumEstadosEmpresa } from "./estado_empresa.enum";

export interface IEmpresa {
    ideEmp?: number | null | undefined;
    nombreEmp: string | null | undefined;
    responsableEmp: string | null | undefined;
    fechaContratoEmp: string | null | undefined;
    direccionEmp: string | null | undefined;
    telefonoEmp: string | null | undefined;
    emailEmp: string | null | undefined;
    estadoEmp: EnumEstadosEmpresa | null | undefined;
    descripcionEmp: string | null | undefined;
}

export interface IEmpresaResult {
    ide_empr?: number;
    nombre_empr: string;
    responsable_empr: string;
    descripcion_empr: string;
    direccion_empr: string;
    telefono_empr: string;
    email_empr: string;
    fecha_contrato_empr: string;
    estado_empr: EnumEstadosEmpresa;
}

export interface IFiltroEmpresa {
    nombreEmp: string;
    estadoEmp: EnumEstadosEmpresa;
    responsableEmp: string;
}