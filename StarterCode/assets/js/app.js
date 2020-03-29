

const svgWidth = 1300
const svgHeight = 750
const circleRadius = 10
const labelFontSize = 8
const chartPadding = .001

const margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 20
}

let chartWidth = svgWidth - margin.left - margin.right
let chartHeight = svgHeight - margin.top - margin.bottom

let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

let chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// ################################################

d3.csv("assets/data/data.csv").then(data => {

    let xDomain = d3.extent(data.map(row => parseFloat(row.poverty)))
    let yDomain = d3.extent(data.map(row => parseFloat(row.healthcare)))
    let xPadding = chartPadding * (xDomain[1] - xDomain[0])
    let yPadding = chartPadding * (yDomain[1] - yDomain[0])
    xDomain[0] -= xPadding
    xDomain[1] += xPadding
    yDomain[0] -= yPadding
    yDomain[1] += yPadding

    let xScale = d3
        .scaleLinear()
        .domain(xDomain)
        .range([0, chartWidth])
    
    let yScale = d3
        .scaleLinear()
        .domain(yDomain)
        .range([chartHeight, 0])
    
    let xAxis = d3.axisBottom(xScale)
    let yAxis = d3.axisLeft(yScale)

    chartGroup
        .append("g")
        // .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)
    
    chartGroup
        .append("g")
        .call(yAxis)
    
    let dataPoints = chartGroup
        .selectAll("#data")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", row => `translate(
            ${xScale(parseFloat(row.poverty))},
            ${yScale(parseFloat(row.healthcare))}
        )`)
   
    dataPoints
        .append("circle")
        .attr("r", circleRadius)
        .attr("fill", "green")
        .attr("opacity", .4)
    
    // prevent labels from overlapping

    let yOffsets = {
        OH: -1,
        TX: 1,
        NC: -2,
        MI: 2,
        NY: -1,
        MN: 1,
        AZ: -1,
        WA: 2,
        CO: -2,
        TN: -1,
        MO: 1,
        WI: -1,
        IL: 1,
        NJ: 2,
        IN: -1,
        OR: 1,
        WV: 1,
        AR: -1,
        NV: -1,
        NE: 1,
        KY: -2
    }

    data.forEach(row => {
        if (row.abbr in yOffsets) {
            row.yOffset = yOffsets[row.abbr]
        } else {
            row.yOffset = 0
        }
    })

    dataPoints
        .append("text")
        .text(row => row.abbr)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", labelFontSize)
        .attr("y", row =>

            - Boolean(row.yOffset)
            * Math.sign(row.yOffset)
            * circleRadius * .75
            
            - labelFontSize
            * row.yOffset
            
        )
    // Add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

            // text label for the x axis
        svg.append("text")             
            .attr("transform",
                    "translate(" + (width/2) + " ," + 
                                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Date");

            // Add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

            // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Value");      

})
