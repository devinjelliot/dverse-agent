import React, { useEffect } from 'react';
import * as d3 from 'd3';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  value: number;
}

interface GraphData {
  nodes: Array<GraphNode>;
  links: Array<GraphLink>;
}

interface WordGraphProps {
  data: GraphData;
}

const WordGraph: React.FC<WordGraphProps> = ({ data }) => {
  function drag(simulation: d3.Simulation<GraphNode, undefined>) {
    function dragStarted(event: d3.D3DragEvent<any, GraphNode, any>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      showTooltip(event.sourceEvent, d);
    }

    function dragged(event: d3.D3DragEvent<any, GraphNode, any>, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: d3.D3DragEvent<any, GraphNode, any>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      hideTooltip();
    }

    return d3
      .drag<any, GraphNode, any>()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);
  }
  
  function renderGraph(data: GraphData) {
        // Set the dimensions of the graph
        const width = 800;
        const height = 600;
      
        // Remove any existing SVG elements to avoid duplicate graphs
        d3.select('#graph').selectAll('*').remove();
      
        // Create an SVG container for the graph
        const svg = d3
          .select('#graph')
          .append('svg')
          .attr('width', width)
          .attr('height', height);
      
        // Create a simulation with force-directed layout
        const simulation = d3
          .forceSimulation<GraphNode>(data.nodes)
          .force(
            'link',
            d3.forceLink<GraphNode, GraphLink>(data.links).id((d) => d.id)
          )
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(width / 2, height / 2));
      
        // Add lines for the links between nodes
        const link = svg
          .selectAll('.link')
          .data(data.links)
          .enter()
          .append('line')
          .attr('class', 'link')
          .attr('stroke', '#999')
          .attr('stroke-opacity', 0.6)
          .attr('stroke-width', (d) => Math.sqrt(d.value));
      
        // Add circles for the nodes
        const node = svg
    .selectAll('.node')
    .data(data.nodes)
    .enter()
    .append('circle')
    .attr('class', 'node')
    .attr('r', 5)
    .attr('fill', '#1f77b4')
    .call(drag(simulation))
    .on('mouseenter', showTooltip)
    .on('mouseleave', hideTooltip)
    .on('touchstart', (event, d) => {
      const point = d3.pointer(event, event.currentTarget);
      const pageX = point[0];
      const pageY = point[1];
      const tooltip = d3.select("#graph-tooltip");
      tooltip
        .style("left", `${pageX}px`)
        .style("top", `${pageY - 28}px`)
        .style("opacity", 1)
        .text(d.id);
    })
    .on('touchend', hideTooltip)
    .on('touchmove', (event, d) => {
      const point = d3.pointer(event, event.currentTarget);
      const pageX = point[0];
      const pageY = point[1];
      const tooltip = d3.select("#graph-tooltip");
      tooltip
        .style("left", `${pageX}px`)
        .style("top", `${pageY - 28}px`)
        .style("opacity", 1)
        .text(d.id);
    });

      
        // Update node and link positions on each tick of the simulation
        simulation.on('tick', () => {
          link
            .attr('x1', (d) => (d.source as GraphNode).x ?? 0)
            .attr('y1', (d) => (d.source as GraphNode).y ?? 0)
            .attr('x2', (d) => (d.target as GraphNode).x ?? 0)
            .attr('y2', (d) => (d.target as GraphNode).y ?? 0);
        
          node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);
        });
      
      }


      // Function to show tooltip
      function showTooltip(event: d3.D3DragEvent<any, GraphNode, any>, d: GraphNode) {
        const [pageX, pageY] = d3.pointer(event);
        const tooltip = d3.select("#graph-tooltip");
        tooltip
          .style("left", `${pageX}px`)
          .style("top", `${pageY - 28}px`)
          .style("opacity", 1)
          .text(d.id);
      }

      // Function to hide tooltip
      function hideTooltip() {
        const tooltip = d3.select("#graph-tooltip");
        tooltip.style("opacity", 0);
      }

    useEffect(() => {
      renderGraph(data);
    }, [renderGraph]); // Only re-run the effect if data changes

  return (
    <div>
      {/* Other components or markup you might want */}
      <div id="graph"></div>
      <div id="graph-tooltip" className="graph-tooltip" />
    </div>
  );
};

export default WordGraph;

