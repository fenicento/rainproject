//define general variables
var svg,
    width = 1600,
    height = 800,
    data,
    coords,
    currRain

var currRow=-1;

//define type of projection, scale and center of map
var projection = d3.geo.albers()
    .scale(1500)
    .translate([width/2, height/2] )
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

//create the SVG in the html page, define width an height
    svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//load the data files, wait for ready
queue()
    .defer(d3.json, "data/us.json")
    .defer(d3.json, "data/ciao.json")
    .defer(d3.csv, "data/oregon_days.csv")
    .defer(d3.csv, "data/coordinates.csv")
    .await(ready);

//when ready, draw!
function ready(error, us,states, oregon, coords) {

    console.log(error)

    coords.forEach(function(d,i){
        var position = projection([d.Longitude, d.Latitude]);
        d.x = position[0];
        d.y = position[1];
        d.r = 2;
    })

    //draw the state borders
    svg.append("path")
        .datum(topojson.feature(states, states.objects.us_states, function (a, b) {
            return a !== b;
        }))
        .attr("class", "states")
        .attr("d", path);


    svg.selectAll("text")
        .datum(topojson.feature(states, states.objects.us_states, function (a, b) {
            return a !== b;
        }))






    var cent = svg.append("path")
        .datum(topojson.merge(states, states.objects.us_states.geometries.filter(function (a) {
            console.log(a.properties)
            return a.properties.name==="California" || a.properties.name==="Washington" || a.properties.name==="Oregon" ;
        })))
        .attr("class", "vip-states")
        .attr("d", path);

    /*var ciao = topojson.feature(states, states.objects.us_states)

     ciao=   ciao['features'].filter(function(d){
     return d.properties.name=="California" || d.properties.name=="Washington" || d.properties.name=="Oregon"
     })*/
    projection.translate(path.centroid(cent.datum()))
    //console.log(d3.geo.centroid(ciao.features))


     plotRain = function() {


        currRain = oregon[currRow];
         console.log("a")

        for (a in currRain) {

            if (a !== "Month" && a !== "Day" && a !== "Year") {
                console.log("b")
                svg.append("circle")
                    .attr("class","num"+currRow)
                    .datum(currRain[a])
                    .style("opacity",1)
                    .attr("cx", function () {
                        c = coords.filter(function (d) {
                            return d.ID === a.substring(3)
                        })

                        return c[0].x
                    })
                    .attr("cy", function () {
                        c = coords.filter(function (d) {
                            return d.ID === a.substring(3)
                        })
                        return c[0].y
                    })
                    .style("fill", "#55DDEA")
                    .style("stroke", "none")
                    .attr("r",0)
                    .transition()
                    .duration(1000)
                    .attr("r", function (s) {

                        return parseFloat(currRain[a]) * 50;
                    })

            }
        }

         console.log("c")

        svg.append("text")
            .datum(currRain)
            .text(function(d){return d.Day+"/"+ d.Month+"/"+d.Year})
            .attr("x",30)
            .attr("y",30)
            .attr("font-family","sans-serif")
            .attr("fill","#333")
            .attr("font-size",20)

         console.log("d")

    }

    setInterval(function(){


        d3.selectAll(".num"+currRow)
            .transition()
            .duration(function(e) {
             return e*50000
             })
            //.duration(1000)
            .attr("r",0)
            .each("end",
            function(){console.log("a");d3.select(this).remove()
            })
        /* .each(function(d) {

         d3.select(this)
         .transition()
         /*.duration(function(e) {
         return e*50000
         })
         .duration(1000)
         .attr("r",0)
         .each("end",d3.select(this).remove())


         //    d*100;

         })*/

        currRow++;
        if (currRow==oregon.length) currRow=0;
        d3.select("text").remove()

        plotRain();
    },1000);


    /*svg.selectAll("circle")
        .data().enter()
        .append("circle")
        .attr("cx",function(s){return s.x})
        .attr("cy",function(s){return s.y})
        .attr("r",function(s){return s.r})
        .style("fill","#55DDEA")
        .style("stroke","none");

    setInterval(function(){
        d3.selectAll("circle")
            .each(function(d) {

                d3.select(this)
                    .transition()
                    .duration(function(d){
                        old = d.r
                        d.r=Math.random()*3;
                        return old*1000
                    })
                    .style("opacity",0)
                    .each("end", function(d){
                        d3.select(this)
                            .attr("r",function(s){return s.r})
                            .style("opacity",1)
                    })
            })
        }, 2000);
*/
}

