import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5stock from '@amcharts/amcharts5/stock';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import './Overview.css';
import deviceConfigs from '../../config/deviceConfigs.json';

// Type definitions for deviceConfigs
type DataField = {
  name: string;
  type: string;
  multiplier: number;
  aggregation: string;
  index: number;
};
type DeviceTypeConfig = {
  inverter?: DataField[];
  analizor?: DataField[];
  rtu?: DataField[];
};
type GesConfig = {
  [key: string]: DeviceTypeConfig;
};
type DeviceConfigs = {
  [key: string]: GesConfig;
};

declare global {
  interface Window {
    electronAPI: {
      getTablesHistory: (dbName: string, tableName?: string, limit?: number, startTime?: Date, endTime?: Date) => Promise<any[]>;
      onMqttData: (callback: (data: string, topic?: string) => void) => void;
      getAllTables: () => Promise<{ [dbName: string]: string[] }>;
      subscribeMqtt: (topic: string) => void;
    };
  }
}

const Overview: React.FC = () => {
  const chartRef = useRef<am5stock.StockChart | null>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const dateAxisRef = useRef<am5xy.GaplessDateAxis<am5xy.AxisRenderer> | null>(null);
  const [selectedIl, setSelectedIl] = useState('');
  const [selectedGes, setSelectedGes] = useState('');
  const [selectedArac, setSelectedArac] = useState('');
  const [aracVerisi, setAracVerisi] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState('');
  const [availableVariables, setAvailableVariables] = useState<DataField[]>([]);
  const [timeInterval, setTimeInterval] = useState<{
    timeUnit: "minute" | "hour";
    count: number;
  }>({ timeUnit: "minute", count: 1 });

  // Veri buffer'ları için state'ler
  const [dataBuffer, setDataBuffer] = useState<{ timestamp: number; value: number }[]>([]);
  const [ilList, setIlList] = useState<string[]>([]);
  const [gesList, setGesList] = useState<string[]>([]);
  const [aracList, setAracList] = useState<string[]>([]);
  const [allTables, setAllTables] = useState<{ [dbName: string]: string[] }>({});
  const [hasZoomedInitially, setHasZoomedInitially] = useState(false);
  const [isLoadingHistoricalData, setIsLoadingHistoricalData] = useState(false);
  const lastLoadTimeRef = useRef(0);

  function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // Tablo adından cihaz grubunu otomatik bul
  function getCihazGrubu(tablename: string) {
    if (!tablename) return '';
    const lower = tablename.toLowerCase();
    if (lower.startsWith('inv')) return 'inverters';
    if (lower.startsWith('analizor')) return 'analizors';
    if (lower.startsWith('rtu')) return 'rtus';
    if (lower === 'history') return 'history';
    return '';
  }
   // Get device type from table name
   function getDeviceType(tablename: string) {
    if (!tablename) return '';
    const lower = tablename.toLowerCase();
    if (lower.startsWith('inv')) return 'inverter';
    if (lower.startsWith('analizor')) return 'analizor';
    if (lower.startsWith('rtu')) return 'rtu';
    return '';
  }
  // Tüm veritabanları ve tablo isimlerini başta çek
  useEffect(() => {
    if (!window.electronAPI?.getAllTables) return;
    window.electronAPI.getAllTables().then((all) => {
      setAllTables(all);
      const names = Object.keys(all);
      // İl adlarını benzersiz olarak bul
      const ilSet = new Set<string>();
      names.forEach(name => {
        const [il] = name.split('_');
        ilSet.add(il);
      });
      setIlList(Array.from(ilSet));
    });
  }, []);

  // İl seçilince GES listesini güncelle
  useEffect(() => {
    if (selectedIl) {
      const gesSet = new Set<string>();
      Object.keys(allTables).forEach(name => {
        const [il, ...gesArr] = name.split('_');
        if (il === selectedIl && gesArr.length > 0) {
          gesSet.add(gesArr.join('_'));
        }
      });
      setGesList(Array.from(gesSet));
      setSelectedGes('');
      setAracList([]);
      setSelectedArac('');
      setSelectedVariable('');
      setAvailableVariables([]);
    } else {
      setGesList([]);
      setSelectedGes('');
      setAracList([]);
      setSelectedArac('');
    }
  }, [selectedIl]);
  // GES seçilince tablo (araç) listesini hazırdan getir
  useEffect(() => {
    if (selectedIl && selectedGes) {
      const dbName = `${selectedIl}_${selectedGes}`;
      setAracList(allTables[dbName] || []);
      setSelectedArac('');
    } else {
      setAracList([]);
      setSelectedArac('');
    }
  }, [selectedGes]);
  // Seçim değişince veriyi sıfırla
  useEffect(() => {
    setAracVerisi(null);
    setDataBuffer([]);
  }, [selectedIl, selectedGes, selectedArac]); 
  // Update available variables when device selection changes
  useEffect(() => {
    if (!selectedIl || !selectedGes || !selectedArac) {
      setAvailableVariables([]);
      setSelectedVariable('');
      return;
    }

    const deviceType = getDeviceType(selectedArac);
    if (!deviceType) {
      setAvailableVariables([]);
      setSelectedVariable('');
      return;
    }

    // Use capitalize for both selectedIl and selectedGes to match JSON keys
    const configCap = (deviceConfigs as DeviceConfigs)[selectedIl]?.[selectedGes]?.[deviceType as keyof DeviceTypeConfig];
    if (configCap) {
      setAvailableVariables(configCap as DataField[]);
    } else {
      setAvailableVariables([]);
    }
    setSelectedVariable('');
  }, [selectedArac]);
  // Variable seçilince mqtt ye bağlar canlı veri için ve geçmiş 20 saatlik verisini alır setDataBuffer
  useEffect(() => {
    if (!selectedIl || !selectedGes || !selectedArac || !selectedVariable) return;
    if (selectedArac === "" || selectedVariable === "") return;
    setHasZoomedInitially(false);
    
    const dbName = `${selectedIl}_${selectedGes}`;
    const variableConfig = availableVariables.find(v => v.name === selectedVariable);
    if (!variableConfig) return;

    // Fetch historical data
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 10*60*60*1000);
    
    window.electronAPI.getTablesHistory(dbName, selectedArac, undefined, startTime, endTime)
      .then(records => {
        if (records && records.length > 0) {
          const rawData = records
            .map(record => {
              const value = record[selectedVariable];
              const numValue = Number(value);
              const timestamp = new Date(record.timestamp).getTime();
              return {
                timestamp: timestamp,
                value: numValue
              };
            })
            .filter((item): item is { timestamp: number; value: number } => item !== null)
            .sort((a, b) => a.timestamp - b.timestamp);
          
          setDataBuffer(rawData);        
        }
      })
      .catch(error => {
        console.error('Geçmiş veriler çekilirken hata:', error);
      });
    // Handle MQTT data
    const handleMqttData = (data: string) => {
      try {
        const parsedData = JSON.parse(data);
        if (!Array.isArray(parsedData)) return;
        
        const variableIndex = variableConfig.index;
        if (variableIndex === undefined) return;
        
        const value = parsedData[variableIndex + 1];
        if (value === undefined) return;

        const timestamp = new Date(parsedData[0]).getTime();
        
        // Get current time interval
        const { timeUnit, count } = timeInterval;
        const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
        const roundedTime = Math.floor(timestamp / ms) * ms;

        // Get the chart and series
        const chart = chartRef.current;
        if (!chart) return;
        const valueSeries = chart.get('stockSeries');
        if (!valueSeries) return;

        // Find the current candle for this time interval
        const currentCandle = valueSeries.data.values.find((item: any) => item.timestamp === roundedTime);
        
        if (currentCandle) {
          // Update existing candle
          const updatedCandle = {
            ...currentCandle,
            high: Math.max(currentCandle.high, value),
            low: Math.min(currentCandle.low, value),
            close: value,
            volume: currentCandle.volume + 1
          };
          valueSeries.data.setIndex(valueSeries.data.indexOf(currentCandle), updatedCandle);
        } else {
          // Create new candle
          const newCandle = {
            timestamp: roundedTime,
            open: value,
            high: value,
            low: value,
            close: value,
            volume: 1
          };
          valueSeries.data.push(newCandle);
        }

        setAracVerisi(value.toString());
      } catch (error) {
        console.error('Error parsing MQTT data:', error);
      }
    };
    // Subscribe to MQTT updates
    const mqttIl = capitalize(selectedIl);
    const mqttGes = capitalize(selectedGes);
    const cihazGrubu = getCihazGrubu(selectedArac);
    if (cihazGrubu) {
      const topic = `${mqttIl}/${mqttGes}/${cihazGrubu}/${selectedArac}`;
      window.electronAPI.subscribeMqtt(topic);
      const unsubscribe = window.electronAPI.onMqttData((data, incomingTopic) => {
        if (incomingTopic && incomingTopic.toLowerCase() === topic.toLowerCase()) {
          handleMqttData(data);
        }
      });

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [selectedVariable]);
  // yukardak gelen DataBufferın mumları oluşturulur set series
  useEffect(() => {
    if (!dataBuffer || dataBuffer.length === 0) {
      console.log('DataBuffer is empty');
      return;
    }

    // Zaman aralığına göre timestamp'i yuvarla
    const getRoundedTimestamp = (timestamp: number) => {
      const { timeUnit, count } = timeInterval;
      const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
      return Math.floor(timestamp / ms) * ms;
    };

    // Seçilen zaman aralığına göre gruplama
    const grouped = new Map<number, { values: number[]; timestamps: number[] }>();
    
    dataBuffer.forEach(d => {
      const roundedTime = getRoundedTimestamp(d.timestamp);
      if (!grouped.has(roundedTime)) {
        grouped.set(roundedTime, { values: [], timestamps: [] });
      }
      const group = grouped.get(roundedTime)!;
      group.values.push(d.value);
      group.timestamps.push(d.timestamp);
    });

    // Her zaman aralığı için bir mum oluştur
    const newCandles = Array.from(grouped.entries())
      .filter(([_, group]) => group.values.length > 0)
      .sort(([timeA], [timeB]) => timeA - timeB)
      .map(([time, group]) => {
        const values = group.values;
        if (values.length === 0) return null;
        
        const open = values[0];
        const close = values[values.length - 1];
        const high = Math.max(...values);
        const low = Math.min(...values);
        
        if (isNaN(open) || isNaN(close) || isNaN(high) || isNaN(low)) {
          console.log('Invalid candle values:', { time, open, close, high, low });
          return null;
        }
        
        return {
          timestamp: time,
          open,
          high,
          low,
          close,
          volume: values.length
        };
      })
      .filter((candle): candle is NonNullable<typeof candle> => candle !== null);
    if(newCandles.length > 0){
      let isMounted = true;
      const chart = chartRef.current;
      try {
        if (
          chart &&
          newCandles.length > 0 &&
          rootRef.current &&
          typeof chart.get === 'function' &&
          !(typeof chart.isDisposed === 'function' && chart.isDisposed())
        ) {
          const valueSeries = chart.get('stockSeries');
          const volumeSeries = chart.get('volumeSeries');
          if (valueSeries && volumeSeries) {          
            valueSeries.data.setAll(newCandles);    
            // Sadece ilk veri geldiğinde ve daha önce zoom yapılmadıysa
            if (!hasZoomedInitially && newCandles.length > 199) {
              valueSeries.events.once("datavalidated", function() {
                if (dateAxisRef.current) {
                  const startIndex = Math.max(0, newCandles.length - 200);
                  const start = newCandles[startIndex]?.timestamp;
                  const end = newCandles[newCandles.length - 1]?.timestamp;
                  if (start && end) {
                    dateAxisRef.current.zoomToDates(new Date(start), new Date(end));
                    setHasZoomedInitially(true);
                  }
                }
              });
            }
          } 
        }
      } catch (err) {
        console.error('Chart update error (possibly disposed):', err);
      }
      return () => { isMounted = false; };
    }
  }, [dataBuffer, timeInterval]);

  // Ana effect - selectedVariable değişikliğini dinler
  useEffect(() => {
    if (!selectedVariable) return;
    // Create root element
    const root = am5.Root.new("chartdiv");
    rootRef.current = root;
    // Create custom theme
    const myTheme = am5.Theme.new(root);
    // Dark theme settings
    myTheme.rule("Grid", ["scrollbar", "minor"]).setAll({
      visible: false
    });
    myTheme.rule("ColorSet").setAll({
      colors: [
        am5.color("#a259ff"), // Açık mor
        am5.color("#43e0ff"), // Açık mavi
        am5.color("#6a11cb"), // Koyu mor
        am5.color("#2575fc"), // Koyu mavi
        am5.color("#ffe082"), // Sarı (vurgulu)
      ]
    });
    // Text and UI element colors
    myTheme.rule("Label").setAll({
      fill: am5.color("#ffffff"),
      fontSize: "0.9em"
    });
    myTheme.rule("AxisRenderer").setAll({
      stroke: am5.color("#ffffff"),
      strokeOpacity: 0.6
    });
    myTheme.rule("Grid").setAll({
      stroke: am5.color("#ffffff"),
      strokeOpacity: 0.1
    });
    // Set themes
    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ]);
    // Create stock chart
    const stockChart = root.container.children.push(
      am5stock.StockChart.new(root, {
        paddingRight: 0,
        background: am5.Rectangle.new(root, {
          fill: am5.color("#1a1a1a"),
          fillOpacity: 1
        })
      })
    );

    // Set global number format
    root.numberFormatter.set("numberFormat", "#,###.00");

    // Create main stock panel (chart)
    const mainPanel = stockChart.panels.push(
      am5stock.StockPanel.new(root, {
        wheelY: "zoomX",
        panX: true,
        panY: true,
      })
    );
    console.log("çok mu çağırıyor effecti")
    const dateAxis = mainPanel.xAxes.push(
      am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: timeInterval.timeUnit,
          count: timeInterval.count
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true
        }),
        tooltip: am5.Tooltip.new(root, {}),
        maxZoomCount: 200,
      })
    );
    
    dateAxisRef.current = dateAxis;

    // Create value axis
    const valueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: "zoom"
        }),
        extraMin:0.1,
        tooltip: am5.Tooltip.new(root, {}),
        numberFormat: "#,###.00",
        extraTooltipPrecision: 2
      })
    );
    
    // Create series
    const valueSeries = mainPanel.series.push(
      am5xy.CandlestickSeries.new(root, {
        name: selectedArac || "Seçili Cihaz",
        clustered: false,
        valueXField: "timestamp",
        valueYField: "close",
        highValueYField: "high",
        lowValueYField: "low",
        openValueYField: "open",
        calculateAggregates: true,
        xAxis: dateAxis,
        yAxis: valueAxis,
        legendValueText: "[fontSize: 12px #666666]Açılış: [/][fontSize: 12px #0d6efd bold]{openValueY}[/] [fontSize: 12px #666666]Yüksek: [/][fontSize: 12px #198754 bold]{highValueY}[/] [fontSize: 12px #666666]Düşük: [/][fontSize: 12px #dc3545 bold]{lowValueY}[/] [fontSize: 12px #666666]Kapanış: [/][fontSize: 12px #0d6efd bold]{valueY}[/]",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "[fontSize: 12px #666666]Açılış: [/][fontSize: 12px #0d6efd bold]{openValueY}[/]\n[fontSize: 12px #666666]Yüksek: [/][fontSize: 12px #198754 bold]{highValueY}[/]\n[fontSize: 12px #666666]Düşük: [/][fontSize: 12px #dc3545 bold]{lowValueY}[/]\n[fontSize: 12px #666666]Kapanış: [/][fontSize: 12px #0d6efd bold]{valueY}[/]"
        })
      })
    );

    // Set main value series
    stockChart.set("stockSeries", valueSeries);

    // Add legend
    const valueLegend = mainPanel.plotContainer.children.push(
      am5stock.StockLegend.new(root, {
        stockChart: stockChart,
        layout: root.horizontalLayout,
        x: am5.p50,
        centerX: am5.p50,
        y: 0,
        centerY: am5.p0,
        background: am5.Rectangle.new(root, {
          fill: am5.color("#ffffff"),
          fillOpacity: 0.8
        })
      })
    );

    // Style legend labels
    valueLegend.labels.template.setAll({
      fill: am5.color("#666666"),
      fontSize: "12px"
    });

    valueLegend.markers.template.setAll({
      width: 20,
      height: 20
    });

    // Create volume axis
    const volumeAxisRenderer = am5xy.AxisRendererY.new(root, {});
    volumeAxisRenderer.labels.template.set("forceHidden", true);
    volumeAxisRenderer.grid.template.set("forceHidden", true);

    const volumeValueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        numberFormat: "#.#a",
        height: am5.percent(20),
        y: am5.percent(100),
        centerY: am5.percent(100),
        renderer: volumeAxisRenderer
      })
    );
    // Add volume series
    const volumeSeries = mainPanel.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Hacim",
        clustered: false,
        valueXField: "timestamp",
        valueYField: "volume",
        xAxis: dateAxis,
        yAxis: volumeValueAxis,
        legendValueText: "[fontSize: 12px #a259ff bold]{valueY.formatNumber('#,###.0a')}[/]",
        fill: am5.color("#a259ff"),
        stroke: am5.color("#6a11cb")
      })
    );
    volumeSeries.columns.template.setAll({
      strokeOpacity: 0,
      fillOpacity: 0.5
    });
    // Color columns by stock rules
    volumeSeries.columns.template.adapters.add("fill", function(fill, target) {
      const dataItem = target.dataItem;
      if (dataItem) {
        const close = dataItem.get("close" as any);
        const open = dataItem.get("open" as any);
        if (typeof close === 'number' && typeof open === 'number') {
          return close >= open ? am5.color("#43e0ff") : am5.color("#6a11cb");
        }
      }
      return fill;
    });

    // Set main series
    stockChart.set("volumeSeries", volumeSeries);
    valueLegend.data.setAll([valueSeries, volumeSeries]);
 
    // Add cursor
    mainPanel.set("cursor", am5xy.XYCursor.new(root, {
      yAxis: valueAxis,
      xAxis: dateAxis,
      snapToSeries: [valueSeries],
      snapToSeriesBy: "y!",

    }));
    // Add scrollbar
    const scrollbar = mainPanel.set("scrollbarX",
      am5xy.XYChartScrollbar.new(root, {
        orientation: "horizontal",
        height: 50
      })
    );
    stockChart.toolsContainer.children.push(scrollbar);
    const sbDateAxis = scrollbar.chart.xAxes.push(
      am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: "minute",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true
        })
      })
    );
    const sbValueAxis = scrollbar.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );
    const sbSeries = scrollbar.chart.series.push(
      am5xy.LineSeries.new(root, {
        valueYField: "close",
        valueXField: "timestamp",
        xAxis: sbDateAxis,
        yAxis: sbValueAxis
      })
    );
    sbSeries.fills.template.setAll({
      visible: true,
      fillOpacity: 0.3
    });
    // Function to get available santrals
    function getSantralList(search: string) {
      if (search === "") {
        return [];
      }
      search = search.toLowerCase();
      const santrals: { label: string; subLabel: string; id: string; disabled?: boolean }[] = [
        { label: "GES-1 Santrali", subLabel: "GES-1", id: "GES-1" },
        { label: "GES-2 Santrali", subLabel: "GES-2", id: "GES-2" },
        { label: "GES-3 Santrali", subLabel: "GES-3", id: "GES-3" },
        { label: "GES-4 Santrali", subLabel: "GES-4", id: "GES-4" },
        { label: "GES-5 Santrali", subLabel: "GES-5", id: "GES-5" }
      ];

      return santrals.filter((item) => {
        return item.label.toLowerCase().includes(search) || 
               item.subLabel.toLowerCase().includes(search);
      });
    }
    // Function to add comparing series
    function addComparingSeries(label: string) {
      const series = am5xy.LineSeries.new(root, {
        name: label,
        valueYField: "close",
        calculateAggregates: true,
        valueXField: "timestamp",
        xAxis: dateAxis,
        yAxis: valueAxis,
        legendValueText: "[fontSize: 12px #0d6efd bold]{valueY.formatNumber('#,###.00')}[/]",
        tooltip: am5.Tooltip.new(root, {
          labelText: "[fontSize: 12px #666666]{name}: [/][fontSize: 12px #0d6efd bold]{valueY.formatNumber('#,###.00')}[/]"
        })
      });
      const comparingSeries = stockChart.addComparingSeries(series);
      const data = generateData(); // Karşılaştırma serisi için veri
      comparingSeries.data.setAll(data);
    }

    // Add main series control
    const mainSeriesControl = am5stock.DropdownListControl.new(root, {
      stockChart: stockChart,
      name: valueSeries.get("name"),
      icon: am5stock.StockIcons.getIcon("Candlestick Series"),
      fixedLabel: true,
      searchable: true,
      searchCallback: function(query) {
        const mainSeries = stockChart.get("stockSeries");
        const mainSeriesID = mainSeries ? mainSeries.get("name") : "";
        const list = getSantralList(query);
        list.forEach((item) => {
          if (item.id === mainSeriesID) {
            (item as { disabled?: boolean }).disabled = true;
          }
        });
        return list;
      }
    });

    // Add comparison control
    const comparisonControl = am5stock.ComparisonControl.new(root, {
      stockChart: stockChart,
      searchable: true,
      searchCallback: function(query) {
        const compared = stockChart.getPrivate("comparedSeries", []);
        const main = stockChart.get("stockSeries");
        if (compared.length > 4) {
          return [{
            label: "En fazla 5 santral karşılaştırılabilir",
            subLabel: "Yeni eklemek için bazılarını kaldırın",
            id: "",
            className: "am5stock-list-info"
          }];
        }

        const comparedIds: string[] = [];
        compared.forEach((series: any) => {
          comparedIds.push(series.get("name"));
        });

        const list = getSantralList(query);
        list.forEach((item) => {
          if (comparedIds.indexOf(item.id) !== -1 || (main && main.get("name") === item.id)) {
            (item as { disabled?: boolean }).disabled = true;
          }
        });
        return list;
      }
    });

    // Handle comparison selection
    comparisonControl.events.on("selected", function(ev) {
      if (typeof ev.item === 'object' && ev.item !== null && 'id' in ev.item && ev.item.id !== "") {
        addComparingSeries((ev.item as any).subLabel);
      }
    });


    var intervalSwitcher = am5stock.IntervalControl.new(root, {
      stockChart: stockChart,
      items: [
        { id: "1min", label: "1 Dakika", interval: { timeUnit: "minute", count: 1 } },
        { id: "15min", label: "15 Dakika", interval: { timeUnit: "minute", count: 15 } },
        { id: "1hour", label: "1 Saat", interval: { timeUnit: "hour", count: 1 } },
        { id: "3hour", label: "3 Saat", interval: { timeUnit: "hour", count: 3 } }
      ]
    });
    
    // Interval değişikliğini dinle
    intervalSwitcher.events.on("selected", function(ev) {
      if (!ev.item || typeof ev.item === 'string') return;
      
      const item = ev.item as unknown as { interval: { timeUnit: "minute" | "hour"; count: number } };
      
      setTimeInterval({
        timeUnit: item.interval.timeUnit,
        count: item.interval.count
      });

      // Ana seriyi al
      const valueSeries = stockChart.get("stockSeries");
      if (!valueSeries) return;

      // Veri yüklendiğinde zoom out yap
      valueSeries.events.once("datavalidated", function() {
        if (dateAxisRef.current) {
          dateAxisRef.current.zoomToDates(new Date(), new Date());
        }
      });

      // DateAxis'i güncelle
      if (dateAxisRef.current) {
        dateAxisRef.current.set("baseInterval", {
          timeUnit: item.interval.timeUnit,
          count: item.interval.count
        });
      }
    });

    // Add toolbar
    const container = document.getElementById("chartcontrols");
    if (container) {
      am5stock.StockToolbar.new(root, {
        container: container,
        stockChart: stockChart,
        controls: [
          mainSeriesControl,
          comparisonControl,
          am5stock.DateRangeSelector.new(root, {
            stockChart: stockChart
          }),
          am5stock.SeriesTypeControl.new(root, {
            stockChart: stockChart
          }),
          am5stock.DrawingControl.new(root, {
            stockChart: stockChart
          }),
          am5stock.ResetControl.new(root, {
            stockChart: stockChart
          }),
          am5stock.SettingsControl.new(root, {
            stockChart: stockChart
          }),
          intervalSwitcher
        ]
      });
    }

    // Save references
    chartRef.current = stockChart;

    // Initialize with empty data
    valueSeries.data.setAll([]);
    //volumeSeries.data.setAll([]);
    sbSeries.data.setAll([]);


    // Cleanup
    return () => {
      
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  
  }, [selectedVariable]);

  // Geçmiş veri yükleme fonksiyonu
  const loadHistoricalData = useCallback(async (startTime: Date, endTime: Date) => {
    console.log("çekiliyoor")
    if (!selectedIl || !selectedGes || !selectedArac || !selectedVariable || isLoadingHistoricalData) return;
    
    setIsLoadingHistoricalData(true);
    const dbName = `${selectedIl}_${selectedGes}`;
    
    try {
      const records = await window.electronAPI.getTablesHistory(dbName, selectedArac, undefined, startTime, endTime);
      if (records && records.length > 0) {
        const newData = records
          .map(record => {
            const value = record[selectedVariable];
            const numValue = Number(value);
            const timestamp = new Date(record.timestamp).getTime();
            return {
              timestamp: timestamp,
              value: numValue
            };
          })
          .filter((item): item is { timestamp: number; value: number } => item !== null)
          .sort((a, b) => a.timestamp - b.timestamp);

        // Zaman aralığına göre timestamp'i yuvarla
        const getRoundedTimestamp = (timestamp: number) => {
          const { timeUnit, count } = timeInterval;
          const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
          return Math.floor(timestamp / ms) * ms;
        };

        // Seçilen zaman aralığına göre gruplama
        const grouped = new Map<number, { values: number[]; timestamps: number[] }>();
        
        newData.forEach(d => {
          const roundedTime = getRoundedTimestamp(d.timestamp);
          if (!grouped.has(roundedTime)) {
            grouped.set(roundedTime, { values: [], timestamps: [] });
          }
          const group = grouped.get(roundedTime)!;
          group.values.push(d.value);
          group.timestamps.push(d.timestamp);
        });

        // Her zaman aralığı için bir mum oluştur
        const historicalCandles = Array.from(grouped.entries())
          .filter(([_, group]) => group.values.length > 0)
          .sort(([timeA], [timeB]) => timeA - timeB)
          .map(([time, group]) => {
            const values = group.values;
            if (values.length === 0) return null;
            
            const open = values[0];
            const close = values[values.length - 1];
            const high = Math.max(...values);
            const low = Math.min(...values);
            
            if (isNaN(open) || isNaN(close) || isNaN(high) || isNaN(low)) {
              console.log('Invalid candle values:', { time, open, close, high, low });
              return null;
            }
            
            return {
              timestamp: time,
              open,
              high,
              low,
              close,
              volume: values.length
            };
          })
          .filter((candle): candle is NonNullable<typeof candle> => candle !== null);
        
        if(historicalCandles.length > 0){
          let isMounted = true;
          const chart = chartRef.current;
          try {
            if (
              chart &&
              historicalCandles.length > 0 &&
              rootRef.current &&
              typeof chart.get === 'function' &&
              !(typeof chart.isDisposed === 'function' && chart.isDisposed())
            ) {
              const valueSeries = chart.get('stockSeries');
              const volumeSeries = chart.get('volumeSeries');
              if (valueSeries && volumeSeries) {
                console.log("valueseries before",valueSeries.data.length);
                console.log("historicalCandles",historicalCandles);
                const existingData = valueSeries.data.values;
                const combinedData = [...historicalCandles, ...existingData];
                valueSeries.data.setAll(combinedData);
                console.log("valueseries after",valueSeries.data.length);
              }
            }
          } catch (err) {
            console.error('Historical chart update error:', err);
          }
          return () => { isMounted = false; };
        }
        //console.log("Historical Data Buffer:", historicalCandles);
      }
    } catch (error) {
      console.error('Geçmiş veriler yüklenirken hata:', error);
    } finally {
      setIsLoadingHistoricalData(false);
    }
  }, [selectedVariable, timeInterval]);

  // DateAxis için event listener
  useEffect(() => {
    if (!dateAxisRef.current && !hasZoomedInitially) {
      return;
    }
    const handleStart = (start: number | undefined) => {
      if (start === undefined || isLoadingHistoricalData) return;
      
      // Son yüklemeden bu yana 10 saniye geçmediyse çık
      const now = Date.now();
      if (now - lastLoadTimeRef.current < 1000) {
        return;
      }
      
      const chart = chartRef.current;
      if (!chart) return;
      
      const valueSeries = chart.get('stockSeries');
      if (!valueSeries) return;

      const currentMin = dateAxisRef.current?.getPrivate("selectionMin");
      if (!currentMin) return;

      const seriesData = valueSeries.data.values as { timestamp: number }[];
      if (!seriesData || seriesData.length === 0) return;

      const oldestDataPoint = seriesData[0] as { timestamp: number };
      const oldestTimestamp = oldestDataPoint.timestamp;
      
      const oneHourInMs = 5*60 * 60 * 1000; 
      if (currentMin - oldestTimestamp < oneHourInMs) {
        const from = new Date(oldestTimestamp - oneHourInMs);
        const to = new Date(oldestTimestamp);
        lastLoadTimeRef.current = now;
        loadHistoricalData(from, to);
      }
    };
    dateAxisRef.current?.on("start", handleStart);
    return () => {
      dateAxisRef.current?.off("start", handleStart);
    };
  }, [dateAxisRef.current, loadHistoricalData]);


  //console.log('Overview render');
  return (
    <div className="overview-container">
      <div className="selection-container">
        <select 
          value={selectedIl} 
          onChange={(e) => setSelectedIl(e.target.value)}
          className="select-box"
        >
          <option value="">İl Seçiniz</option>
          {ilList.map((il) => (
            <option key={il} value={il}>{il}</option>
          ))}
        </select>
        <select 
          value={selectedGes} 
          onChange={(e) => setSelectedGes(e.target.value)}
          className="select-box"
          disabled={!selectedIl}
        >
          <option value="">GES Seçiniz</option>
          {gesList.map((ges) => (
            <option key={ges} value={ges}>{ges}</option>
          ))}
        </select>
        <select 
          value={selectedArac} 
          onChange={(e) => setSelectedArac(e.target.value)}
          className="select-box"
          disabled={!selectedGes}
        >
          <option value="">Araç Seçiniz</option>
          {aracList.map((arac) => (
            <option key={arac} value={arac}>{arac}</option>
          ))}
        </select>
        <select 
          value={selectedVariable} 
          onChange={(e) => {
            setSelectedVariable(e.target.value);
            setDataBuffer([]);
          }}
          className="select-box"
          disabled={!selectedArac || !Array.isArray(availableVariables) || availableVariables.length === 0}
        >
          <option value="">Değişken Seçiniz</option>
          {Array.isArray(availableVariables) && availableVariables.map((config) => (
            <option key={config.name} value={config.name}>{config.name}</option>
          ))}
        </select>
        {aracVerisi !== null && selectedVariable && (
          <div className="selected-value">
            Değer: {aracVerisi}
          </div>
        )}
      </div>
      {/* amCharts toolbar container */}
      <div id="chartcontrols" className="chart-controls"></div>
      <div id="chartdiv" className="chart-container"></div>
    </div>
  );
};

// Helper function to generate sample data
function generateData() {
  const data = [];
  let value = 100;
  let open = value;
  let low = value * 0.95;
  let high = value * 1.05;
  let volume = 1000;
  
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 100; i++) {
    value = Math.round((value + Math.random() * 20 - 10) * 100) / 100;
    open = Math.round((open + Math.random() * 20 - 10) * 100) / 100;
    high = Math.max(value, open) + Math.random() * 10;
    low = Math.min(value, open) - Math.random() * 10;
    volume = Math.round(volume + Math.random() * 1000 - 500);

    data.push({
      timestamp: new Date(currentDate.getTime() + i * 60000).getTime(),
      value: value,
      open: open,
      high: high,
      low: low,
      close: value,
      volume: Math.max(100, volume)
    });
  }

  return data;
}

export default Overview; 