// @TODO: YOUR CODE HERE!
var svgWidth = 750;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("/assets/data/data.csv").then(function(data,err){
    if(err) throw err;

    //console.log(data)

    data.forEach(function(data){
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareHigh = +data.healthcareHigh;
        data.healthcareLow = +data.healthcareLow; 
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh; 
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh; 
    });

    //console.log(data)

    // create dynamic axis later
    // -------------------------
    // var xLinearScale = d3.scaleLinear()
    //     .domain([d3.min(data, d=>d["age"]),
    //              d3.max(data, d=>d["age"])])
    //     .range([0,width]);

    // Create scales
    var xLinearScale = d3.scaleLinear().range([0,width]).domain([d3.min(data, d=>d.age),d3.max(data, d=>d.age)]);
    var yLinearScale = d3.scaleLinear().range([height,0]).domain([0,d3.max(data,d=>d.smokes)]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axis to chart
    // Translate and add x axis
    chartGroup.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);
    
    // Add y axis
    chartGroup.append("g").call(leftAxis);
    
    
    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "#A6CDDB")
    .attr("opacity", "0.9")
    .attr("stroke-width", "1")
    .attr("stroke", "white");


    stateab= data.map(element=>element)

    var labels = chartGroup.selectAll()
        .data(stateab)
        .enter()
        .append("text")
        .text( (m) =>{return m.abbr})
        .attr("x", (m) => (xLinearScale(m.age))-10)
        .attr("y", (m) => yLinearScale(m.smokes)+5)
        .style("fill","white")

    
    // Create tooltip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([100, -80])
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>Poverty:${d.poverty}%<br>Obesity: ${d.obesity}%`);
    });

    circlesGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
    })
    // Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
        toolTip.hide(d);
    });
    


    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left+40)
      .attr("x", 0 - (height / 2)-50)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percent of Smokers");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Median Age");

});