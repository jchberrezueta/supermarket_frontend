import { IUsuario } from "./usuarios.model";

export interface IResultLogin {
    access_token: string;
    user: IUsuario
}