import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupOf } from '@core/utils/utilities';
import { EmpresasService } from '@services/index';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiTableListComponent } from '@shared/components/index';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IFiltroEmpresa } from 'app/models';
import { ListEmpresasConfig } from './list_empresas.config';

const IMPORTS = [
  UiTableListComponent,
  UiButtonComponent,
  UiComboBoxComponent,
  UiTextFieldComponent,
  UiCardComponent,
  ReactiveFormsModule,
];

type FilterEmpresaFormGroup = FormGroupOf<IFiltroEmpresa>;

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

  private readonly _empresasService = inject(EmpresasService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly config = ListEmpresasConfig;

  protected estadosEmpresa: IComboBoxOption[] = [];
  protected formData!: FilterEmpresaFormGroup;

  private initialFormValue!: IFiltroEmpresa;
  private idEmpresa = -1;

  constructor() {
    this.configForm();
    this.loadEstadosEmpresa();
  }

  protected configForm(): void {
    this.formData = this.formBuilder.group({
      nombreEmp: ['', [], []],
      estadoEmp: ['', [], []],
      responsableEmp: ['', [], []],
    }) as FilterEmpresaFormGroup;

    this.initialFormValue = this.formData.getRawValue();
  }

  private loadEstadosEmpresa(): void {
    this._empresasService.listarEstados().subscribe((res) => {
      this.estadosEmpresa = res ?? [];
    });
  }

  protected filtrar(): void {
    const tableListInstance = this._tableList();
    tableListInstance.filterData(this.getParams());
  }

  protected redirectToEmpresaPrecios(clickAction: string): void {
    if (clickAction !== 'redirect') {
      return;
    }

    if (this.idEmpresa > -1) {
      this._router.navigate(['../precios', this.idEmpresa], {
        relativeTo: this._route,
      });
    }
  }

  protected setIdEmpresa(elem: any): void {
    if (elem?.row) {
      this.idEmpresa = elem.row.ide_empr ?? elem.row.ideEmpr ?? -1;
      return;
    }

    this.idEmpresa = -1;
  }

  protected refreshData(actionClick: string): void {
    if (actionClick !== 'refresh') {
      return;
    }

    const tableListInstance = this._tableList();
    tableListInstance.refreshData();
    this.resetForm();
    this.idEmpresa = -1;
  }

  protected resetForm(): void {
    this.formData.reset(this.initialFormValue);
  }

  private getParams(): URLSearchParams {
    const params = new URLSearchParams();
    const filtro = this.formData.value as IFiltroEmpresa;

    this.appendParam(params, 'nombreEmp', filtro.nombreEmp);
    this.appendParam(params, 'estadoEmp', filtro.estadoEmp);
    this.appendParam(params, 'responsableEmp', filtro.responsableEmp);

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
