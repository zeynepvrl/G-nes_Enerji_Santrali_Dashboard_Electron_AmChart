/**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */

// Generate random data
function generateDailyData(start, end, startValue) {
  var data = [];
  var value = startValue || Math.random() * 100;
  var date = new Date(start.getTime());
  while (date < end) {
    data.push({
      date: date.getTime(),
      value: value
    });
    value += (Math.random() - 0.5) * 5;
    date.setDate(date.getDate() + 1);
  }
  return data;
}

var from = new Date();
from.setFullYear(2023);
var to = new Date();
var data = generateDailyData(from, to);


// Create root element
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");

const myTheme = am5.Theme.new(root);

myTheme.rule("Grid", ["scrollbar", "minor"]).setAll({
  visible:false
});

root.setThemes([
  am5themes_Animated.new(root),
  myTheme
]);

// Create a stock chart
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Instantiating_the_chart
var stockChart = root.container.children.push(am5stock.StockChart.new(root, {  
  paddingRight: 0
}));


// Set global number format
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/
root.numberFormatter.set("numberFormat", "#,###.00");


// Create a main stock panel (chart)
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Adding_panels
var mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
  wheelY: "zoomX",
  panX: true,
  panY: true
}));


// Create value axis
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    pan: "zoom"
  }),
  extraMin: 0.1, // adds some space for for main series
  tooltip: am5.Tooltip.new(root, {}),
  numberFormat: "#,###.00",
  extraTooltipPrecision: 2
}));

var dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true
  }),
  tooltip: am5.Tooltip.new(root, {})
}));


// Add series
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var valueSeries = mainPanel.series.push(am5xy.LineSeries.new(root, {
  name: "MSFT",
  clustered: false,
  valueXField: "date",
  valueYField: "value",
  calculateAggregates: true,
  xAxis: dateAxis,
  yAxis: valueAxis,
  legendValueText: "[bold]{valueY}[/]",
  legendRangeValueText: ""
}));


// Set main value series
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series
stockChart.set("stockSeries", valueSeries);


// Add a stock legend
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/stock-legend/
var valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
  stockChart: stockChart
}));


// Set main series
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/#Setting_main_series
valueLegend.data.setAll([valueSeries]);


// Add cursor(s)
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
mainPanel.set("cursor", am5xy.XYCursor.new(root, {
  yAxis: valueAxis,
  xAxis: dateAxis,
  snapToSeries: [valueSeries],
  snapToSeriesBy: "y!"
}));


// Add scrollbar
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
var scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
  orientation: "horizontal",
  height: 50
}));
stockChart.toolsContainer.children.push(scrollbar);

var sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
  baseInterval: {
    timeUnit: "day",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true
  })
}));

var sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));

var sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
  valueYField: "value",
  valueXField: "date",
  xAxis: sbDateAxis,
  yAxis: sbValueAxis
}));

sbSeries.fills.template.setAll({
  visible: true,
  fillOpacity: 0.3
});

// Set up series type switcher
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/toolbar/series-type-control/
var seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
  stockChart: stockChart
});

seriesSwitcher.events.on("selected", function (ev) {
  setSeriesType(ev.item.id);
});

function getNewSettings(series) {
  var newSettings = [];
  am5.array.each(["name", "valueYField", "highValueYField", "lowValueYField", "openValueYField", "calculateAggregates", "valueXField", "xAxis", "yAxis", "legendValueText", "legendRangeValueText", "stroke", "fill"], function (setting) {
    newSettings[setting] = series.get(setting);
  });
  return newSettings;
}

function setSeriesType(seriesType) {
  // Get current series and its settings
  var currentSeries = stockChart.get("stockSeries");
  var newSettings = getNewSettings(currentSeries);

  // Remove previous series
  var data = currentSeries.data.values;
  mainPanel.series.removeValue(currentSeries);

  // Create new series
  var series;
  switch (seriesType) {
    case "line":
      series = mainPanel.series.push(am5xy.LineSeries.new(root, newSettings));
      break;
    case "candlestick":
    case "procandlestick":
      newSettings.clustered = false;
      series = mainPanel.series.push(am5xy.CandlestickSeries.new(root, newSettings));
      if (seriesType == "procandlestick") {
        series.columns.template.get("themeTags").push("pro");
      }
      break;
    case "ohlc":
      newSettings.clustered = false;
      series = mainPanel.series.push(am5xy.OHLCSeries.new(root, newSettings));
      break;
  }

  // Set new series as stockSeries
  if (series) {
    valueLegend.data.removeValue(currentSeries);
    series.data.setAll(data);
    stockChart.set("stockSeries", series);
    var cursor = mainPanel.get("cursor");
    if (cursor) {
      cursor.set("snapToSeries", [series]);
    }
    valueLegend.data.insertIndex(0, series);
  }
}


// Stock toolbar
// -------------------------------------------------------------------------------
// https://www.amcharts.com/docs/v5/charts/stock/toolbar/
var toolbar = am5stock.StockToolbar.new(root, {
  container: document.getElementById("chartcontrols"),
  stockChart: stockChart,
  controls: [
    am5stock.IndicatorControl.new(root, {
      stockChart: stockChart,
      legend: valueLegend
    }),
    am5stock.DateRangeSelector.new(root, {
      stockChart: stockChart
    }),
    am5stock.PeriodSelector.new(root, {
      stockChart: stockChart
    }),
    seriesSwitcher,
    am5stock.DrawingControl.new(root, {
      stockChart: stockChart
    }),
    am5stock.DataSaveControl.new(root, {
      stockChart: stockChart
    }),
    am5stock.ResetControl.new(root, {
      stockChart: stockChart
    }),
    am5stock.SettingsControl.new(root, {
      stockChart: stockChart
    })
  ]
})

var tooltip = am5.Tooltip.new(root, {
  getStrokeFromSprite: false,
  getFillFromSprite: false
});

tooltip.get("background").setAll({
  strokeOpacity: 1,
  stroke: am5.color(0x000000),
  fillOpacity: 1,
  fill: am5.color(0xffffff)
});


// set data to all series
valueSeries.data.setAll(data);
sbSeries.data.setAll(data);


// Dynamic loading
var loadDebouncer;
dateAxis.on("start", function(start) {
  if (start < 0) {
    if (loadDebouncer) {
      clearTimeout(loadDebouncer);
    }
    loadDebouncer = setTimeout(function() {
      var from = new Date(dateAxis.getPrivate("selectionMin")-5600*3600*1000);
      console.log("ceynep"+from);
      var to = new Date(valueSeries.data.values[0].date - 24 * 60 * 60 * 1000)
      var startValue = valueSeries.data.values[0].value;
      startValue += (Math.random() - 0.5) * 5;
      var newData = generateDailyData(from, to, startValue);
      var data = newData.concat(valueSeries.data.values);
      valueSeries.data.setAll(data);
      sbSeries.data.setAll(data);
      dateAxis.zoom(0, 1, 0);
    }, 100)
  }
})