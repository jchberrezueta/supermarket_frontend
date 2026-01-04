import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiTextFieldComponent } from "@shared/components/text-field/text-field.component";
import { UiButtonComponent } from "@shared/components/button/button.component";
import { ActivatedRoute } from '@angular/router';
import { UiDatetimePickerComponent } from "@shared/components/datetime-picker/datetime-picker.component";
import { FormGroupOf } from '@core/utils/utilities';
import { UiTextAreaComponent } from "@shared/components/text-area/text-area.component";
import { IEmpresa, IEmpresaResult, ListEstadosEmpresa } from '@models';
import { UiComboBoxComponent } from '@shared/components/combo-box/combo-box.component';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import Swal from 'sweetalert2'
import { Location } from '@angular/common'; // 1. Importar Location
import { EmpresasService } from '@services/index';

const IMPORTS = [
  UiTextFieldComponent, 
  UiTextAreaComponent,
  UiDatetimePickerComponent,
  UiComboBoxComponent,
  UiButtonComponent,
  ReactiveFormsModule, 
];

type EmpresaFormGroup = FormGroupOf<IEmpresa>;


@Component({
  selector: 'app-form',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './empresas-precios.component.html',
  styleUrl: './empresas-precios.component.scss'
})
export default class EmpresasPreciosComponent {
  
  
}
