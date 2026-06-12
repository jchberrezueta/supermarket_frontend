import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-label.component.html',
  styleUrl: './qr-label.component.scss',
})
export class QrLabelComponent implements OnChanges {
  @Input() title = 'SuperMarket';
  @Input() subtitle = '';
  @Input() code = '';
  @Input() footer = '';
  @Input() size = 180;
  @Input() showCode = true;

  public qrDataUrl = '';
  public errorMessage = '';

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] || changes['size']) {
      this.generarQr();
    }
  }

  private async generarQr(): Promise<void> {
    this.errorMessage = '';
    this.qrDataUrl = '';

    const value = this.code?.trim();

    if (!value) {
      this.errorMessage = 'No existe un código para generar QR.';
      return;
    }

    try {
      this.qrDataUrl = await QRCode.toDataURL(value, {
        width: this.size,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
    } catch {
      this.errorMessage = 'No se pudo generar el código QR.';
    }
  }
}
