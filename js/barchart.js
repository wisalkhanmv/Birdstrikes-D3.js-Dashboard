/* global d3 */

function barChart() {
  var tooltipBar = d3v7
    .select("#carTypes")
    .append("div")
    .attr("class", "tooltipBar")
    .style("opacity", 0);
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 400,
    height = 400,
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom,
    xValue = function (d) {
      return d[0];
    },
    yValue = function (d) {
      return d[1];
    },
    xScale = d3v4.scaleBand().padding(0.1),
    yScale = d3v4.scaleLinear(),
    onMouseOver = function () {},
    onMouseOut = function () {};

  function chart(selection) {
    selection.each(function (data) {
      // Select the svg element, if it exists.
      var svgbar = d3v4.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var svgEnter = svgbar.enter().append("svg");
      var gEnter = svgEnter.append("g");
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");

      (innerWidth = width - margin.left - margin.right),
        (innerHeight = height - margin.top - margin.bottom),
        // Update the outer dimensions.
        svgbar.merge(svgEnter).attr("width", width).attr("height", height);

      // Update the inner dimensions.
      var g = svgbar
        .merge(svgEnter)
        .select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      xScale.rangeRound([0, innerWidth]).domain(data.map(xValue));
      yScale.rangeRound([innerHeight, 0]).domain([0, d3v4.max(data, yValue)]);

      g.select(".x.axis")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(d3v4.axisBottom(xScale));

      g.select(".y.axis")
        .call(d3v4.axisLeft(yScale).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

      var bars = g.selectAll(".bar").data(function (d) {
        return d;
      });

      bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", X)
        .attr("y", Y)
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
          return innerHeight - Y(d);
        })
        .on("mouseover", function (d) {
          //call onMouseOver function
          onMouseOver(d);

          //change color of bar
          d3v4.select(this).style("fill", "red");
          //show tooltip
          tooltipBar.transition().duration(200).style("opacity", 0.9);
          tooltipBar
            .text(d.key + ": " + d.value + " flights")
            .style("left", d3v7.event.pageX + "px")
            .style("top", d3v7.event.pageY - 50 + "px");
        })
        .on("mouseout", function (d) {
          //call onMouseOut function
          onMouseOut(d);
          tooltipBar.transition().duration(500).style("opacity", 0);
          //change color
          d3v7.select(this).style("fill", "steelblue");
        });

      //x label name
      g.append("text")
        .attr(
          "transform",
          "translate(" +
            innerWidth / 2 +
            " ," +
            (innerHeight + margin.top + 20) +
            ")"
        )
        .style("text-anchor", "middle")
        .text("Airline");

      //y label name
      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - innerHeight / 2);

      bars.exit().remove();
    });
  }

  // The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.onMouseOver = function (_) {
    if (!arguments.length) return onMouseOver;
    onMouseOver = _;
    return chart;
  };

  chart.onMouseOut = function (_) {
    if (!arguments.length) return onMouseOut;
    onMouseOut = _;
    return chart;
  };

  return chart;
}
