import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = signal<boolean>(false);
  private _message = signal<string>('Cargando...');

  // 🔹 señales públicas (solo lectura)
  loading = this._loading.asReadonly();
  message = this._message.asReadonly();

  show(message?: string) {
    if (message) {
      this._message.set(message);
    }
    this._loading.set(true);
  }

  hide() {
    setTimeout(() => {
        this._loading.set(false);
    }, 1000);
  }
}
