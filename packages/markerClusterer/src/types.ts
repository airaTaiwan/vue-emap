import type { VNode } from 'vue'

import type { Cluster } from './cluster'

export interface AlgorithmInput {
  markers: VNode[]
}

export interface AlgorithmOutput {
  /**
   * A boolean flag indicating that the clusters have not changed.
   */
  changed?: boolean

  /**
   * The clusters returned based upon the {@link AlgorithmInput}.
   */
  clusters: Cluster[]
}

export interface Algorithm {
  /**
   * Calculates an array of {@link Cluster}.
   */
  calculate: (zoom: number, { markers }: AlgorithmInput) => AlgorithmOutput
}

export interface MarkerClustererOptions {
  /**
   * The algorithm {@link Algorithm} to use for clustering.
   *
   * @default GridAlgorithm
   */
  algorithm?: Algorithm
}
