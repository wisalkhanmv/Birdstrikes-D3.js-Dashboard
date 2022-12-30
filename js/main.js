/* global d3, crossfilter, timeSeriesChart, barChart */

// 2015-05-01 00:43:28
var dateFmt = d3v4.timeParse("%Y-%m-%d");

var chartTimeline = timeSeriesChart()
  .width(1500)
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});
var barChartGate = barChart()
  .width(600)
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});
var barChartCar = barChart()
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});

d3v4.csv("airline.csv",
  function (d) {
    // This function is applied to each row of the dataset
    d.Timestamp = dateFmt(d["Flight_Date"]);
    // console.log(d["Flight Date"]);
    return d;
  },
  function (err, data) {
    if (err) throw err;

    var csData = crossfilter(data);

    // We create dimensions for each attribute we want to filter by
    csData.dimTime = csData.dimension(function (d) { return d.Timestamp; });
    csData.dimCarType = csData.dimension(function (d) { return d["Aircraft Airline Operator"]; });

    // We bin each dimension
    csData.timesByHour = csData.dimTime.group(d3v4.timeHour);
    csData.carTypes = csData.dimCarType.group();


    chartTimeline.onBrushed(function (selected) {
      csData.dimTime.filter(selected);
      update();
    });

    
    
    barChartCar.onMouseOver(function (d) {
      csData.dimCarType.filter(d.key);
      // show name on hover
      // d3.select("#carTypes").text(d.key);
      // d3.select("#gates").text(d.key);

      update();
    }).onMouseOut(function () {
      // Clear the filter
      csData.dimCarType.filterAll();
      // Clear the text on mouse out
      // d3.select("#carTypes").text("");
      // d3.select("#CarTypes").remove();
      // d3.selectAll.text().remove(d.key);
      // d3.select("#gates").text("");

      update();
    });

    barChartGate.onMouseOver(function (d) {
      csData.dimGateName.filter(d.key);
      update();
    }).onMouseOut(function () {
      // Clear the filter
      csData.dimGateName.filterAll();
      update();
    });

    function update() {
      d3v4.select("#timeline")
        .datum(csData.timesByHour.all())
        .call(chartTimeline);

      d3v4.select("#carTypes")
        .datum(csData.carTypes.all())
        .call(barChartCar)
        .select(".x.axis") //Adjusting the tick labels after drawn
        .selectAll(".tick text")
        .attr("transform", "translate(-8,-1) rotate(-45)");

    }

    update();


  }
);