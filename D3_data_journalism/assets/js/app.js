var width = parseInt(d3.select("#scatter").style("width"));

console.log(width)

var height = width - (width / 6);

var margin = 30;
var words = 120;
var left = 50;
var down = 50;

var svg = d3.select("#scatter").append("svg").attr("width", width).attr("height", height).attr("class", "chart");

svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");


  xText.attr("transform","translate(" + ((width-words) / 2 + words) +", " +(height-down-margin) +")"
  );

xText.append("text").attr("y", -20).attr("data-name", "poverty").attr("data-axis", "x").attr("class", "aText active x").text("In Poverty (%)");
xText.append("text").attr("y", 0).attr("data-name", "age").attr("data-axis", "x").attr("class", "aText inactive x").text("Age (Median)");
xText.append("text").attr("y", 20).attr("data-name", "income").attr("data-axis", "x").attr("class", "aText inactive x").text("Household Income (Median)");


svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");

  yText.attr("transform","translate(" + (margin+left) + ", " + ((words+height) / 2 - words) + ")rotate(270)");

yText.append("text").attr("y", -20).attr("data-name", "obesity").attr("data-axis", "y").attr("class", "aText active y").text("Obese (%)");
yText.append("text").attr("x", 0).attr("data-name", "smokes").attr("data-axis", "y").attr("class", "aText inactive y").text("Smokes (%)");
yText.append("text").attr("y", 20).attr("data-name", "healthcare").attr("data-axis", "y").attr("class", "aText inactive y").text("Lacks Healthcare (%)");

d3.csv("assets/data/data.csv").then(function(ourdata) {

  var xaxis = "poverty";
  var yaxis = "obesity";


  var tt = d3.tip().attr("class", "d3-tip").offset([50, -50]).html(function(a) {
      var hor;
      var statename = "<div>" + a.state + "</div>";
      var ver = "<div>" + yaxis + ": " + a[yaxis] + "%</div>";
      if (xaxis === "poverty") {
        hor = "<div>" + xaxis + ": " + a[xaxis] + "%</div>";
      }
      else {
        hor = "<div>" +
          xaxis +
          ": " +
          parseFloat(a[xaxis]).toLocaleString("en") +
          "</div>";
      }
      return statename + hor + ver;
    });

    svg.call(tt);

    var xmin = d3.min(ourdata, function(a) {
      return parseFloat(a[xaxis]);
    });

    var xmax = d3.max(ourdata, function(a) {
      return parseFloat(a[xaxis]);
    });

    var ymin = d3.min(ourdata, function(a) {
      return parseFloat(a[yaxis]);
    });

    var ymax = d3.max(ourdata, function(a) {
      return parseFloat(a[yaxis]);
    });


  var xscale = d3.scaleLinear().domain([xmin, xmax]).range([words + margin, width - margin]);
  var yscale = d3.scaleLinear().domain([ymin, ymax]).range([height - words - margin, margin]);

  var xx = d3.axisBottom(xscale).ticks(10);
  var yy = d3.axisLeft(yscale).ticks(10);


svg.append("g").call(xx).attr("class", "xAxis").attr("transform", "translate(0," + (height-words-margin) + ")");
svg.append("g").call(yy).attr("class", "yAxis").attr("transform", "translate(" + (words+margin) + ", 0)");

var radius = 7

var circle = svg.selectAll("g theCircles").data(ourdata).enter();

circle.append("circle")
.attr("cx", function(a) {
    return xscale(a[xaxis]);
  }).attr("cy", function(a) {
    return yscale(a[yaxis]);
  }).attr("r", radius).attr("class", function(a) {
    return "stateCircle " + a.abbr;
  }).on("mouseover", function(a) {
    tt.show(a, this);
    d3.select(this).style("stroke", "#323232");
  }).on("mouseout", function(a) {
 tt.hide(a);
    d3.select(this).style("stroke", "#e3e3e3");
  });
  

  circle.append("text").text(function(a) {
    return a.abbr;
  }).attr("dx", function(a) {
    return xscale(a[xaxis]);
  }).attr("dy", function(a) {
    return yscale(a[yaxis])+2;
  }).attr("font-size", radius).attr("class", "stateText").on("mouseover", function(a) {
    tt.show(a);
    d3.select("." + a.abbr).style("stroke", "#323232");
  }).on("mouseout", function(a) {
    tt.hide(a);
    d3.select("." + a.abbr).style("stroke", "#e3e3e3");
  });

  d3.selectAll(".aText").on("click", function() {

    var ini = d3.select(this);

    if (ini.classed("inactive")) {

      var dataname = ini.attr("data-name");
      var hori = ini.attr("data-axis");
 
      if (hori === "x") {
     
        xaxis = dataname;

        xmin = d3.min(ourdata, function(a) {
          return parseFloat(a[xaxis]);
        });
    
        xmax = d3.max(ourdata, function(a) {
          return parseFloat(a[xaxis]);
        });

        xscale.domain([xmin, xmax]);
        svg.select(".xAxis").transition().duration(300).call(xx);

        d3.selectAll("circle").each(function() {
 
          d3.select(this).transition().attr("cx", function(a) {
              return xscale(a[xaxis]);
            }).duration(300);
        });

        d3.selectAll(".stateText").each(function() {
     
          d3.select(this).transition().attr("dx", function(a) {
              return xscale(a[xaxis]);
            }).duration(300);
        });

          d3.selectAll(".aText").filter("." + hori).filter(".active").classed("active", false).classed("inactive", true);
          ini.classed("inactive", false).classed("active", true);
      }

      else {
  
        yaxis = dataname;

        ymin = d3.min(ourdata, function(a) {
          return parseFloat(a[yaxis]);
        });
   
        ymax = d3.max(ourdata, function(a) {
          return parseFloat(a[yaxis]);
        });

        yscale.domain([ymin, ymax]);

        svg.select(".yAxis").transition().duration(300).call(yy);

        d3.selectAll("circle").each(function() {

          d3.select(this).transition().attr("cy", function(a) {
              return yscale(a[yaxis])-2;
            }).duration(300);
        });
    
        d3.selectAll(".stateText").each(function() {
          d3.select(this).transition().attr("dy", function(a) {
              return yscale(a[yaxis]);
            }).duration(300);
        });
        
        d3.selectAll(".aText").filter("." + hori).filter(".active").classed("active", false).classed("inactive", true);
        ini.classed("inactive", false).classed("active", true);
      }
    }
  });

  });
