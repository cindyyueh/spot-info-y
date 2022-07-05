import React, { Component } from 'react';
import * as d3 from 'd3';

const colors = () => {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

class DonutChart extends Component {
  constructor(props) {
    super(props);
    this.chRef = React.createRef();
  }

  // Chart load after component Mount
  componentDidMount() {
    this.drawChart();
  }

  // DrawChart
  drawChart() {
    d3.select('svg').remove();

    const { data } = this.props;
    const svgContainer = d3.select(this.chRef.current).node();
    const width = svgContainer.getBoundingClientRect().width;
    const height = width;
    const margin = 15;
    let radius = Math.min(width, height) / 2 - margin;

    // legend Position
    let legendPosition = d3
      .arc()
      .innerRadius(radius / 1.75)
      .outerRadius(radius);

    // Create SVG
    const svg = d3
      .select(this.chRef.current)
      .append('svg')
      .attr('width', '50%')
      .attr('height', '50%')
      .attr('viewBox', '0 0 ' + width + ' ' + width)
      //.attr('preserveAspectRatio','xMinYMin')
      .append('g')
      .attr(
        'transform',
        'translate(' +
          Math.min(width, height) / 2 +
          ',' +
          Math.min(width, height) / 2 +
          ')'
      );

    let pie = d3.pie().value((d) => d.value);
    let data_ready = pie(data);

    // Donut partition
    svg
      .selectAll('whatever')
      .data(data_ready)
      .enter()
      .append('path')
      .attr(
        'd',
        d3
          .arc()
          .innerRadius(radius / 1.75) // This is the size of the donut hole
          .outerRadius(radius)
      )
      .style('fill', (d) => {
        colors(d.index);
      })
      .style('opacity', '1');

    var arc = d3
      .arc()
      .innerRadius(radius / 1.75)
      .outerRadius(radius);

    var g = svg.append('g');

    var tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('background', '#000')
      .text('a simple tooltip');

    var arcs = g
      .selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
    arcs
      .append('path')
      .attr('fill', function (d, i) {
        return colors(i);
      })
      .attr('d', arc)
      .on('mouseover.transition', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '.85');
      })
      .on('mouseout.transition', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '1');
      })
      .text(function (d) {
        return d;
      })
      .on('mouseover', function (d, i) {
        tooltip.text(i.data.title);
        return tooltip.style('visibility', 'visible');
      })
      .on('mousemove', function (d) {
        return tooltip
          .style('top', d.pageY - 10 + 'px')
          .style('left', d.pageX + 10 + 'px');
      })
      .on('mouseout', function (d) {
        return tooltip.style('visibility', 'hidden');
      });

    var legendG = svg.selectAll(".legend")

    // var legendRectSize = 13;
    // var legendSpacing = 7;
    // var legend = svg
    //   .selectAll('.legend') //the legend and placement
    //   .data(colors().domain())
    //   .enter()
    //   .append('g')
    //   .attr('class', 'circle-legend')
    //   .attr('transform', function (d, i) {
    //     var height = legendRectSize + legendSpacing;
    //     var offset = (height * colors().domain().length) / 2;
    //     var horz = -2 * legendRectSize - 13;
    //     var vert = i * height - offset;
    //     return 'translate(' + horz + ',' + vert + ')';
    //   });
    // legend
    //   .append('circle') //keys
    //   .style('fill', colors)
    //   .style('stroke', colors)
    //   .attr('cx', 0)
    //   .attr('cy', 0)
    //   .attr('r', '.5rem');
    // legend
    //   .append('text') //labels
    //   .attr('x', legendRectSize + legendSpacing)
    //   .attr('y', legendRectSize - legendSpacing)
    //   .text(function (d) {
    //     return d;
    //   });

    // Legend group and legend name
    // svg
    //   .selectAll('mySlices')
    //   .data(data_ready)
    //   .enter()
    //   .append('g')
    //   .attr('transform', (d) => `translate(${legendPosition.centroid(d)})`)
    //   .attr('class', 'legend-g')
    //   .style('user-select', 'none')
    //   .append('text')
    //   .text((d) => d.data.name)
    //   .style('text-anchor', 'middle')
    //   .style('font-weight', 700)
    //   .style('fill', '#fff')
    //   .style('font-size', 14);

    // //Label for value
    // svg
    //   .selectAll('.legend-g')
    //   .append('text')
    //   .text((d) => {
    //     return d.data.title;
    //   })
    //   .style('fill', '#444')
    //   .style('font-size', 12)
    //   .style('text-anchor', 'middle')
    //   .attr('y', 16);
  }

  render() {
    return (
      <>
        <div ref={this.chRef}></div>
      </>
    );
  }
}

export default DonutChart;
