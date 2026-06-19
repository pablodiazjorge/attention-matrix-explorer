import * as d3 from 'd3';

/**
 * Builds a sequential green color scale for the provided numeric domain.
 * @param domain Two-element tuple with [min, max].
 */
export function createGreenScale(domain: [number, number]): d3.ScaleSequential<string, never> {
  return d3.scaleSequential(d3.interpolateYlGn).domain(domain);
}
