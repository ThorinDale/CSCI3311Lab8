d3.csv('driving.csv', d3.autoType).then(data => {
    console.log(data);

    const margin = ({top: 40, bottom: 40, right: 40, left: 40});

    const width = 800 - margin.right - margin.left;
    const height = 800 - margin.top - margin.bottom;
    const svg = d3.select('.scatter-plot')
        .append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .append('g');

    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d.miles)-1000, d3.max(data, d=>d.miles)])
        .range([0, width])
        .nice();

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.gas)])
        .range([height, 0])
        .nice();

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(20, 's');

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(20, 's');
    
    svg.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(50,' + (height) + ')')
        .call(xAxis);

    const axisGroup = svg.append('g')
        .attr('class', 'axis y-axis')
        .attr('transform', 'translate(50, 0)')
        .call(yAxis);

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'circles')
        .append('circle')
        .attr('cx', function(d) {return xScale(d.miles)})
        .attr('cy', function(d) {return yScale(d.gas)})
        .attr('r', 5);
    
    svg.select('.circles')
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', function(d) {return xScale(d.miles)})
        .attr('y', function(d) {return yScale(d.gas)})
        .text(function(d) {return d.year})
        .each(position)
        .call(halo);

    axisGroup.selectAll('.tick line')
        .clone()
        .attr('x2', width)
        .attr('stroke-opacity', 0.1);

    axisGroup.call(yAxis)
        .call(g => g.select('.domain').remove())
        .call(g => 
            g.append('text')
            .text('Cost per gallon')
            .attr('x', '70')
            .attr('y', '20')
            .attr('fill', 'black')
            .call(halo));

    const line = d3
            .line()
            .curve(d3.curveCatmullRom)
            .x(function(d) {return xScale(d.miles)})
            .y(function(d) {return yScale(d.gas)});

    svg.append("path")
        .datum(data)
        .attr("d", line)
        .attr("stroke", "black")
        .attr("stroke-width",2)
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", `0,${length}`)
});

function position(d) {
    const t = d3.select(this);
    switch (d.side) {
        case 'top':
            t.attr('text-anchor', 'middle').attr('dy', '-0.7em');
            break;
        case 'right':
            t.attr('dx', '0.5em')
            .attr('dy', '0.32em')
            .attr('text-anchor', 'start');
            break;
        case 'bottom':
            t.attr('text-anchor', 'middle').attr('dy', '1.4em');
            break;
        case 'left':
            t.attr('dx', '-0.5em')
            .attr('dy', '0.32em')
            .attr('text-anchor', 'end');
            break;
    }
};

function halo(text) {
    text.select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
    })
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 4)
    .attr('stroke-linejoin', 'round');
};