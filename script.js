let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let req = new XMLHttpRequest();

let baseTemp
let values
let xScale
let yScale
let xAxis
let yAxis
let width = 900
let height = 500
let padding = 60

let svg = d3.select("#canvas")
    .attr("width", width)
    .attr("height", height)

let tooltip = d3.select("#tooltip")
let generateScales = () => {
    xScale = d3.scaleLinear()
    .domain([d3.min(values, (d) => {return d.year}), d3.max(values, (d) => {return d.year}) + 1])
    .range([padding, width - padding])

    yScale = d3.scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding])
}

let drawCells = () => {

    svg
      .selectAll("rect")
      .data(values)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("fill", (d) => {
        let temp = baseTemp + d.variance;
        if (temp <= 1) {
          return "aliceblue";
        } else if (temp <= 2) {
          return "lightskyblue";
        } else if (temp <= 3) {
          return "deepskyblue";
        } else if (temp <= 4) {
          return "lightsalmon";
        } else if (temp <= 5) {
          return "lavender";
        } else if (temp <= 6) {
          return "lightblue";
        } else if (temp <= 7) {
          return "yellow";
        } else if (temp <= 8) {
          return "orange";
        } else if (temp <= 9) {
          return "tomato";
        } else if (temp <= 10) {
          return "crimson";
        } else if (temp <= 11) {
          return "firebrick";
        } else {
          return "darkred";
        }
      })
      .attr("data-year", (d) => {
        return d.year;
      })
      .attr("data-month", (d) => {
        return d.month - 1;
      })
      .attr("data-temp", (d) => {
        return baseTemp - d.varience;
      })
      .attr("height", (height - 2 * padding) / 12)
      .attr("width", (d) => {
        let years =
          d3.max(values, (d) => {
            return d.year;
          }) -
          d3.min(values, (d) => {
            return d.year;
          });
        return (width - 2 * padding) / years;
      })
      .attr("x", (d) => {
        return xScale(d.year);
      })
      .attr("y", (d) => {
        return yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0));
      })
      .on("mouseover", (d) => {
        tooltip
          .transition()
          .style("visibility", "visible")
          .attr("data-year", d.toElement.__data__.year)

        let monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        tooltip.text(
          d.toElement.__data__.year +
            " " +
            monthNames[d.toElement.__data__.month - 1] +
            " : " +
            (baseTemp + d.toElement.__data__.variance) + "°C"
        )
      })

      .on("mouseout", (d) => {
        tooltip.transition().style("visibility", "hidden");
      });
        

}

let drawAxes = () => {
    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format("d"))
    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat("%B"))

    svg.append("g")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis)

    svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis)

}

let legend = d3.select("#legend")
    .attr("width", 600)
    .attr("height", 100)

let legendScale = d3.scaleLinear()
    .domain([0, 12])
    .range([0, 600])

let legendAxis = d3.axisBottom(legendScale)

let drawLegend = () => {
    legend.selectAll("rect")
        .data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        .enter()
        .append("rect")
        .attr("fill", (d) => {
            if (d == 1) {
                return "aliceblue"
            } else if (d == 2) {
                return "lightskyblue"
            } else if (d == 3) {
                return "deepskyblue"
            } else if (d == 4) {
                return "lightsalmon"
            } else if (d == 5) {
                return "lavender"
            } else if (d == 6) {
                return "lightblue"
            } else if (d == 7) {
                return "yellow"
            } else if (d == 8) {
                return "orange"
            } else if (d == 9) {
                return "tomato"
            } else if (d == 10) {
                return "crimson"
            } else if (d == 11) {
                return "firebrick"
            } else {
                return "darkred"
            }
        })
        .attr("height", 75)
        .attr("width", 50)
        .attr("x", (d, i) => {return i * 50})
        .attr("y", 0)
    legend.append('g')
        .attr("transform", "translate(0,75)")
        .call(legendAxis)
        

}

req.open("GET", url, true);
req.onload = () => {
    json = JSON.parse(req.responseText);
    baseTemp = json.baseTemperature;
    values = json.monthlyVariance;
    console.log(baseTemp)
    generateScales()
    drawCells()
    drawAxes()
    drawLegend()
};
req.send();