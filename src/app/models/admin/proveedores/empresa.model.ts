import { EnumEstadosEmpresa } from "./estado_empresa.enum";

export interface IEmpresa {
    ideEmp: number;
    nombreEmp: string;
    responsableEmp: string;
    direccionEmp: string;
    telefonoEmp: string;
    emailEmp: string;
    fechaContratoEmp: string;
}

export interface IFiltroEmpresa {
    nombreEmp: string;
    estadoEmp: EnumEstadosEmpresa;
    responsableEmp: string;
}