import { IOpcionSidebar } from "./opcion_sidebar.model";
import { IRuta } from "./rutas.model";

export interface IUsuario {
  id: number;
  username: string;
  state: string;
  perfil: string;
  permisos: IRuta[];
  rutas_sidebar: IOpcionSidebar[];
}