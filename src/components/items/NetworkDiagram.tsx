import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export interface Node extends d3.SimulationNodeDatum {
  id: string;
  followers: number;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  value: number;
}

export type NetworkData = {
  nodes: Node[];
  links: Link[];
};

type NetworkDiagramProps = {
  width: number;
  height: number;
  data: NetworkData;
  params: {
    centerForce: number;
    chargeForce: number;
    linkForce: number;
    linkDistance: number;
    linkThickness: number;
  }
};

export const NetworkDiagram = ({
  width,
  height,
  data,
  params: {
    centerForce,
    chargeForce,
    linkForce,
    linkDistance,
    linkThickness,
  },
}: NetworkDiagramProps) => {
  const links: Link[] = data.links.map((d) => ({ ...d }));
  const nodes: Node[] = data.nodes.map((d) => ({ ...d }));

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const radius = () => 15;

    // run d3-force to find the position of nodes on the canvas
    const simulation = d3.forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<Node, Link>(links)
          .strength(linkForce)
          .distance(linkDistance)
          .id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(chargeForce))
      .force('collision', d3.forceCollide().radius(radius).iterations(2))
      .force('pull center x', d3.forceX().strength(centerForce))
      .force('pull center y', d3.forceY().strength(centerForce))

      // at each iteration of the simulation, draw the network diagram with the new node positions
      .on('tick', () => {
        // drawNetwork(context, width, height, nodes, links);
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);

        text
          .attr('x', (d: any) => d.x + 5)
          .attr('y', (d: any) => d.y);
      });

    const svg = d3.create('svg')
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", linkThickness);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", () => radius() - 3)
      .attr("fill", "#1f77b4");

    const text = svg.append("g")
      .selectAll("a")
      .data(nodes)
      .enter().append("a")
      .attr("href", (d: any) => `/users/${d.id}`)
      .attr("target", "_blank")
      .append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .text((d: any) => d.id);

    const dragstarted = (e: any) => {
      if (!e.active) simulation.alphaTarget(0.3).restart();
      e.subject.fx = e.subject.x;
      e.subject.fy = e.subject.y;
    };

    const dragged = (e: any) => {
      e.subject.fx = e.x;
      e.subject.fy = e.y;
    };

    const dragended = (e: any) => {
      if (!e.active) simulation.alphaTarget(0);
      e.subject.fx = null;
      e.subject.fy = null;
    };

    node.call(
      (d3.drag() as any)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    containerRef.current.innerHTML = "";
    containerRef.current.append(svg.node()!);

    return () => {
      simulation.stop();
    };
  }, [width, height, nodes, links, linkForce, linkDistance, chargeForce, centerForce, linkThickness]);

  return (
    <div ref={containerRef}></div>
  );
};
