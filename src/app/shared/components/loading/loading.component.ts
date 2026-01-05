import { Component, inject, input, Input } from '@angular/core';
import { LoadingService } from '@shared/services/loading.service';

@Component({
  selector: 'ui-loading',
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class UiLoadingComponent {
    loadingService = inject(LoadingService);
}
