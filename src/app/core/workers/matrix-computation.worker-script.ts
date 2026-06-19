/**
 * Inline Web Worker script used by MatrixComputationService.
 *
 * Keeping the worker logic in a dedicated file preserves the Clean Architecture
 * worker folder while avoiding separate worker-bundle complications.
 */
export const MATRIX_COMPUTATION_WORKER_SCRIPT = `
function softmax(matrix) {
  return matrix.map((row) => {
    const max = Math.max(...row);
    const exps = row.map((value) => Math.exp(value - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((value) => value / sum);
  });
}

function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function multiply(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < b.length; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  let result;

  switch (type) {
    case 'softmax':
      result = softmax(payload);
      break;
    case 'transpose':
      result = transpose(payload);
      break;
    case 'multiply':
      result = multiply(payload.a, payload.b);
      break;
    default:
      throw new Error('Unknown operation type: ' + type);
  }

  self.postMessage(result);
});
`;
