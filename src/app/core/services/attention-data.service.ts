import { Injectable, Signal, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AttentionHead } from '../models/attention-head.model';
import { AttentionMatrix } from '../models/attention-matrix.model';

/**
 * Central data service for the attention matrix explorer.
 *
 * Angular 16 Signals are in Developer Preview. They are used here as the reactive
 * state primitive to expose the loaded matrices and the current selection.
 */
@Injectable({
  providedIn: 'root'
})
export class AttentionDataService {
  // Internal writable signals (Angular 16 Developer Preview).
  private readonly _matrices = signal<AttentionMatrix[]>([]);
  private readonly _selectedLayer = signal<number>(1);
  private readonly _selectedHead = signal<number>(1);
  private readonly _selectedType = signal<'query' | 'key' | 'value'>('query');

  // Readonly signal of every loaded attention matrix.
  readonly matrices: Signal<AttentionMatrix[]> = this._matrices.asReadonly();

  // Readonly signal of distinct layers present in the loaded data.
  readonly availableLayers: Signal<number[]> = computed(() =>
    [...new Set(this._matrices().map((m) => m.layer))].sort((a, b) => a - b)
  );

  // Readonly signal of distinct heads present in the loaded data.
  readonly availableHeads: Signal<number[]> = computed(() =>
    [...new Set(this._matrices().map((m) => m.head))].sort((a, b) => a - b)
  );

  // Readonly signal that resolves the currently selected matrix, if any.
  readonly selectedMatrix: Signal<AttentionMatrix | undefined> = computed(() => {
    return this._matrices().find(
      (matrix) =>
        matrix.layer === this._selectedLayer() &&
        matrix.head === this._selectedHead() &&
        matrix.type === this._selectedType()
    );
  });

  // Readonly signal that groups Q/K/V matrices for the selected head.
  readonly selectedHeadInfo: Signal<AttentionHead | undefined> = computed(() => {
    const layer = this._selectedLayer();
    const head = this._selectedHead();
    const matrices = this._matrices();

    const query = matrices.find(
      (m) => m.layer === layer && m.head === head && m.type === 'query'
    );
    const key = matrices.find(
      (m) => m.layer === layer && m.head === head && m.type === 'key'
    );
    const value = matrices.find(
      (m) => m.layer === layer && m.head === head && m.type === 'value'
    );

    if (!query || !key || !value) {
      return undefined;
    }

    return { layer, head, query, key, value };
  });

  constructor(private readonly http: HttpClient) {}

  // Loads the bundled sample JSON and publishes the matrices through the signal.
  async loadSampleData(): Promise<void> {
    const data = await firstValueFrom(
      this.http.get<AttentionMatrix[]>('assets/sample-data/attention-sample.json')
    );
    this._matrices.set(data);
  }

  // Updates the current selection signals.
  selectHead(layer: number, head: number, type: string): void {
    this._selectedLayer.set(layer);
    this._selectedHead.set(head);
    this._selectedType.set(type as 'query' | 'key' | 'value');
  }
}
