/**
 * Represents a single attention matrix for a specific layer, head and projection type.
 */
export interface AttentionMatrix {
  // Transformer layer index (1-based).
  layer: number;

  // Attention head index (1-based).
  head: number;

  // Token strings that label the rows/columns of the matrix.
  tokens: string[];

  // Square attention weights matrix (values typically in [0, 1]).
  matrix: number[][];

  // Projection type: Query, Key or Value.
  type: 'query' | 'key' | 'value';
}
