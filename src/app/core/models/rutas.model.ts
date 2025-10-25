export interface IRuta {
  ruta: string;
  nombre: string;
  listar: boolean;
  insertar: boolean;
  modificar: boolean;
  eliminar: boolean;
  activo: boolean;
  nivel: number;
  padre: number;
}