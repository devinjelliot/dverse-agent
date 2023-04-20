export interface GraphNode {
    id: string;
  }
  
  export interface GraphLink {
    source: string;
    target: string;
    value: number;
  }
  
  export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
  }
  
  export const dummyGraph: GraphData = {
    nodes: [
      { id: 'word1' },
      { id: 'word2' },
      { id: 'word3' },
      { id: 'word4' },
      { id: 'word5' },
      { id: 'word6' },
      { id: 'word7' },
      { id: 'word8' },
      { id: 'word9' },
      { id: 'word10' },
    ],
    links: [
      { source: 'word1', target: 'word2', value: 1 },
      { source: 'word1', target: 'word3', value: 1 },
      { source: 'word1', target: 'word4', value: 1 },
      { source: 'word2', target: 'word4', value: 1 },
      { source: 'word2', target: 'word5', value: 1 },
      { source: 'word3', target: 'word6', value: 1 },
      { source: 'word4', target: 'word5', value: 1 },
      { source: 'word4', target: 'word6', value: 1 },
      { source: 'word4', target: 'word7', value: 1 },
      { source: 'word5', target: 'word8', value: 1 },
      { source: 'word6', target: 'word9', value: 1 },
      { source: 'word7', target: 'word10', value: 1 },
      { source: 'word8', target: 'word10', value: 1 },
      { source: 'word9', target: 'word10', value: 1 },
    ],
  };
  