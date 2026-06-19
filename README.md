# Attention Matrix Explorer (Jul 2023 - Nov 2023)

Interactive client-side visualization of transformer attention matrices (Query, Key, Value).

Built with **Angular 16.2.12**, **D3.js 7.8.5**, **RxJS 7.8.1**, **TypeScript 5.1.6** and **Node.js 18.18.0**.

## What is this project?

This project is an interactive explorer for transformer **attention matrices**. It visualizes the Query (Q), Key (K) and Value (V) projection matrices that power the self-attention mechanism at the heart of modern large language models.

The work is inspired by the seminal paper **"Attention Is All You Need"**, published in 2017 by researchers at **Google Brain** and **Google Research** (Vaswani et al.). This paper revolutionized artificial intelligence by introducing the **Transformer architecture**, which replaced recurrence and convolutions with the **self-attention mechanism**. Self-attention allows a model to weigh the importance of different positions in a sequence when encoding each token, enabling unprecedented parallelization and long-range dependency modeling.

This application was built as a learning and portfolio project to demonstrate how attention weights can be rendered in real time using Angular 16 and D3.js, while keeping the computation of matrix operations (such as softmax, transpose and matrix multiplication) on a dedicated Web Worker.

## Features

- Standalone Angular 16 components (no NgModules).
- Reactive state with Angular 16 Signals (`signal`, `computed`) — Developer Preview.
- D3.js heatmap rendering with Viridis color scale, token axes and hover tooltips.
- Web Worker off-load for matrix computations (softmax, transpose, multiply).
- Clean architecture: `core` (models, services, utils) and `features` (viewer, selector).

## Prerequisites

- Node.js **18.18.0**
- npm (bundled with Node.js)

## Install exact dependencies

```bash
npm install
```

The `package.json` pins the versions required by the project:

| Package | Version |
|---------|---------|
| Angular / Angular CLI | 16.2.12 |
| TypeScript | 5.1.6 |
| RxJS | 7.8.1 |
| D3.js | 7.8.5 |
| Zone.js | 0.13.1 |

## Run the development server

```bash
npm start
```

This executes `ng serve` under the hood. Then open `http://localhost:4200/` in your browser.

## Build for production

```bash
ng build
```

The output is generated in `dist/attention-matrix-explorer/`.

## Project structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # AttentionMatrix, AttentionHead
│   │   ├── services/        # AttentionDataService, MatrixComputationService
│   │   ├── utils/           # D3 color scales
│   │   └── workers/         # Web Worker for matrix math
│   ├── features/
│   │   ├── matrix-viewer/   # Main viewer + D3 directive
│   │   └── head-selector/   # Layer / head / type controls
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/sample-data/      # attention-sample.json
├── environments/
└── index.html
```

## Implementation notes

- The application is built with Angular 16's **Developer Preview** of Signals, which are used as the reactive state primitive for the loaded matrices and the current selection.
- The template syntax relies on the structural directives available in Angular 16 (`*ngIf`, `*ngFor`).

## License

This project's code is licensed under the [MIT License](LICENSE).