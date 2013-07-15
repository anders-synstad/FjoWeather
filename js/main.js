var name, single, metric, scale, prefix;

$(function() {
    $("#dp1").datepicker({
        autoclose: true,
        minViewMode: "months",
        todayHighlight: true
    }).on("changeDate", function(ev) {
        startDate = new Date(ev.date);
        var month = startDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        setupChart(createUrl(startDate));
    });
    var now = new Date();
    var month = now.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var today = month + "-" + now.getFullYear();
    $(".datepicker").datepicker("setDate", now);
    $("#dp1 input").val(today);
    setupChart(createUrl(new Date()));
});

function createUrl(startDate) {
    single = queryObj()["single"];
    name = queryObj()["name"];
    scale = queryObj()["scale"];
    prefix = queryObj()["prefix"];
    window.console && console.info(single);
    metric = location.hash.replace(/^#/, "");
    metric = metric.split("&").shift();
    if (typeof startDate === "undefined") startDate = new Date();
    var endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    var start_year = startDate.getFullYear();
    var start_month = startDate.getMonth() + 1;
    var end_year = endDate.getFullYear();
    var end_month = endDate.getMonth() + 1;
    var end_date = endDate.getDate();
    var url = "http://graphite.<yourdomain>.org/render/";
    date_from = "00:00_" + start_year + start_month + "01";
    date_to = "23:59_" + end_year + end_month + end_date;
    url += "?from=" + date_from + "&until=" + date_to;
    url += "&target=";
    var gd = metric;
    if (typeof single !== "undefined") {
        if (typeof name !== "undefined") {
            gd = "alias(" + gd + ',"' + name + '")';
        }
    }
    if (typeof scale !== "undefined") {
        gd = "scale(" + gd + ',"' + scale + '")';
    }
    if (typeof single === "undefined") {
        var lgd = gd;
        if (typeof name !== "undefined") {
            gd = "alias(smartSummarize(" + lgd + ',"1day","max"),"' + name + ' Average")';
            gd += "&target=alias(smartSummarize(" + lgd + ',"1day","min"),"' + name + ' Min")';
            gd += "&target=alias(smartSummarize(" + lgd + ',"1day","avg"),"' + name + ' Average")';
        } else {
            gd = "smartSummarize(" + lgd + ',"1day","max")';
            gd += "&target=smartSummarize(" + lgd + ",'1day','min')";
            gd += "&target=smartSummarize(" + lgd + ",'1day','avg')";
        }
    }
    url += gd;
    url += "&format=json&rawData=true";
    window.console && console.info(url);
    return url;
}

function setupChart(url) {
    var nodata = false;
    var title;
    var options = {
        chart: {
            renderTo: "#graph",
            type: "line",
            renderTo: "graph",
            marginTop: 80,
            zoomType: "xy"
        },
        title: {
            text: title
        },
        legend: {
            enabled: true,
            align: "right",
            borderColor: "black",
            borderWidth: 2,
            layout: "vertical",
            verticalAlign: "top",
            shadow: true,
            floating: true,
            x: -1,
            y: -1,
            labelFormatter: function() {
                var name = this.chart.options.series[0].name;
                var curUrl = location.href;
                if (typeof single === "undefined") {
                    link = '<a href="' + curUrl + "&single=true" + '" style="color:#0898d9;text-decoration:underline;">[View detailed graph]</a>';
                } else {
                    curUrl = curUrl.replace("&single=true", "");
                    link = '<a href="' + curUrl + '" style="color:#0898d9;text-decoration:underline;">[View average]</a>';
                }
                return name + " " + link;
            }
        },
        rangeSelector: {
            enabled: false
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: "°C"
        },
        yAxis: {
            labels: {
                formatter: function() {
                    return this.value;
                }
            },
            type: "linear"
        },
        xAxis: {
            type: "datetime"
        },
        series: []
    };
    $.ajax({
        async: false,
        url: url,
        dataType: "json",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                options.series[i] = [];
                options.series[i].id = i;
                options.series[i].name = data[i].target;
                options.series[i].data = flip(data[i].datapoints);
            }
            if (data.length > 1) {
                options.series[0].type = "arearange";
                options.series[0].linkedTo = ":next";
                options.series[0].data = merge(options.series[0].data, options.series[1].data);
                options.series[0].color = Highcharts.getOptions().colors[0];
                options.series[0].fillOpacity = .3;
                options.series[1] = options.series[2];
                options.series[1].zIndex = 1, options.series[1].marker = {
                    enabled: true,
                    fillColor: "white",
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }, options.series.splice($.inArray(2, options.series), 1);
            }
            if (data.length == 0 && typeof data.datapoints === "undefined") {
                nodata = true;
            }
        },
        cache: false
    });
    if (options.series.length > 0) options.title.text = options.series[0].name;
    var chart = new Highcharts.StockChart(options);
    if (nodata) {
        chart.showLoading("No data available for this metric for the given time period!");
    }
}

function merge(one, two) {
    for (var i = 0; i < one.length; i++) {
        one[i].push(two[i][1]);
    }
    return one;
}

function flip(series) {
    newseries = [];
    for (var i = 0; i < series.length; i++) {
        newseries.push([ series[i][1] * 1e3, series[i][0] ]);
    }
    return newseries;
}

function queryObj() {
    var result = {}, queryString = location.href, re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return result;
}