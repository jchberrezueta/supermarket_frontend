import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { environment } from '../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface ICrearSesionPosScanResponse {
  sessionId: string;
  scannerToken: string;
  createdAt: string | Date;
  expiresAt: string | Date;
  createdBy: {
    userId: number;
    username: string;
    perfil: string;
  };
}

export interface IProductoEscaneadoEvent {
  codigo: string;
  scannedAt: string;
  source: 'mobile-scanner';
}

export interface IEnviarCodigoScan {
  codigo: string;
  scannerToken: string;
}

interface IPosScanApiResponse<T> {
  data: T;
  response: {
    success: boolean;
    message: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PosScanService {
  private readonly restService = inject(RestService);
  private readonly apiUrl = 'ventas/pos/scan';

  private socket?: Socket;
  private readonly productoEscaneadoSubject =
    new Subject<IProductoEscaneadoEvent>();

  public crearSesion(): Observable<
    IPosScanApiResponse<ICrearSesionPosScanResponse>
  > {
    return this.restService.post<
      IPosScanApiResponse<ICrearSesionPosScanResponse>
    >(`${this.apiUrl}/session`, {});
  }

  public enviarCodigo(
    sessionId: string,
    body: IEnviarCodigoScan,
  ): Observable<IPosScanApiResponse<{ sessionId: string; codigo: string }>> {
    return this.restService.post<
      IPosScanApiResponse<{ sessionId: string; codigo: string }>
    >(`${this.apiUrl}/${sessionId}/producto`, body);
  }

  public cerrarSesion(
    sessionId: string,
  ): Observable<IPosScanApiResponse<{ sessionId: string; active: boolean }>> {
    return this.restService.post<
      IPosScanApiResponse<{ sessionId: string; active: boolean }>
    >(`${this.apiUrl}/${sessionId}/cerrar`, {});
  }

  public conectarPos(sessionId: string): void {
    this.desconectar();

    this.socket = io(environment.posScanSocketUrl, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.socket?.emit('join-pos-session', { sessionId });
    });

    this.socket.on('pos-session-joined', () => {
      console.log('POS conectado a sesión de escaneo:', sessionId);
    });

    this.socket.on('pos-session-error', (error) => {
      console.error('Error en sesión POS:', error);
    });

    this.socket.on('producto-escaneado', (payload: IProductoEscaneadoEvent) => {
      this.productoEscaneadoSubject.next(payload);
    });

    this.socket.on('disconnect', () => {
      console.warn('Socket POS desconectado');
    });
  }

  public onProductoEscaneado(): Observable<IProductoEscaneadoEvent> {
    return this.productoEscaneadoSubject.asObservable();
  }

  public desconectar(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
  }

  public buildScannerUrl(sessionId: string, scannerToken: string): string {
    return `${environment.appBaseUrl}/pos-scanner/${sessionId}?token=${scannerToken}`;
  }
}
