import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location, CommonModule } from '@angular/common';
import { CategoriasService } from '@services/index';
import { LoadingService } from '@shared/services/loading.service';

interface ICategoriaView {
  ideCate: number;
  nombreCate: string;
  descripcionCate: string;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _categoriasService = inject(CategoriasService);
  private readonly _loadingService = inject(LoadingService);
  public location = inject(Location);

  protected categoria: ICategoriaView | null = null;
  protected idCategoria!: number;

  constructor() {
    const idParam = this._route.snapshot.params['id'];
    if (idParam) {
      this.idCategoria = +idParam;
      this.loadCategoria();
    }
  }

  protected loadCategoria(): void {
    this._loadingService.show();
    this._categoriasService.buscar(this.idCategoria).subscribe({
      next: (res) => {
        const data = res.data[0] as any;
        this.categoria = {
          ideCate: data.ide_cate,
          nombreCate: data.nombre_cate,
          descripcionCate: data.descripcion_cate
        };
        this._loadingService.hide();
      },
      error: () => this._loadingService.hide()
    });
  }

  protected volver(): void {
    this.location.back();
  }
}
