import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpOptions } from '@core/models';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class RestService {

  public _apiUrl: string = environment.api_url;
  private _httpClient = inject(HttpClient);

  constructor(){}

  get<T>(url: string, options?: HttpOptions): Observable<T> {
      return this._httpClient.get<T>(this.getUrl(url), options);
  }

  post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this._httpClient.post<T>(this.getUrl(url), body, options);
  }

  patch<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this._httpClient.patch<T>(this.getUrl(url), body, options);
  }

  put<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this._httpClient.put<T>(this.getUrl(url), body, options);
  }

  delete<T>(url: string, options?: HttpOptions): Observable<T> {
    return this._httpClient.delete<T>(this.getUrl(url), options);
  }


   /**
   * Verifica si la url realiza la petición a una api local o de terceros
   * @param url
   * @returns
   */
  private getUrl(url: string) {
    if (url.includes('http') || url.includes('https')) return url;
    return this._apiUrl ? `${this._apiUrl}/${url}` : url;
  }
}