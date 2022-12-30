/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web" 
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html   
		
Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart mapLegend
http://bl.ocks.org/mbostock/3888852  */

//Width and height of map
var width = 450;
var height = 450;
// console.log(width);

// D3 Projection
var projection = d3.geo
  .albersUsa()
  .translate([width / 2, height / 2]) // translate to center of screen
  .scale([600]); // scale things down so see entire US

// Define mappath generator
var mappath = d3.geo
  .path() // mappath generator that will convert GeoJSON to SVG mappaths
  .projection(projection); // tell mappath generator to use albersUsa projection

// Define linear scale for output
var mapcolor = d3.scale.linear().range(["rgb(217,91,67)"]);

var mapLegendText = ["Birds Strikes"];

//Create SVG element and append map to the SVG
var map_svg = d3
  .select("#mapVis")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Append Div for tooltip to SVG
var div = d3
  .select("#mapVis")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load in my states data!
d3.csv("data/frequency.csv", function (data) {
  mapcolor.domain([0]); // setting the range of the input data

  // Load GeoJSON data and merge with states data
  d3.json("data/gz_2010_us_outline_500k.json", function (json) {
    // Loop through each state data mapvalue in the .csv file
    for (var i = 0; i < data.length; i++) {
      // Grab State Name
      var dataState = data[i].State;

      // Grab data mapvalue
      var datamapValue = data[i].frequency;

      // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name;

        if (dataState == jsonState) {
          // Copy the data mapvalue into the JSON
          json.features[j].properties.frequency = datamapValue;

          // Stop looking through the JSON
          break;
        }
      }
    }

    // Bind the data to the SVG and create one mappath per GeoJSON feature
    map_svg
      .selectAll("mappath")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", mappath)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function (d) {
        // Get data mapvalue
        var mapvalue = d.properties.frequency;

        if (mapvalue) {
          //If mapvalue exists…
          return mapcolor(mapvalue);
        } else {
          //If mapvalue is undefined…
          return "rgb(213,222,217)";
        }
      });

    // Map the cities I have lived in!
    d3.csv("data/frequency.csv", function (data) {
      map_svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return projection([d.longitude, d.latitude])[0];
        })
        .attr("cy", function (d) {
          return projection([d.longitude, d.latitude])[1];
        })
        .attr("r", function (d) {
          // return flight date
          return d.frequency / 20;
        })
        .style("fill", "rgb(217,91,67)")
        .style("opacity", 0.85)

        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
        .on("mouseover", function (d) {
          div.transition().duration(200).style("opacity", 0.9);
          div
            .text(d.name + ": " + d.frequency)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 50 + "px");
        })

        // fade out tooltip on mouse out
        .on("mouseout", function (d) {
          div.transition().duration(500).style("opacity", 0);
        });
    });

    // Modified mapLegend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
    //set the mapLegend
    var mapLegend = map_svg
      .selectAll("g.mapLegend")
      .data(mapcolor.domain())
      .enter()
      .append("g")
      .attr("class", "mapLegend");

    var ls_w = 20,
      ls_h = 20;

    mapLegend
      .append("rect")
      .attr("x", 20)
      .attr("y", 415)
      .attr("width", ls_w - 2)
      .attr("height", ls_h - 2)
      .style("fill", function (d, i) {
        return "rgb(217, 91, 67)";
      })
      .style("opacity", 0.8);

    mapLegend
      .append("text")
      .attr("x", 50)
      .attr("y", function (d, i) {
        return height + 70 - i * ls_h;
      })
      .text(function (d, i) {
        return mapLegendText[i];
      });

    //zoom in the container
    map_svg.call(
      d3.behavior.zoom().on("zoom", function () {
        map_svg
          .selectAll("path")
          .attr(
            "transform",
            "translate(" +
              d3.event.translate +
              ")" +
              " scale(" +
              d3.event.scale +
              ")"
          );
        map_svg
          .selectAll("circle")
          .attr(
            "transform",
            "translate(" +
              d3.event.translate +
              ")" +
              " scale(" +
              d3.event.scale +
              ")"
          );
      })
    );
  });
});
