import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiCardComponent } from '@shared/components/card/card.component';
import { UiTableListComponent } from '@shared/components/table-list/table-list.component';
import { UiTextFieldComponent } from '@shared/components/text-field/text-field.component';
import { UiButtonComponent } from '@shared/components/button/button.component';
import { Location } from '@angular/common';
import { EmpresasService } from '@services/empresas.service';
import { IEmpresa } from '@models';
import { LoadingService } from '@shared/services/loading.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    UiCardComponent,
    UiTableListComponent,
    UiTextFieldComponent,
    UiButtonComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export default class DetailsComponent {

}
