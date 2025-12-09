import { IEmpresa } from "@models/proveedores";
import { EnumEstadosEmpresa } from "@models/proveedores/estado_empresa.enum";

export class Empresa implements IEmpresa {
    ideEmp?: number | null | undefined;
    nombreEmp: string | null | undefined;
    responsableEmp: string | null | undefined;
    fechaContratoEmp: string | null | undefined;
    direccionEmp: string | null | undefined;
    telefonoEmp: string | null | undefined;
    emailEmp: string | null | undefined;
    estadoEmp: EnumEstadosEmpresa | null | undefined;
    descripcionEmp: string | null | undefined;

    constructor(ideEmp: number | null | undefined, nombreEmp: string | null | undefined, responsableEmp: string | null | undefined, fechaContratoEmp: string | null | undefined, direccionEmp: string | null | undefined, telefonoEmp: string | null | undefined, emailEmp: string | null | undefined, estadoEmp: EnumEstadosEmpresa | null | undefined, descripcionEmp: string | null | undefined ) {
        this.ideEmp = ideEmp || -1;
        this.nombreEmp = nombreEmp;
        this.responsableEmp = responsableEmp;
        this.fechaContratoEmp = fechaContratoEmp;
        this.direccionEmp = direccionEmp;
        this.telefonoEmp = telefonoEmp;
        this.emailEmp = emailEmp;
        this.estadoEmp = estadoEmp;
        this.descripcionEmp = descripcionEmp;
    }
    
}