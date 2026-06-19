import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject
} from '@angular/core';
import * as d3 from 'd3';

interface CellData {
  i: number;
  j: number;
  value: number;
}

/**
 * Standalone directive that renders a numeric matrix as a centered, square D3.js heatmap.
 *
 * Usage: <svg [appMatrixRenderer]="data" [tokens]="tokens"></svg>
 */
@Directive({
  selector: 'svg[appMatrixRenderer]',
  standalone: true
})
export class MatrixRendererDirective implements OnInit, OnChanges, OnDestroy {
  @Input() appMatrixRenderer: number[][] = [];
  @Input() tokens: string[] = [];
  @Input() margin = { top: 60, right: 60, bottom: 100, left: 100 };

  private readonly el = inject(ElementRef<SVGSVGElement>);
  private readonly svg = d3.select(this.el.nativeElement);
  private resizeObserver: ResizeObserver | null = null;

  ngOnInit(): void {
    const target = this.el.nativeElement.parentElement ?? this.el.nativeElement;
    this.resizeObserver = new ResizeObserver(() => this.render());
    this.resizeObserver.observe(target);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['appMatrixRenderer'] || changes['tokens']) &&
      this.appMatrixRenderer.length > 0 &&
      this.tokens.length > 0
    ) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.svg.selectAll('*').remove();
    d3.selectAll('.d3-tooltip').remove();
  }

  private render(): void {
    const container = this.el.nativeElement.parentElement;
    if (!container) {
      return;
    }

    // Do not render until both data and dimensions are available.
    if (
      this.appMatrixRenderer.length === 0 ||
      this.tokens.length === 0 ||
      this.appMatrixRenderer.length !== this.tokens.length
    ) {
      return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    if (containerWidth === 0 || containerHeight === 0) {
      return;
    }

    this.svg.selectAll('*').remove();

    this.svg
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', '100%')
      .attr('height', '100%');

    const n = this.appMatrixRenderer.length;
    const availableWidth = containerWidth - this.margin.left - this.margin.right;
    const availableHeight = containerHeight - this.margin.top - this.margin.bottom;

    // Keep the heatmap square and choose the largest cell size that fits.
    const cellSize = Math.max(4, Math.min(availableWidth / n, availableHeight / n));
    const innerSize = cellSize * n;

    // Center the square matrix inside the SVG.
    const offsetX = this.margin.left + (availableWidth - innerSize) / 2;
    const offsetY = this.margin.top + (availableHeight - innerSize) / 2;

    const flatValues = this.appMatrixRenderer.flat();
    const maxValue = Math.max(...flatValues);
    const minValue = Math.min(...flatValues);
    const colorScale = d3.scaleSequential(d3.interpolateYlGn).domain([minValue, maxValue]);

    const xScale = d3.scaleBand<number>().domain(d3.range(n)).range([0, innerSize]).padding(0.02);
    const yScale = d3.scaleBand<number>().domain(d3.range(n)).range([0, innerSize]).padding(0.02);

    const g = this.svg
      .append('g')
      .attr('transform', `translate(${offsetX},${offsetY})`);

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#e4efe4')
      .style('color', '#1a2e1a')
      .style('padding', '0.5rem')
      .style('border-radius', '0.25rem')
      .style('font-size', '0.75rem')
      .style('border', '1px solid #6a8a6a')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    const tokens = this.tokens;

    const cells: CellData[] = this.appMatrixRenderer.flatMap((row, i) =>
      row.map((value, j) => ({ i, j, value }))
    );

    const fontSize = Math.max(8, Math.min(14, cellSize / 3));

    g.selectAll('rect')
      .data(cells)
      .join('rect')
      .attr('x', (d) => xScale(d.j) ?? 0)
      .attr('y', (d) => yScale(d.i) ?? 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', Math.max(1, cellSize / 12))
      .attr('ry', Math.max(1, cellSize / 12))
      .attr('fill', '#000000')
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .html(
            `<strong>${tokens[d.i]} \u2192 ${tokens[d.j]}</strong><br/>Weight: ${d.value.toFixed(4)}`
          );
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      })
      .transition()
      .duration(400)
      .attr('fill', (d) => colorScale(d.value));

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(0)
      .tickPadding(8)
      .tickFormat((i: number) => tokens[i] ?? '');

    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(0)
      .tickPadding(8)
      .tickFormat((i: number) => tokens[i] ?? '');

    g.append('g')
      .attr('transform', `translate(0,${innerSize})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('fill', 'var(--text-primary)')
      .style('font-size', `${fontSize}px`)
      .style('font-weight', '500');

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('fill', 'var(--text-primary)')
      .style('font-size', `${fontSize}px`)
      .style('font-weight', '500');

    g.selectAll('.domain').style('stroke', 'var(--border)');
  }
}
