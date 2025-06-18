import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5stock from '@amcharts/amcharts5/stock';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import './Overview.css';
import deviceConfigs from '../../config/deviceConfigs.json';
import NestedDropdown from './mainSeriesNestedDropDown';
import ComparisonSeriesNestedDropdown from './comparisonSeriesNestedDropdown';
// Type definitions for deviceConfigs


type VariableConfig = {
  name: string;
  index: number;
};


declare global {
  interface Window {
    electronAPI: {
      getTablesHistory: (dbName: string, tableName?: string, limit?: number, startTime?: Date, endTime?: Date) => Promise<any[]>;
      onMqttData: (callback: (data: string, topic?: string) => void) => void;
      getAllTables: () => Promise<{ [dbName: string]: string[] }>;
      subscribeMqtt: (topic: string) => void;
      unsubscribeMqtt: (topic: string) => void;
    };
  }
}

const Overview: React.FC = () => {
  const chartRef = useRef<am5stock.StockChart | null>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const dateAxisRef = useRef<am5xy.GaplessDateAxis<am5xy.AxisRenderer> | null>(null);
  const valueAxisRef = useRef<am5xy.ValueAxis<am5xy.AxisRenderer> | null>(null);
  const [selectedIl, setSelectedIl] = useState('');
  const [selectedGes, setSelectedGes] = useState('');
  const [selectedArac, setSelectedArac] = useState('');
  const [selectedVariable, setSelectedVariable] = useState('');
  const [dropdownData, setDropdownData] = useState<Record<string, Record<string, Record<string, VariableConfig[]>>>>({});
  const timeIntervalRef = useRef<{
    timeUnit: "minute" | "hour";
    count: number;
  }>({ timeUnit: "minute", count: 1 });

  // Veri buffer'ları için state'ler
  const [dataBuffer, setDataBuffer] = useState<{ timestamp: number; value: number }[]>([]);
  const [hasZoomedInitially, setHasZoomedInitially] = useState(false);
  const [isLoadingHistoricalData, setIsLoadingHistoricalData] = useState(false);
  const lastLoadTimeRef = useRef(0);
  
  const [selectedComparisonIl, setSelectedComparisonIl] = useState('');
  const [selectedComparisonGes, setSelectedComparisonGes] = useState('');
  const [selectedComparisonArac, setSelectedComparisonArac] = useState('');
  const [comparisonSelections, setComparisonSelections] = useState<Record<string, string[]>>({});
  const comparisonSeriesRefs = useRef<am5xy.LineSeries[]>([]);
  const comparisonUnsubscribeRefs = useRef<(() => void)[]>([]);
  const prevComparisonSelections = useRef<Record<string, string[]>>({});
 
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
 
  useEffect(() => {
    if (!window.electronAPI?.getAllTables) return;
    window.electronAPI.getAllTables().then((allTables) => {
      const data: Record<string, Record<string, Record<string, VariableConfig[]>>> = {};
      const ilSet = new Set<string>();

      Object.keys(allTables).forEach(dbName => {
        const [il, ...gesArr] = dbName.split('_');
        const ges = gesArr.join('_');
        ilSet.add(il);
        
        if (!data[il]) data[il] = {};
        if (!data[il][ges]) data[il][ges] = {};

        allTables[dbName].forEach(arac => {
          let variables: VariableConfig[] = [];
          const deviceType = getDeviceType(arac);
          const config = (deviceConfigs as any)[il]?.[ges]?.[deviceType];
          if (Array.isArray(config)) {
            variables = config.map((v: any) => ({
              name: v.name,
              index: v.index
            }));
          }
          data[il][ges][arac] = variables;
        });
      });

      setDropdownData(data);
    });
  }, []);
  // Variable seçilince mqtt ye bağlar canlı veri için ve geçmiş 20 saatlik verisini alır setDataBuffer
  useEffect(() => {
    if (!selectedIl || !selectedGes || !selectedArac || !selectedVariable) return;
    if (selectedArac === "" || selectedVariable === "") return;
   
    const dbName = `${selectedIl}_${selectedGes}`;
    const variableConfig = dropdownData[selectedIl][selectedGes][selectedArac].find(v => v.name === selectedVariable);

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

            setDataBuffer(rawData);
          
            if (!rawData || rawData.length === 0) {
              console.log('rawdata is empty');
              return;
            }
        
            // Zaman aralığına göre timestamp'i yuvarla
            const getRoundedTimestamp = (timestamp: number) => {
              const { timeUnit, count } = timeIntervalRef.current;
              const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
              return Math.floor(timestamp / ms) * ms;
            };
        
            // Seçilen zaman aralığına göre gruplama
            const grouped = new Map<number, { values: number[]; timestamps: number[] }>();
            
            rawData.forEach(d => {
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
                    volumeSeries.data.setAll(newCandles);
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
          }
        })
      .catch(error => {
        console.error('Geçmiş veriler çekilirken hata:', error);
      })
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

        setDataBuffer(prev => [...prev, { timestamp, value }]);
        // Get current time interval
        const { timeUnit, count } = timeIntervalRef.current;
        const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
        const roundedTime = Math.floor(timestamp / ms) * ms;

        // Get the chart and series
        const chart = chartRef.current;
        if (!chart) return;
        const valueSeries = chart.get('stockSeries');
        const volumeSeries = chart.get('volumeSeries');
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
          volumeSeries?.data.setIndex(volumeSeries.data.indexOf(currentCandle), updatedCandle);
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
          volumeSeries?.data.push(newCandle);
        }

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
    //console.log("çok mu çağırıyor effecti")
    const dateAxis = mainPanel.xAxes.push(
      am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: timeIntervalRef.current.timeUnit,
          count: timeIntervalRef.current.count
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
  
    valueAxisRef.current = valueAxis;
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
      
      
      timeIntervalRef.current = {
        timeUnit: item.interval.timeUnit,
        count: item.interval.count
      };
    
    });

    // Add toolbar
    const container = document.getElementById("chartcontrols");
    if (container) {
      am5stock.StockToolbar.new(root, {
        container: container,
        stockChart: stockChart,
        controls: [
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
        setDataBuffer(prev => [...newData,...prev]);

        // Zaman aralığına göre timestamp'i yuvarla
        const getRoundedTimestamp = (timestamp: number) => {
          const { timeUnit, count } = timeIntervalRef.current;
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
                //console.log("valueseries before",valueSeries.data.length);
                //console.log("historicalCandles",historicalCandles);
                const existingData = valueSeries.data.values;
                const combinedData = [...historicalCandles, ...existingData];
                valueSeries.data.setAll(combinedData);
                volumeSeries.data.setAll(combinedData);
                //console.log("valueseries after",valueSeries.data.length);
              }
            }
          } catch (err) {
            console.error('Historical chart update error:', err);
          }
          return () => { isMounted = false; };
        }
      }
    } catch (error) {
      console.error('Geçmiş veriler yüklenirken hata:', error);
    } finally {
      setIsLoadingHistoricalData(false);
    }
  }, [selectedVariable]);

  const addComparisonLine = async (key: string, variableName: string) => {
    if (!rootRef.current || !chartRef.current || !dateAxisRef.current || !valueAxisRef.current) return;
   
    const chart = chartRef.current;
    const mainPanel = chart.panels.getIndex(0);
    if (!mainPanel) return;

    const [il, ges, arac] = key.split('/');
    const dbName = `${il}_${ges}`;
    const variableConfig = dropdownData?.[il]?.[ges]?.[arac]?.find(v => v.name === variableName);
    console.log("addComparisonLine çalıştı",key, variableName)
    if (!variableConfig) return;

    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 10 * 60 * 60 * 1000); // son 10 saat

    const records = await window.electronAPI.getTablesHistory(dbName, arac, undefined, startTime, endTime);

    const lineData = records.map(record => {
      const value = Number(record[variableName]);
      const timestamp = new Date(record.timestamp).getTime();
      return { timestamp, value };
    }).filter(d => !isNaN(d.value));

    const series = am5xy.LineSeries.new(rootRef.current, {
      name: `${key}-${variableName}`,
      valueXField: "timestamp",
      valueYField: "value",
      xAxis: dateAxisRef.current,
      yAxis: valueAxisRef.current,
      stroke: am5.color("#ffe082"),
      tooltip: am5.Tooltip.new(rootRef.current, {
        labelText: `{name}\n[bold]{valueY}[/]`
      })
    });

    series.data.setAll(lineData);
    mainPanel.series.push(series);
    comparisonSeriesRefs.current.push(series);

    // MQTT canlı veri kısmı
    const mqttIl = il.charAt(0).toUpperCase() + il.slice(1);
    const mqttGes = ges.charAt(0).toUpperCase() + ges.slice(1);
    const cihazGrubu = getCihazGrubu(arac);
    if (!cihazGrubu) return;

    const topic = `${mqttIl}/${mqttGes}/${cihazGrubu}/${arac}`;
    await window.electronAPI.subscribeMqtt(topic);

    const unsubscribe = window.electronAPI.onMqttData((data, incomingTopic) => {
      if (incomingTopic?.toLowerCase() === topic.toLowerCase()) {
        try {
          const parsed = JSON.parse(data);
          const variableIndex = variableConfig.index;
          const value = parsed[variableIndex + 1];
          const timestamp = new Date(parsed[0]).getTime();
          if (isNaN(value) || isNaN(timestamp)) return;
          series.data.push({ timestamp, value });
        } catch (err) {
          console.error("MQTT comparison parse error:", err);
        }
      }
    });

    if (typeof unsubscribe === "function") {
      comparisonUnsubscribeRefs.current.push(unsubscribe);
    }
  };

  // Karşılaştırma serilerini yönetmek için useEffect
  useEffect(() => {
    // Önceki ve mevcut seçimleri karşılaştır
    const prevKeys = Object.keys(prevComparisonSelections.current);
    const currentKeys = Object.keys(comparisonSelections);

    // Kaldırılan serileri temizle
    const removedKeys = prevKeys.filter(key => !currentKeys.includes(key));
    removedKeys.forEach(key => {
      const seriesToRemove = comparisonSeriesRefs.current.filter(s => s.get("name")?.startsWith(key));
      seriesToRemove.forEach(series => {
        series.dispose();
        comparisonSeriesRefs.current = comparisonSeriesRefs.current.filter(s => s !== series);
      });       
      // MQTT aboneliklerini kaldır
      const [il, ges, arac] = key.split('/');
      const mqttIl = il.charAt(0).toUpperCase() + il.slice(1);
      const mqttGes = ges.charAt(0).toUpperCase() + ges.slice(1);
      const cihazGrubu = getCihazGrubu(arac);
      if (cihazGrubu) {
        const topic = `${mqttIl}/${mqttGes}/${cihazGrubu}/${arac}`;
        window.electronAPI.unsubscribeMqtt(topic);
      }
    });

    // **YENİ EKLENEN** serileri işle
    const addedKeys = currentKeys.filter(key => !prevKeys.includes(key));
    addedKeys.forEach(key => {
      const variables = comparisonSelections[key];
      variables.forEach(variableName => {
        addComparisonLine(key, variableName);
      });
    });

    // Referansı güncelle
    prevComparisonSelections.current = { ...comparisonSelections };

    // Cleanup sadece UNMOUNT'ta çalışsın
    return () => {
      if (Object.keys(comparisonSelections).length === 0) {
        comparisonSeriesRefs.current.forEach(series => series.dispose());
        comparisonSeriesRefs.current = [];
        comparisonUnsubscribeRefs.current.forEach(unsub => {
          if (typeof unsub === 'function') unsub();
        });
        comparisonUnsubscribeRefs.current = [];
      }
    };
  }, [comparisonSelections]);

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
      
      const { timeUnit, count } = timeIntervalRef.current;
      const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
      const intervalMs = ms * 200; // 200 mum için gerekli süre
      
      if (currentMin - oldestTimestamp < intervalMs) {
        const from = new Date(oldestTimestamp - intervalMs);
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

  // timeInterval değişikliğini dinleyen effect
  useEffect(() => {
    const hours = new Set<string>();
    dataBuffer.forEach((d: any) => {
      const date = new Date(d.timestamp+3*60*60*1000);
      if (date.getMinutes() === 0 && date.getSeconds() === 0) {
        hours.add(date.toISOString());
      }
    });

   
    if (!selectedVariable || !chartRef.current) return;
    
    const chart = chartRef.current;
    const valueSeries = chart.get('stockSeries');
    if (!valueSeries) return;

    // Mevcut verileri al
    const currentData = valueSeries.data.values;
    if (!currentData || currentData.length === 0) return;

    // Önce mevcut verileri temizle
    valueSeries.data.clear();

    // Zaman aralığına göre timestamp'i yuvarla
    const getRoundedTimestamp = (timestamp: number) => {
      const { timeUnit, count } = timeIntervalRef.current;
      const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
      return Math.floor(timestamp / ms) * ms;
    };

    // Seçilen zaman aralığına göre gruplama
    const grouped = new Map<number, { values: number[]; timestamps: number[] }>();
    dataBuffer.forEach((d: any) => {
      const roundedTime = getRoundedTimestamp(d.timestamp);
      if (!grouped.has(roundedTime)) {
        grouped.set(roundedTime, { values: [], timestamps: [] });
      }
      const group = grouped.get(roundedTime)!;
      group.values.push(d.value);
      group.timestamps.push(d.timestamp);
    });

    // Her zaman aralığı için yeni mum oluştur
    const newCandles = Array.from(grouped.entries())
      .filter(([_, group]) => group.values.length > 0)
      .sort(([timeA], [timeB]) => timeA - timeB)
      .map(([time, group]) => {
        const values = group.values;
        return {
          timestamp: time,
          open: values[0],
          high: Math.max(...values),
          low: Math.min(...values),
          close: values[values.length - 1],
          volume: values.length
        };
      });

    const volumeSeries = chart.get('volumeSeries');
    // Verileri güncelle
    valueSeries.data.setAll(newCandles);
    volumeSeries?.data.setAll(newCandles);

    // DateAxis'i güncelle
    if (dateAxisRef.current) {
      dateAxisRef.current.set("baseInterval", {
        timeUnit: timeIntervalRef.current.timeUnit,
        count: timeIntervalRef.current.count
      });
    }

    // Veri güncellemesi tamamlandığında zoom'u ayarla
    valueSeries.events.once("datavalidated", function() {
      if (dateAxisRef.current && newCandles.length > 0) {
        const start = newCandles[0].timestamp;
        const end = newCandles[newCandles.length - 1].timestamp;
        dateAxisRef.current.zoomToDates(new Date(start), new Date(end));
      }
    });

    return () => {
      // Cleanup function if needed
    };
  }, [timeIntervalRef.current]);


  

  return (
    <div className="overview-container">
      <div className="selection-container">
        <NestedDropdown
          dropdownData={dropdownData}
          onSelect={(il, ges, arac, variable) => {
            console.log("onSelect",il, ges, arac, variable);
            setSelectedIl(il);
            setSelectedGes(ges);
            setSelectedArac(arac);
            setSelectedVariable(variable);
            setHasZoomedInitially(false);
          }}
          selectedIl={selectedIl}
          selectedGes={selectedGes}
          selectedArac={selectedArac}
          selectedVariable={selectedVariable}
        />
        <ComparisonSeriesNestedDropdown
          dropdownData={dropdownData}
          onSelect={(il, ges, arac, variables) => {
            // UI için il, ges, arac seçimlerini güncelle
            if (il) setSelectedComparisonIl(il);
            if (ges) setSelectedComparisonGes(ges);
            if (arac) setSelectedComparisonArac(arac);

            // Değişken seçimlerini güncelle
     
            setComparisonSelections(prev => {
              const updated = { ...prev };
              const key = `${il}/${ges}/${arac}`;
              if (variables.length > 0) {
                updated[key] = variables;
              } else {
                // Hiç değişken seçili değilse anahtarı tamamen sil
                delete updated[key];
              }
              return updated;
            });
            
          }}
          selectedIl={selectedComparisonIl}
          selectedGes={selectedComparisonGes}
          selectedArac={selectedComparisonArac}
          selectedVariables={comparisonSelections}
        />
      </div>
      <div id="chartcontrols" className="chart-controls"></div>
      <div id="chartdiv" className="chart-container"></div>
    </div>
  );
};

export default Overview;

