import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpOptions } from '@core/models';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl: string = environment.api_url;

  constructor() {}

  public get<T>(url: string, options?: HttpOptions): Observable<T> {
    return this._httpClient.get<T>(this.getUrl(url), options);
  }

  public post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this._httpClient.post<T>(this.getUrl(url), body, options);
  }

  public patch<T>(
    url: string,
    body: any,
    options?: HttpOptions,
  ): Observable<T> {
    return this._httpClient.patch<T>(this.getUrl(url), body, options);
  }

  public put<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this._httpClient.put<T>(this.getUrl(url), body, options);
  }

  public delete<T>(url: string, options?: HttpOptions): Observable<T> {
    return this._httpClient.delete<T>(this.getUrl(url), options);
  }

  private getUrl(url: string): string {
    const normalizedUrl = url.trim();

    if (/^https?:\/\//i.test(normalizedUrl) || normalizedUrl.startsWith('/')) {
      return normalizedUrl;
    }

    if (!this._apiUrl) {
      return normalizedUrl;
    }

    return `${this._apiUrl.replace(/\/+$/, '')}/${normalizedUrl.replace(/^\/+/, '')}`;
  }
}
