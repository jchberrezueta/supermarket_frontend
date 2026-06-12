import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PosScanService } from '@services/pos-scan.service';

@Component({
  selector: 'app-pos-mobile-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss',
})
export default class ScannerComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly posScanService = inject(PosScanService);

  public sessionId = this.route.snapshot.paramMap.get('sessionId') || '';
  public scannerToken = this.route.snapshot.queryParamMap.get('token') || '';

  public codigo = '';
  public enviando = false;
  public successMessage = '';
  public errorMessage = '';

  public enviarCodigo(): void {
    const codigo = this.codigo.trim();

    this.successMessage = '';
    this.errorMessage = '';

    if (!this.sessionId || !this.scannerToken) {
      this.errorMessage = 'No existe una sesión POS válida.';
      return;
    }

    if (!codigo) {
      this.errorMessage = 'Ingrese un código de producto.';
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
          this.successMessage = resp.response.message;
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
}
