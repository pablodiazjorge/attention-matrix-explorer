import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MATRIX_COMPUTATION_WORKER_SCRIPT } from '../workers/matrix-computation.worker-script';

/**
 * Off-loads matrix calculations to a dedicated Web Worker.
 * The worker is created from an inline script blob so it works reliably
 * in development and production builds.
 */
@Injectable({
  providedIn: 'root'
})
export class MatrixComputationService {
  private worker: Worker | null = null;

  constructor() {
    if (environment.useWorker && typeof Worker !== 'undefined') {
      const blob = new Blob([MATRIX_COMPUTATION_WORKER_SCRIPT], {
        type: 'application/javascript'
      });
      this.worker = new Worker(URL.createObjectURL(blob));
    }
  }

  computeSoftmax(matrix: number[][]): Observable<number[][]> {
    return this.runWorker('softmax', matrix);
  }

  computeTranspose(matrix: number[][]): Observable<number[][]> {
    return this.runWorker('transpose', matrix);
  }

  computeMultiply(a: number[][], b: number[][]): Observable<number[][]> {
    return this.runWorker('multiply', { a, b });
  }

  private runWorker(type: string, payload: unknown): Observable<number[][]> {
    return new Observable<number[][]>((observer) => {
      if (!this.worker) {
        observer.error(new Error('Web Worker not available'));
        return;
      }

      const handler = (event: MessageEvent<number[][]>) => {
        this.worker!.removeEventListener('message', handler);
        observer.next(event.data);
        observer.complete();
      };

      this.worker.addEventListener('message', handler);
      this.worker.postMessage({ type, payload });
    });
  }
}
