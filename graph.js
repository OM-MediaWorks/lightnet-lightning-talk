import {Runtime, Inspector} from "@observablehq/runtime";

const step = parseInt(location.hash.substring(1))
document.body.classList.add('step-' + step)

function _chart(d3,data,invalidation)
{
  // Specify the dimensions of the chart.
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map(d => ({...d}));
  const nodes = data.nodes.map(d => ({...d}));

  // Create a simulation with several forces.
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // svg.append("circle")
  //   .attr("r", 600)
  //   .attr("fill", () => 'white')
  //   .attr("stroke-width", 2)
  //   .attr("class", "only-step-3 only-step-4")
  //   .attr("stroke", () => color(''));

  // Add a line for each link, and a circle for each node.
  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", 2);

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("g.node")
    .data(nodes)
    .join("g")
      .attr("class", "node");

  node.append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("x", -15)
      .attr("class", "isolate")
      .attr("y", -15)
      .attr("fill", d => 'white')
      .attr("stroke", d => color(d.group));

  node.append("circle")
      .attr("r", step === 4 ? 8 : 5)
      .attr("fill", d => color(d.group));

  node.append("title")
      .text(d => d.id);

  // Add a drag behavior.
  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
  
  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x} ${d.y})`)
  });

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // When this cell is re-run, stop the previous simulation. (This doesn’t
  // really matter since the target alpha is zero and the simulation will
  // stop naturally, but it’s a good practice.)
  invalidation.then(() => simulation.stop());

  return svg.node();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const generateData = async () => {
  const nodes = []
  const links = []

  for (let i = 0; i < 300; i++) {
    nodes.push({ id: i, group: i })
  } 

  if (step === 3) {
    const max = 300
    for (let i = 0; i < max; i = i + 2) {
      links.push({ id: i, target: getRandomInt(max), source: getRandomInt(max) })
    } 
  }

  if (step === 4) {
    const max = 300
    for (let i = 0; i < max; i++) {
      links.push({ id: i, target: i, source: getRandomInt(max) })
    } 
  }

  return { nodes, links }
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("chart")).define("chart", ["d3","data","invalidation"], _chart);
  main.variable(observer("data")).define("data", ["FileAttachment"], generateData);
  return main;
}

const runtime = new Runtime();
runtime.module(define, Inspector.into(document.body))
