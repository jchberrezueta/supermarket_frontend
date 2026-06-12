import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';
import { PosScanService } from '@services/pos-scan.service';

@Component({
  selector: 'app-pos-mobile-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss',
})
export default class ScannerComponent implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly posScanService = inject(PosScanService);

  private html5QrCode?: Html5Qrcode;
  private readonly readerId = 'pos-mobile-qr-reader';

  private ultimoCodigoEnviado = '';
  private ultimoEnvioAt = 0;
  private readonly bloqueoLecturaMs = 1400;

  public sessionId = this.route.snapshot.paramMap.get('sessionId') || '';
  public scannerToken = this.route.snapshot.queryParamMap.get('token') || '';

  public codigo = '';
  public ultimoCodigoDetectado = '';

  public enviando = false;
  public camaraActiva = false;
  public iniciandoCamara = false;

  public successMessage = '';
  public errorMessage = '';
  public cameraMessage = '';

  public ngAfterViewInit(): void {
    // No iniciamos cámara automáticamente.
    // En móviles es mejor pedirlo con un botón por permisos del navegador.
  }

  public ngOnDestroy(): void {
    this.detenerCamara();
  }

  public async iniciarCamara(): Promise<void> {
    this.limpiarMensajes();
    this.cameraMessage = '';

    if (!this.sessionId || !this.scannerToken) {
      this.errorMessage = 'No existe una sesión POS válida.';
      return;
    }

    if (this.camaraActiva || this.iniciandoCamara) {
      return;
    }

    this.iniciandoCamara = true;

    try {
      this.html5QrCode = new Html5Qrcode(this.readerId);

      await this.html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: {
            width: 260,
            height: 260,
          },
          aspectRatio: 1.777778,
        },
        (decodedText) => {
          this.onCodigoDetectado(decodedText);
        },
        () => {
          // Los fallos de lectura son normales mientras no haya QR enfocado.
          // No mostramos error por cada frame.
        },
      );

      this.camaraActiva = true;
      this.cameraMessage = 'Cámara activa. Acerque el QR del producto.';
    } catch (error) {
      console.error(error);
      this.errorMessage =
        'No se pudo iniciar la cámara. Verifique permisos o use HTTPS/red local confiable.';
      this.camaraActiva = false;
    } finally {
      this.iniciandoCamara = false;
    }
  }

  public async detenerCamara(): Promise<void> {
    if (!this.html5QrCode) {
      return;
    }

    try {
      const isScanning = this.html5QrCode.isScanning;

      if (isScanning) {
        await this.html5QrCode.stop();
      }

      await this.html5QrCode.clear();
    } catch (error) {
      console.warn('No se pudo detener/limpiar el scanner', error);
    } finally {
      this.html5QrCode = undefined;
      this.camaraActiva = false;
      this.cameraMessage = 'Cámara detenida.';
    }
  }

  public enviarCodigoManual(): void {
    const codigo = this.codigo.trim();

    this.enviarCodigoAlPos(codigo, 'manual');
  }

  private onCodigoDetectado(decodedText: string): void {
    const codigo = decodedText.trim();

    if (!codigo) {
      return;
    }

    const ahora = Date.now();

    const esRepetidoMuyRapido =
      codigo === this.ultimoCodigoEnviado &&
      ahora - this.ultimoEnvioAt < this.bloqueoLecturaMs;

    if (esRepetidoMuyRapido || this.enviando) {
      return;
    }

    this.ultimoCodigoDetectado = codigo;
    this.enviarCodigoAlPos(codigo, 'camara');
  }

  private enviarCodigoAlPos(codigo: string, origen: 'manual' | 'camara'): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.sessionId || !this.scannerToken) {
      this.errorMessage = 'No existe una sesión POS válida.';
      return;
    }

    if (!codigo) {
      this.errorMessage = 'Ingrese o escanee un código de producto.';
      return;
    }

    this.enviando = true;

    this.posScanService
      .enviarCodigo(this.sessionId, {
        codigo,
        scannerToken: this.scannerToken,
      })
      .subscribe({
        next: (resp) => {
          this.ultimoCodigoEnviado = codigo;
          this.ultimoEnvioAt = Date.now();
          this.ultimoCodigoDetectado = codigo;
          this.successMessage =
            origen === 'camara'
              ? `Código escaneado y enviado: ${codigo}`
              : resp.response.message;
          this.codigo = '';
          this.enviando = false;
          this.vibrar();
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'No se pudo enviar el código al POS.';
          this.enviando = false;
        },
      });
  }

  private vibrar(): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(80);
    }
  }

  private limpiarMensajes(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
