import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTableListComponent } from '@shared/components/table-list/table-list.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { FormGroupOf } from '@core/utils/utilities';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { PreciosEmpresaConfig } from './precios.config';
import { IEmpresa, IEmpresaPrecios } from '@models';
import { ProductosService } from '@services/productos.service';
import { UiInputBoxComponent } from '@shared/components/input-box/input-box.component';
import { EmpresasService } from '@services/empresas.service';
import { Location } from '@angular/common';

import Swal from 'sweetalert2'


type EmpresaPrecioFormGroup = FormGroupOf<IEmpresaPrecios>;

@Component({
  selector: 'app-precios',
  standalone: true,
  imports: [
    UiCardComponent,
    UiTableListComponent,
    UiInputBoxComponent,
    UiTextFieldComponent,
    UiButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './precios.component.html',
  styleUrl: './precios.component.scss'
})
export default class PreciosComponent {
  private readonly _tableList = viewChild.required<UiTableListComponent>(UiTableListComponent);
  private readonly _route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly _empresasService = inject(EmpresasService);
  private readonly _productosService = inject(ProductosService);
  public location = inject(Location);
  protected readonly config = PreciosEmpresaConfig;
  protected productos!: IComboBoxOption[];
  protected empresa!: IEmpresa;
  protected nombreEmpresa: string = '';

  protected isAdd: boolean = true;
  protected idEmpresa: number = 1;

  private precioEmp!: any;
  protected formData!: EmpresaPrecioFormGroup;
  private initialFormValue!: IEmpresaPrecios;


  constructor() {
    this.initForm();

    const idParam = this._route.snapshot.params['id'];
    if(idParam){
      this.idEmpresa = +idParam;
      this.loadEmpresa();
      this.loadProductos();
    }
  }


  private initForm() {
    this.formData = this.formBuilder.group({
      ideEmprProd: [{ value: -1, disabled: true }, [Validators.required]],
      ideEmpr: [this.idEmpresa, [Validators.required], []],
      ideProd: [-1, [Validators.required], []],
      precioCompraProd: [0, [Validators.required], []],
      dctoCompraProd: [0, [Validators.required], []],
      dctoCaducidadProd: [0, [Validators.required], []],
      ivaProd: [0, [Validators.required], []]
    }) as EmpresaPrecioFormGroup;

     // snapshot inicial
    this.initialFormValue = this.formData.getRawValue();
  }
  private setData() {
    this.formData.patchValue({
      ideEmprProd: this.precioEmp?.ide_empr_prod,
      ideEmpr: this.precioEmp?.ide_empr,
      ideProd: this.precioEmp?.ide_prod,
      precioCompraProd: this.precioEmp?.precio_compra_prod,
      dctoCompraProd: this.precioEmp?.dcto_compra_prod,
      dctoCaducidadProd: this.precioEmp?.dcto_caducidad_prod,
      ivaProd: this.precioEmp?.iva_prod
    });
  }

  private loadProductos() {
    this._productosService.listarComboProductos().subscribe((res) => {
      this.productos = res;
    });
  }
  private loadEmpresa() {
    this._empresasService.buscar(this.idEmpresa).subscribe((res) => {
      const data = res.data[0];
      this.empresa = {
        ideEmp: data.ide_empr,
        nombreEmp: data.nombre_empr,
        responsableEmp: data.responsable_empr,
        fechaContratoEmp: data.fecha_contrato_empr,
        direccionEmp: data.direccion_empr,
        telefonoEmp: data.telefono_empr,
        emailEmp: data.email_empr,
        estadoEmp: data.estado_empr,
        descripcionEmp: data.descripcion_empr
      };
      this.nombreEmpresa = this.empresa.nombreEmp;
    })
  }

  protected setIdEmprProd(elem: any) {
    if(elem && elem.row){
      this.precioEmp= elem.row;
    }else{
      if(!this.isAdd){
        this.resetForm();
        this.isAdd = true;
      }
      this.precioEmp = null;
    }
  }

  protected changeModeUpdate(){
    if(this.precioEmp){
      this.isAdd = false;
      this.setData();
    }
  }

  protected changeModeInsert(){
    this.isAdd = true;
    this.precioEmp = null;
    this.resetForm();
  }

  protected guardar() {
    const data = this.formData.getRawValue() as IEmpresaPrecios;  
    console.log(data);
    if(this.formData.valid){
      if (this.isAdd) {
        this._empresasService.insertarPrecio(data).subscribe(
          (res) => {
            Swal.fire({
              title: "Precio registrado :)",
              text: "El Precio fue guardado correctamente",
              icon: "success"
            });
            this.refreshData();
          }
        );
      } else {
        if(this.precioEmp){
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
              this._empresasService.actualizarPrecio(this.precioEmp.ide_empr_prod, data).subscribe(
                (res) => {
                  Swal.fire({
                    title: "Precio actualizado :)",
                    text: "El Precio fue actualizado correctamente",
                    icon: "success"
                  });
                  this.refreshData();
                }
              );
            }
          });
          
        }
      }
    }else{
      Swal.fire({
        icon: "info",
        title: "Oops... Faltan datos",
        text: "Revise porfavor la información ingresada"
      });
    }
    
  }

  protected resetForm() {
    this.formData.reset(this.initialFormValue);
  }

  protected volver() {
     Swal.fire({
      title: "Esta Seguro de Volver?",
      text: "Los cambios realizados no se guardaran!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Volver!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetForm();
        this.isAdd = true;
        this.precioEmp = null;
        this.location.back();
      }
    });
    
  }

  protected refreshData() {
    this._tableList().refreshData();
    this.changeModeInsert();
  }
}
