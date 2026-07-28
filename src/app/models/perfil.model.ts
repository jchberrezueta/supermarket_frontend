export type ValorPermiso = 'si' | 'no';

export interface IPerfil {
  idePerf: number;
  ideRol: number;
  nombrePerf: string;
  descripcionPerf: string;
}

export interface ICreatePerfil {
  ideRol: number;
  nombrePerf: string;
  descripcionPerf: string;
}

export interface IUpdatePerfil {
  idePerf: number;
  ideRol: number;
  nombrePerf: string;
  descripcionPerf: string;
}

export interface IPerfilResult {
  ide_perf: number;
  ide_rol: number;
  nombre_rol?: string | null;
  nombre_perf: string;
  descripcion_perf: string | null;
}

export interface IResultDataPerfil {
  data: IPerfilResult[];
  response: string;
}

export interface IFiltroPerfil {
  ideRol: string;
  nombreRol: string;
  nombrePerf: string;
  descripcionPerf: string;
}

export interface IPerfilPermisosInfo {
  ide_perf: number;
  nombre_perf: string;
  descripcion_perf: string | null;
}

export interface IPermisoPerfilOpcion {
  ide_perf_opci: number | null;

  ide_opci: number;
  nombre_opci: string;
  ruta_opci: string;

  descripcion_opci: string | null;

  activo_opci: 'si' | 'no';

  visible_opci: boolean;
  nivel_opci: number;

  padre_opci: number | null;

  icono_opci: string | null;

  asignado: boolean;

  listar: ValorPermiso;
  insertar: ValorPermiso;
  modificar: ValorPermiso;
  eliminar: ValorPermiso;
}

export interface IPerfilPermisosResponse {
  success: boolean;

  data: {
    perfil: IPerfilPermisosInfo;

    permisos: IPermisoPerfilOpcion[];
  };

  response: string;
}

export interface IGuardarPermisoPerfil {
  ideOpci: number;
  listar: ValorPermiso;
  insertar: ValorPermiso;
  modificar: ValorPermiso;
  eliminar: ValorPermiso;
}

export interface IGuardarPermisosPerfilRequest {
  permisos: IGuardarPermisoPerfil[];
}
