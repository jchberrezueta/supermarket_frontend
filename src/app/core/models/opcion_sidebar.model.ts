export interface IOpcionSidebar {
  id: number;
  titulo: string;
  ruta: string;
  activo: string;
  hijas: IOpcionSidebar[];
}