import { AttentionMatrix } from './attention-matrix.model';

/**
 * Groups the three projection matrices (Q, K, V) that define one attention head.
 */
export interface AttentionHead {
  layer: number;
  head: number;
  query: AttentionMatrix;
  key: AttentionMatrix;
  value: AttentionMatrix;
}
