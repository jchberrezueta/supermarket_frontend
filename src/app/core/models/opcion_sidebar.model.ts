export interface IOpcionSidebar {
  id: number;
  titulo: string;
  ruta: string;
  icono: string;
  activo: string;
  hijas: IOpcionSidebar[];
}