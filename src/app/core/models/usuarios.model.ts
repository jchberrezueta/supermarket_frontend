import { IRuta } from "./rutas.model";

export interface IUsuario {
  id: number;
  username: string;
  state: string;
  perfil: string;
  permisos: IRuta[];
}