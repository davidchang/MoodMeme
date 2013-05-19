'use strict';

App.controller('MoodCtrl', ['$scope', 'localStorageService', 'REST', function ($scope, ls, REST) {

    var unformattedData = [];

    function formatForDetailedGraph(index) {
        var rawData = unformattedData;
        var toReturn = [];

        for (var i = 0; i < rawData[index].length; ++i) {
            var x = rawData[index][i],
                markers = x.value;
            if (index + 1 < rawData.length)
                markers = rawData[index + 1][i].value;

            toReturn.push({ title: x.type, subtitle: '', ranges: [1, 3, 5], measures: [x.value, x.value], markers: [markers] });
        }

        return toReturn;
    }

    REST.getMood(function (response) {
        var rawData = [];
        var data = response.data.reverse();
        if (data.length > 0) {
            for (var i = 0, len = data.length; i < len; ++i) {
                var moodData = JSON.parse(data[i].mood);

                unformattedData.push(moodData);

                var sum = 0;
                for (var j = 0; j < moodData.length; ++j) {
                    sum += parseInt(moodData[j].value);
                }
                var avg = Math.floor(sum / moodData.length);

                rawData.push({ overall_pa: avg, ts: new Date(data[i].date).valueOf(), index: i });
            }

            var objs = generateDetailedGraph(formatForDetailedGraph(0));
            generateOverviewGraph(rawData, objs.svg, objs.chart);

        } else {
            console.log("no data yet");
        }
    });

    REST.getEvents(function (response) {
        var toSet = [];

        var data = response.data;
        for (var i = 0, len = data.length; i < len; ++i) {
            toSet.push({ moodEvent: data[i].text, time: data[i].date });
        }

        $scope.eventData = toSet;
    });

    /* D3 */
    /*{ts: 1368987285622, overall_pa: 1},*/
    function generateOverviewGraph(rawData, svg, chart) {
        var margin = {top: 5, right: 20, bottom: 30, left: 120},
            width = 320 - margin.left - margin.right,
            height = 260 - margin.top - margin.bottom;

        var formatPercent = d3.format(".0%");
        var formatNumber = d3.format(",d"),
            formatChange = d3.format("+,d"),
            formatDate = d3.time.format("%B %d, %Y"),
            formatTime = d3.time.format("%B %d %I:%M %p");

        var barHeight = 30;

        // mood
        var x = d3.scale.linear()
            .range([0, width]);

        var svgOverview = d3.select("div.history").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var data = rawData.map(function (i) {
            i.ts = new Date(+i.ts);
            i.overall_pa = +i.overall_pa;
            return i;
        });

        x.domain([0, d3.max(data, function (d) {
            return d.overall_pa;
        })]);

        svgOverview.selectAll(".bar")
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
                updateDetailedGraph(formatForDetailedGraph(i.index), svg, chart);
                console.log(i);
            });

        svgOverview.selectAll("text.overall_pa")
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

        svgOverview.selectAll("text.time")
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

    function updateDetailedGraph(data, svg, chart) {
        console.log(svg);
        console.log(chart);
        svg.datum(randomize).call(chart.duration(1000)); // TODO automatic transition
        function randomize(d) {
            var result = data.filter(function (i) {
                console.log(d);
                console.log(i);
                return i.title == d.title
            })[0];
            console.log(result);
            return result;
        }
    }

    function generateDetailedGraph(data) {

        console.log('data');
        console.log(data);

        var margin = {top: 5, right: 40, bottom: 20, left: 120},
            width = 400 - margin.left - margin.right,
            height = 50 - margin.top - margin.bottom;

        var chart = d3.bullet()
            .width(width)
            .height(height);

        var svg = d3.select("div.details").selectAll("svg.bullet")
            .data(data)
            .enter().append("svg")
            .attr("class", "bullet")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(chart);

        var title = svg.append("g")
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + height / 2 + ")");

        title.append("text")
            .attr("class", "title")
            .text(function (d) {
                return d.title;
            });

        title.append("text")
            .attr("class", "subtitle")
            .attr("dy", "1em")
            .text(function (d) {
                return d.subtitle;
            });

        return {svg: svg, chart: chart};
    }

}]);
