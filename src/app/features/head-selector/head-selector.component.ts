import { Component, EventEmitter, Output, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttentionDataService } from '../../core/services/attention-data.service';

interface TypeOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-head-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './head-selector.component.html',
  styleUrls: ['./head-selector.component.scss']
})
export class HeadSelectorComponent {
  @Output() selectionChange = new EventEmitter<{ layer: number; head: number; type: string }>();

  private readonly dataService = inject(AttentionDataService);

  // Options are derived from the loaded sample data via Signals.
  readonly layers: Signal<number[]> = this.dataService.availableLayers;
  readonly heads: Signal<number[]> = this.dataService.availableHeads;
  types: TypeOption[] = [
    { label: 'Query', value: 'query' },
    { label: 'Key', value: 'key' },
    { label: 'Value', value: 'value' }
  ];

  selectedLayer = 1;
  selectedHead = 1;
  selectedType = 'query';

  onChange(): void {
    this.dataService.selectHead(this.selectedLayer, this.selectedHead, this.selectedType);
    this.selectionChange.emit({
      layer: this.selectedLayer,
      head: this.selectedHead,
      type: this.selectedType
    });
  }
}
