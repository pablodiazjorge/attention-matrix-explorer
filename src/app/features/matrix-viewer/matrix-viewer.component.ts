import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttentionDataService } from '../../core/services/attention-data.service';
import { HeadSelectorComponent } from '../head-selector/head-selector.component';
import { MatrixRendererDirective } from './matrix-renderer.directive';

@Component({
  selector: 'app-matrix-viewer',
  standalone: true,
  imports: [CommonModule, HeadSelectorComponent, MatrixRendererDirective],
  templateUrl: './matrix-viewer.component.html',
  styleUrls: ['./matrix-viewer.component.scss']
})
export class MatrixViewerComponent implements OnInit {
  private readonly dataService = inject(AttentionDataService);

  // Signals are exposed directly to the template (Angular 16 Developer Preview).
  readonly selectedMatrix = this.dataService.selectedMatrix;
  readonly selectedHeadInfo = this.dataService.selectedHeadInfo;

  ngOnInit(): void {
    void this.dataService.loadSampleData();
  }
}
