'use strict';

App.controller('MoodCtrl', ['$scope', 'localStorageService', 'REST', function($scope, ls, REST) {
    REST.getMood(function(response) {
        var rawData = [];
        var data = response.data.reverse();

        for(var i = 0, len = data.length; i < len; ++i) {
            var moodData = JSON.parse(data[i].mood);

            console.log(moodData);

            var sum = 0;
            for(var j = 0; j < moodData.length; ++j) {
                console.log('val: ' +  moodData[j].value);
                sum += parseInt(moodData[j].value);
            }
            console.log("SUM: " + sum);
            var avg = Math.floor(sum / moodData.length);
            console.log("AVG: " + avg);

            rawData.push({ overall_pa: avg, ts: new Date(data[i].date).valueOf() });
        }

        generateGraph(rawData);
        
    });

    REST.getEvents(function(response) {
        var toSet = [];

        console.log(response.data);

        var data = response.data;
        for(var i = 0, len = data.length; i < len; ++i) {
            toSet.push({ moodEvent: data[i].text, time: data[i].date });
        }

        $scope.eventData = toSet;
    });

    /* D3 */
    /*{ts: 1368987285622, overall_pa: 1},*/
    function generateGraph(rawData) {
    var margin = {top: 5, right: 20, bottom: 30, left: 120},
            width = 320 - margin.left - margin.right,
            height = 960 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");
    var formatNumber = d3.format(",d"),
            formatChange = d3.format("+,d"),
            formatDate = d3.time.format("%B %d, %Y"),
            formatTime = d3.time.format("%B %d %I:%M %p");

    var barHeight = 30;

    // mood
    var x = d3.scale.linear()
            .range([0, width]);

    var svg = d3.select("div.history").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = rawData.map(function (i) {
        i.ts = new Date(+i.ts);
        i.overall_pa = +i.overall_pa;
        return i;
    });

    console.log(data);

    x.domain([0, d3.max(data, function (d) {
        return d.overall_pa;
    })]);

    svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return 0;
            })
            .attr("width", function (d) {
                return x(d.overall_pa);
            })
            .attr("y", function (d, i) {
                return i * barHeight;
            })
            .attr("height", barHeight)
            .on("click", function (i) {
                d3.select(this).style("fill", "green");
                console.log('hi');
            });

    svg.selectAll("text.overall_pa")
            .data(data)
            .enter().append("text")
            .attr("class", "overall_pa")
            .attr("x", function (d) {
                return x(d.overall_pa);
            })
            .attr("y", function (d, i) {
                return i * barHeight + 10;
            })
            .attr("dx", -3) // padding-right
            .attr("dy", ".35em") // vertical-align: middle
            .attr("text-anchor", "end") // text-align: right
            .text(function (d) {
                return d.overall_pa
            });

    svg.selectAll("text.time")
            .data(data)
            .enter().append("text")
            .attr("class", "time")
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * barHeight + 10;
            })
            .attr("dx", -5) // padding-right
            .attr("dy", ".35em") // vertical-align: middle
            .attr("text-anchor", "end") // text-align: right
            .text(function (d) {
                return formatTime(d.ts)
            });
    }
}]);
