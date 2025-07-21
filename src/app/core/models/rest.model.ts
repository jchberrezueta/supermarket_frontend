import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpOptions {
    /*
    *Cabecera
    --son pares clave-valor que se envian junto al rep http al servidor
      para dar info adicional (metadatos o insturcciones extra sobre la req o el cliente)
      [envio de tokens, credenciales, tipo de contenido, etc]
    */
    headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      }
    | undefined;
    /*
    *Objeto para pasar info adicional junto a la req http
    --no se envia al backend, solo dentro de angular, como una bandera
    */
    context?: HttpContext | undefined;
    /*
    *Que quieres recibir de la resp http del backend?
    --x defecto body: solo json del resp
    --response: objeto completo de la resp http (body, status, headers, url)
    --events(si reportProgress is true): secuencia de eventos a lo largo del ciclo de ida de la --peticion (progreso carga/subida archivos)
    */
    observe?: 'body' | 'response' | 'events' | any;
    /* 
     *Defines los parametros de consulta que se agregan a la URL de la peticion http
    */
    params?: HttpParams | undefined;
    /*
     *Inidicar a Angular si debe informar sobre el progreso de la peticion
    */
    reportProgress?: boolean | undefined;
    /*
     *Tipo de repsuesta que se espera del servidor
     --x defecto: json
     --text: texto plano
     --blob: archivo binario (pdf, img, files)
     --arraybuffer: datos binarios en un buffer (datos binarios sin procesar)
     */
    responseType?: 'json' | 'blob' | any;
    /*
     *Permitir el envio de cookies y credenciales en peticiones cross-origin
    */
    withCredentials?: boolean | undefined;
}