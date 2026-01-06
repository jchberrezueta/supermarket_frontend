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
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export default class FormComponent {
  
  protected estadosEmpresa!: IComboBoxOption[];
  private readonly _route = inject(ActivatedRoute);
  private readonly _empresasService = inject(EmpresasService);
  private readonly formBuilder = inject(FormBuilder);
  public location = inject(Location);
  protected formData!: EmpresaFormGroup;
  protected isAdd: boolean = true;
  private idParam: number = -1;

  constructor() {
    this.loadEstadosEmpresa();
  }

  ngOnInit() {
    const idParam = this._route.snapshot.params['id'];
    this.initForm();
    if(idParam){
      this.setData(idParam);
    }
  }

  protected initForm(): void {
    this.formData = this.formBuilder.group({
        ideEmp: [{ value: -1, disabled: true }, [Validators.required]],        
        nombreEmp: ['', [Validators.required], []],
        responsableEmp: ['', [Validators.required], []],
        fechaContratoEmp: ['', [Validators.required], []],
        direccionEmp: ['', [Validators.required], []],
        telefonoEmp: ['', [Validators.required], []],
        emailEmp: ['', [Validators.required], []],
        estadoEmp: ['', [Validators.required], []],
        descripcionEmp: ['', [Validators.required], []]
      }) as EmpresaFormGroup;
  }

  private setData(idParam: number) {
    this._empresasService.buscar(idParam).subscribe(
      (res) => {
        const empresa = res.data[0] as IEmpresaResult;
        this.idParam = empresa.ide_empr;
        this.isAdd = false;
        this.formData.patchValue({
          ideEmp: empresa.ide_empr,
          nombreEmp: empresa.nombre_empr,
          responsableEmp: empresa.responsable_empr,
          fechaContratoEmp: empresa.fecha_contrato_empr,
          direccionEmp: empresa.direccion_empr,
          telefonoEmp: empresa.telefono_empr,
          emailEmp: empresa.email_empr,
          estadoEmp: empresa.estado_empr,
          descripcionEmp: empresa.descripcion_empr
        });
      }
    )
  }

  private loadEstadosEmpresa() {
    this._empresasService.listarEstados().subscribe(
      (res) => {
        this.estadosEmpresa = res;
      }
    );
  }

  protected guardar(): void {
    if(!this.formData.invalid){
      const data = this.formData.getRawValue() as IEmpresa;
      if(this.isAdd){
        data.ideEmp = -1;
        this._empresasService.insertar(data).subscribe(
          (res) => {
            Swal.fire({
              title: "Empresa registrada :)",
              text: "La empresa fue guardada correctamente",
              icon: "success"
            });
            this.location.back();
            this.formData.reset();
          }
        );
      }else{
        Swal.fire({
          title: "Esta seguro de modificar esta empresa?",
          text: "Los cambios realizados se registraran!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, de acuerdo"
        }).then((result) => {
          if (result.isConfirmed) {
            data.ideEmp = this.idParam;
            this._empresasService.actualizar(this.idParam, data).subscribe(
              (res) => {
                Swal.fire({
                  title: "Empresa actualizada :)",
                  text: "La empresa fue actualizada correctamente",
                  icon: "success"
                });
                this.location.back();
                this.formData.reset();
              }
            );
          }
        });
        
      }
    }else{
      Swal.fire({
        icon: "info",
        title: "Oops... Faltan datos",
        text: "Revise porfavor la información ingresada"
      });
    }
  }

  protected cancelar(): void {
    Swal.fire({
      title: "Esta Seguro de Cancelar?",
      text: "Los cambios realizados no se guardaran!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Cancelar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.formData.reset();
        this.location.back();
      }
    });
    
  }
}
