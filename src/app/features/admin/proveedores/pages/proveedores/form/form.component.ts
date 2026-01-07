import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { FormGroupOf } from '@core/utils/utilities';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IProveedor, IProveedorResult } from '@models';
import { ProveedoresService, EmpresasService } from '@services/index';
import { UiTextFieldComponent } from '../../../../../../shared/components/text-field/text-field.component';
import { UiComboBoxComponent } from '../../../../../../shared/components/combo-box/combo-box.component';
import { UiDatetimePickerComponent } from '../../../../../../shared/components/datetime-picker/datetime-picker.component';
import { UiButtonComponent } from '../../../../../../shared/components/button/button.component';
import { UiTextAreaComponent } from '../../../../../../shared/components/text-area/text-area.component';

type ProveedorFormGroup = FormGroupOf<IProveedor>;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    UiTextFieldComponent,
    UiComboBoxComponent,
    UiDatetimePickerComponent,
    UiButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {

  private readonly _route = inject(ActivatedRoute);
  private readonly _fb = inject(FormBuilder);
  private readonly _proveedoresService = inject(ProveedoresService);
  private readonly _empresasService = inject(EmpresasService);
  public location = inject(Location);

  protected formData!: ProveedorFormGroup;
  protected empresas!: IComboBoxOption[];

  protected isAdd = true;
  private idParam = -1;

  constructor() {
    this.loadEmpresas();
  }

  ngOnInit(): void {
    this.initForm();

    const id = this._route.snapshot.params['id'];
    if (id) {
      this.isAdd = false;
      this.idParam = +id;
      this.setData(this.idParam);
    }
  }

  private initForm() {
    this.formData = this._fb.group({
      ideProv: [{ value: -1, disabled: true }, Validators.required],
      ideEmpr: [-1, Validators.required],
      cedulaProv: ['', Validators.required],
      primerNombreProv: ['', Validators.required],
      segundoNombreProv: [''],
      apellidoPaternoProv: ['', Validators.required],
      apellidoMaternoProv: [''],
      fechaNacimientoProv: ['', Validators.required],
      edadProv: [0, Validators.required],
      telefonoProv: ['', Validators.required],
      emailProv: ['', Validators.required],
    }) as ProveedorFormGroup;
  }

  private loadEmpresas() {
    this._empresasService.listarComboEmpresas().subscribe(res => {
      this.empresas = res;
    });
  }

  private setData(id: number) {
    this._proveedoresService.buscar(id).subscribe(res => {
      const p = res.data[0] as IProveedorResult;
      this.formData.patchValue({
        ideProv: p.ide_prov,
        ideEmpr: p.ide_empr,
        cedulaProv: p.cedula_prov,
        primerNombreProv: p.primer_nombre_prov,
        segundoNombreProv: p.segundo_nombre_prov,
        apellidoPaternoProv: p.apellido_paterno_prov,
        apellidoMaternoProv: p.apellido_materno_prov,
        fechaNacimientoProv: p.fecha_nacimiento_prov,
        edadProv: p.edad_prov,
        telefonoProv: p.telefono_prov,
        emailProv: p.email_prov
      });
    });
  }

  protected guardar() {
    const data = this.formData.getRawValue() as IProveedor;

    if (this.isAdd) {
      data.ideProv = -1;
      this._proveedoresService.insertar(data).subscribe();
    } else {
      this._proveedoresService.actualizar(this.idParam, data).subscribe();
    }
  }

  protected cancelar() {
    this.formData.reset();
    this.location.back();
  }
}
