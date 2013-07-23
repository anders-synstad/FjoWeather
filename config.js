var graphite = "http://graphite.synstad.net/render/";

var loaded = 0;

$(function() {
    if (loaded === 0) {
        metrics = [ {
            name: "Balkong",
            metricPath: "mrfjo.hjemme.temp.telldus.Balkong",
            type: "temperature",
            suffix: "",
            scale: "",
            dashboard: true,
            single: false
        }, {
            name: "Soverom",
            metricPath: "mrfjo.hjemme.temp.telldus.Soverom",
            type: "temperature",
            suffix: "",
            dashboard: true,
            scale: "",
            single: ""
        }, {
            name: "Office desk",
            metricPath: "mrfjo.hjemme.temp.28-000002dcb9bc",
            type: "temperature",
            dashboard: false,
            suffix: "",
            scale: "0.001",
            single: ""
        }, {
            name: "Outside wall",
            metricPath: "mrfjo.hjemme.temp.28-0000044ddd1d",
            type: "temperature",
            dashboard: false,
            suffix: "",
            scale: "0.001",
            single: ""
        }, {
            name: "Barometer",
            metricPath: "mrfjo.hjemme.pressure.bmp085_pressure",
            type: "pressure",
            dashboard: true,
            suffix: "",
            scale: "",
            single: true
        }, {
            name: "Light",
            metricPath: "mrfjo.hjemme.light.tsl2561_lux",
            type: "light",
            dashboard: false,
            suffix: "",
            scale: "",
            single: true
        }, {
            name: "Humidity",
            metricPath: "mrfjo.hjemme.humidity.dht11_humidity",
            type: "humidity",
            dashboard: false,
            suffix: "",
            scale: "",
            single: true
        } ];
        loaded = 1;
    }
});
