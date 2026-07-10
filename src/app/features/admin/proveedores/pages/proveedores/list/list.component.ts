import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroupOf } from '@core/utils/utilities';
import { ProveedoresService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroProveedor } from 'app/models';
import { ListProveedoresConfig } from './list_proveedores.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiInputBoxComponent,
  UiTextFieldComponent,
  UiCardComponent,
  ReactiveFormsModule,
];

type FilterProveedorFormGroup = FormGroupOf<IFiltroProveedor>;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export default class ListComponent {
  private readonly _tableList =
    viewChild.required<UiTableListComponent>(UiTableListComponent);

  private readonly _proveedoresService = inject(ProveedoresService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListProveedoresConfig;

  protected opcionesCedula: IComboBoxOption[] = [];
  protected opcionesPrimerNombre: IComboBoxOption[] = [];
  protected opcionesApellidoPaterno: IComboBoxOption[] = [];
  protected opcionesEmail: IComboBoxOption[] = [];

  protected formData!: FilterProveedorFormGroup;

  private initialFormValue!: IFiltroProveedor;

  constructor() {
    this.configForm();
    this.loadComboCedulas();
    this.loadComboPrimerNombre();
    this.loadComboApellidoPaterno();
    this.loadComboEmail();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      ideEmpr: ['', [], []],
      cedulaProv: ['', [], []],
      primerNombreProv: ['', [], []],
      apellidoPaternoProv: ['', [], []],
      emailProv: ['', [], []],
    }) as FilterProveedorFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadComboCedulas(): void {
    this._proveedoresService.listarComboCedula().subscribe((res) => {
      this.opcionesCedula = res ?? [];
    });
  }

  private loadComboPrimerNombre(): void {
    this._proveedoresService.listarComboPrimerNombre().subscribe((res) => {
      this.opcionesPrimerNombre = res ?? [];
    });
  }

  private loadComboApellidoPaterno(): void {
    this._proveedoresService.listarComboApellidoPaterno().subscribe((res) => {
      this.opcionesApellidoPaterno = res ?? [];
    });
  }

  private loadComboEmail(): void {
    this._proveedoresService.listarComboEmail().subscribe((res) => {
      this.opcionesEmail = res ?? [];
    });
  }

  protected filtrar(): void {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  protected refreshData(actionClick: string): void {
    if (actionClick !== 'refresh') {
      return;
    }

    const tableListInstance = this._tableList();
    tableListInstance.refreshData();
    this.resetForm();
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroProveedor;

    this.appendParam(params, 'ideEmpr', filtro.ideEmpr);
    this.appendParam(params, 'cedulaProv', filtro.cedulaProv);
    this.appendParam(params, 'primerNombreProv', filtro.primerNombreProv);
    this.appendParam(params, 'apellidoPaternoProv', filtro.apellidoPaternoProv);
    this.appendParam(params, 'emailProv', filtro.emailProv);

    return params;
  }

  private appendParam(
    params: URLSearchParams,
    key: string,
    value: unknown,
  ): void {
    if (value === null || value === undefined) {
      return;
    }

    const stringValue = String(value).trim();

    if (stringValue === '') {
      return;
    }

    params.append(key, stringValue);
  }
}
