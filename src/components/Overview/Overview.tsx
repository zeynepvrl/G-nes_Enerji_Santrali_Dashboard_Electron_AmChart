import React, { useEffect, useRef, useState,useCallback } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5stock from '@amcharts/amcharts5/stock';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import './Overview.css';
import deviceConfigs from '../../config/deviceConfigs.json';
import MainSeriesNestedDropdown from './mainSeriesNestedDropDown';
import ComparisonSeriesNestedDropdown from './comparisonSeriesNestedDropdown';
import {
  ChartDataPoint,
  CandleData,
  TimeInterval,
  ChartType,
  ChartDataRequest,
  VariableConfig,
  DeviceType,
  DeviceGroup,
  DropdownData,
  ProcessedMqttData,
  ElectronAPI
} from '../../types';   

// Global window interface extension
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}


type SeriesConfig = {
  il: string;
  ges: string;
  arac: string;
  variable: string;
  color?: string;
};

// Karşılaştırma çizgileri için renk paleti
const COMPARISON_COLORS = [
  "#ff6b6b", // Kırmızı
  "#4ecdc4", // Turkuaz
  "#45b7d1", // Mavi
  "#96ceb4", // Yeşil
  "#feca57", // Sarı
  "#ff9ff3", // Pembe
  "#54a0ff", // Mavi
  "#5f27cd", // Mor
  "#00d2d3", // Turkuaz
  "#ff9f43", // Turuncu
  "#10ac84", // Yeşil
  "#ee5a24", // Kırmızı-turuncu
  "#575fcf", // Mavi-mor
  "#0abde3", // Açık mavi
  "#48dbfb", // Çok açık mavi
];


const Overview: React.FC = () => {
  const chartRef = useRef<am5stock.StockChart | null>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const dateAxisRef = useRef<am5xy.GaplessDateAxis<am5xy.AxisRenderer> | null>(null);
  const valueAxisRef = useRef<am5xy.ValueAxis<am5xy.AxisRenderer> | null>(null);
  const [selectedIl, setSelectedIl] = useState('');
  const [selectedGes, setSelectedGes] = useState('');
  const [selectedArac, setSelectedArac] = useState('');
  const [selectedVariable, setSelectedVariable] = useState('');
  const selectedIlRef = useRef('');
  const selectedGesRef = useRef('');
  const selectedAracRef = useRef('');
  const selectedVariableRef = useRef('');

  
  const [dropdownData, setDropdownData] = useState<DropdownData>({});
  const timeIntervalRef = useRef<TimeInterval>({ timeUnit: "minute", count: 1 });
  // Veri buffer'ları için state'ler
  const [dataBuffer, setDataBuffer] = useState<ChartDataPoint[]>([]);
  const [hasZoomedInitially, setHasZoomedInitially] = useState(false);
  const isLoadingHistoricalDataRef = useRef(false);
  const lastLoadTimeRef = useRef(0);
  const [selectedComparisonIl, setSelectedComparisonIl] = useState('');
  const [selectedComparisonGes, setSelectedComparisonGes] = useState('');
  const [selectedComparisonArac, setSelectedComparisonArac] = useState('');
  const [comparisonSelections, setComparisonSelections] = useState<Record<string, string[]>>({});
  const comparisonSeriesRefs = useRef<am5xy.LineSeries[]>([]);
  const comparisonUnsubscribeRefs = useRef<(() => void)[]>([]);
  const prevComparisonSelections = useRef<Record<string, string[]>>({});
  const [mainSeriesConfig, setMainSeriesConfig] = useState<SeriesConfig | null>(null);
  const [comparisonSeries, setComparisonSeries] = useState<SeriesConfig[]>([]);
  // Karşılaştırma çizgilerinin renklerini saklamak için
  const [comparisonColors, setComparisonColors] = useState<Record<string, string>>({});
  // Popup pozisyonu için state
  const [popupPosition, setPopupPosition] = useState({ x: 10, y: 10 });
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const [comparisonStyles, setComparisonStyles] = useState<Record<string, { width: number; style: 'solid' | 'dashed' | 'dotted' }>>({});

  function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // Tablo adından cihaz grubunu otomatik bul
  function getCihazGrubu(tablename: string): DeviceGroup | '' {
    if (!tablename) return '';
    const lower = tablename.toLowerCase();
    if (lower.startsWith('inv')) return 'inverters';
    if (lower.startsWith('analizor')) return 'analizors';
    if (lower.startsWith('rtu')) return 'rtus';
    if (lower === 'history') return 'history';
    return '';
  }
   // Get device type from table name
   function getDeviceType(tablename: string): DeviceType | '' {
    if (!tablename) return '';
    const lower = tablename.toLowerCase();
    if (lower.startsWith('inv')) return 'inverter';
    if (lower.startsWith('analizor')) return 'analizor';
    if (lower.startsWith('rtu')) return 'rtu';
    return '';
  }
 
  useEffect(() => {
    console.log("1. efeect çalıştı dropdown setterlar")
    if (!window.electronAPI?.getAllGESdbsAndTheirTablesForDropdowns) return;
    window.electronAPI.getAllGESdbsAndTheirTablesForDropdowns().then((allGesdbs: any) => {
      const data: Record<string, Record<string, Record<string, VariableConfig[]>>> = {};
      const ilSet = new Set<string>();

      Object.keys(allGesdbs).forEach(dbName => {
        const [il, ...gesArr] = dbName.split('_');
        const ges = gesArr.join('_');
        ilSet.add(il);
        
        if (!data[il]) data[il] = {};
        if (!data[il][ges]) data[il][ges] = {};

        if(dbName.includes('zenon')){
          Object.keys(allGesdbs[dbName]).forEach((tableName: string) => {
            const columns = allGesdbs[dbName][tableName];
            if (Array.isArray(columns)) {
              const variables: VariableConfig[] = columns.map((columnName: string, index: number) => ({
                name: columnName,
                index: index
              }));
              data[il][ges][tableName] = variables;
            }
          });
        }
        else{
          allGesdbs[dbName].forEach((arac: any) => {
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
        }
        
      });

      setDropdownData(data);
      
      
    });
  }, []);
  
    // Ana effect -  grafik yalnızca ilk render oluşturuluyor müklü
  useEffect(() => {
      console.log("3. efeect çalıştı chart oluşturma")
      const root = am5.Root.new("chartdiv");
      rootRef.current = root;  
      root.setThemes([
        am5themes_Animated.new(root)
      ]);
      const stockChart = root.container.children.push(
        am5stock.StockChart.new(root, {
          paddingRight: 0,
        })
      );
      root.numberFormatter.set("numberFormat", "#,###.00");
      const mainPanel = stockChart.panels.push(
        am5stock.StockPanel.new(root, {
          wheelY: "zoomX",
          panX: true,
          panY: true,
        })
      );
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
      stockChart.set("stockSeries", valueSeries);
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
  }, []);
  
  // Variable seçilince mqtt ye bağlar canlı veri için ve geçmiş 20 saatlik verisini alır setDataBuffer
  useEffect(() => {
    if (!selectedIl || !selectedGes || !selectedArac || !selectedVariable) return;
  
    let unsubscribeMqtt: (() => void) | null = null;
  
    const fetchAndInit = async () => {
      try {
        const dbName = `${selectedIl}_${selectedGes}`;
        const variableConfig = dropdownData[selectedIl][selectedGes][selectedArac].find(v => v.name === selectedVariable);
        if (!variableConfig) return;
  
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - 10 * 60 * 60 * 1000);
        const endTimeStr = endTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
        const startTimeStr = startTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
  
        const records = await window.electronAPI.getTablesHistory(dbName, selectedArac, undefined, startTimeStr, endTimeStr);
        if (!records || records.length === 0) return;
  
        const rawData: ChartDataPoint[] = records.map((record) => {
          const timestamp = new Date(record.timestamp).getTime();
          const value = record[selectedVariable];
          const numValue = selectedVariable === "p" ? Math.abs(Number(value)) : Number(value);
          return { timestamp, value: numValue };
        });
  
        setDataBuffer(rawData);
  
        const chartData = await window.electronAPI.getChartData({
          data: rawData,
          timeUnit: timeIntervalRef.current.timeUnit,
          count: timeIntervalRef.current.count,
          chartType: 'candlestick'
        }) as CandleData[];
  
        const chart = chartRef.current;
        if (chart && chartData.length > 0) {
          const valueSeries = chart.get("stockSeries");
          const volumeSeries = chart.get("volumeSeries");
          valueSeries?.data.setAll(chartData);
          volumeSeries?.data.setAll(chartData);
  
          // ⬇️ Zoom işlemi burada
          if (!hasZoomedInitially && chartData.length > 199) {
            valueSeries?.events.once("datavalidated", () => {
              if (dateAxisRef.current) {
                const axis = dateAxisRef.current;
                const startIndex = Math.max(0, chartData.length - 180);
                const start = chartData[startIndex]?.timestamp;
                const end = chartData[chartData.length - 1]?.timestamp;
  
                if (start && end) {
                  const beforeMin = axis.getPrivate("selectionMin");
                  const beforeMax = axis.getPrivate("selectionMax");
  
                  axis.zoomToDates(new Date(start), new Date(end));
                  console.log("🔍 Initial zoom başlatıldı...");
  
                  setTimeout(() => {
                    const afterMin = axis.getPrivate("selectionMin");
                    const afterMax = axis.getPrivate("selectionMax");
  
                    if (afterMin !== beforeMin || afterMax !== beforeMax) {
                      console.log("✅ Zoom gerçekten değişti, setHasZoomedInitially true yapılıyor");
                      setHasZoomedInitially(true);
                    } else {
                      console.log("⚠️ Zoom değeri değişmedi, setHasZoomedInitially yapılmadı");
                    }
                  }, 2000);
                }
              }
            });
          }
        }
  
        // 🔔 MQTT abonesi yalnızca geçmiş veri geldikten sonra başlatılır
        if (selectedIl !== "zenon") {
          const mqttIl = capitalize(selectedIl);
          const mqttGes = capitalize(selectedGes);
          const cihazGrubu = getCihazGrubu(selectedArac);
          if (cihazGrubu) {
            const topic = `${mqttIl}/${mqttGes}/${cihazGrubu}/${selectedArac}`;
            console.log("📡 MQTT SUBSCRIBE:", topic);
            window.electronAPI.subscribeMqtt(topic);
  
            unsubscribeMqtt = window.electronAPI.onMqttData((data, incomingTopic) => {
              if (incomingTopic?.toLowerCase() === topic.toLowerCase()) {
                handleMqttData(data, variableConfig);
              }
            });
          }
        }
      } catch (err) {
        console.error("❌ fetchAndInit error:", err);
      }
    };
  
    fetchAndInit();
  
    return () => {
      if (unsubscribeMqtt) {
        console.log("📡 MQTT UNSUBSCRIBE");
        unsubscribeMqtt();
      }
    };
  }, [selectedVariable]);
  
  
  const handleMqttData = async (data: string, variableConfig: VariableConfig) => {
    try {
      const result = await window.electronAPI.processMqttData(data, variableConfig);
      if (!result) return;
  
      const { timestamp } = result;
      const value = selectedVariable === "p" ? Math.abs(result.value) : result.value;
  
      setDataBuffer(prev => [...prev, { timestamp, value }]);
  
      const { timeUnit, count } = timeIntervalRef.current;
      const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
      const roundedTime = Math.floor(timestamp / ms) * ms;
  
      const chart = chartRef.current;
      if (!chart) return;
  
      const valueSeries = chart.get("stockSeries");
      const volumeSeries = chart.get("volumeSeries");
      if (!valueSeries) return;
  
      const currentCandle = valueSeries.data.values.find((item: any) => item.timestamp === roundedTime) as CandleData | undefined;
  
      if (currentCandle) {
        const updatedCandle: CandleData = {
          ...currentCandle,
          high: Math.max(currentCandle.high, value),
          low: Math.min(currentCandle.low, value),
          close: value,
          volume: currentCandle.volume + 1
        };
        valueSeries.data.setIndex(valueSeries.data.indexOf(currentCandle), updatedCandle);
        volumeSeries?.data.setIndex(volumeSeries.data.indexOf(currentCandle), updatedCandle);
      } else {
        const newCandle: CandleData = {
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
      console.error("❌ handleMqttData error:", error);
    }
  };
  

  useEffect(() => {
    selectedIlRef.current = selectedIl;
    selectedGesRef.current = selectedGes;
    selectedAracRef.current = selectedArac;
    selectedVariableRef.current = selectedVariable;
  }, [selectedIl, selectedGes, selectedArac, selectedVariable]);

  // Geçmiş veri yükleme fonksiyonu
  const loadHistoricalCandlestickData = async (startTime: Date, endTime: Date) => {
    if (!selectedIlRef.current || !selectedGesRef.current || !selectedAracRef.current || !selectedVariableRef.current || isLoadingHistoricalDataRef.current){ 
      console.log("sorun burda mi 590")
      return;
    }
    isLoadingHistoricalDataRef.current = true;
    const dbName = `${selectedIlRef.current}_${selectedGesRef.current}`;
    console.log("çekiliyoor");
    try {
      // Türkiye saati için özel format
      const startTimeStr = startTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
      const endTimeStr = endTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
      console.log(dbName, selectedAracRef.current, undefined, startTimeStr, endTimeStr)
      const records = await window.electronAPI.getTablesHistory(dbName, selectedAracRef.current, undefined, startTimeStr, endTimeStr);
  
      if (records && records.length > 0) {
        const newData: ChartDataPoint[] = records
          .map(record => ({
            timestamp: new Date(record.timestamp).getTime(),
            value: selectedVariable === "p" ? Math.abs(Number(record[selectedVariable])) : Number(record[selectedVariable]) // p değişkeni için pozitife çevir
          }))
          .filter(d => !isNaN(d.value))
          .sort((a, b) => a.timestamp - b.timestamp);
  
        setDataBuffer(prev => [...newData, ...prev]);
  
        const chartData = await window.electronAPI.getChartData({
          data: newData,
          timeUnit: timeIntervalRef.current.timeUnit,
          count: timeIntervalRef.current.count,
          chartType: 'candlestick'
        }) as CandleData[];
  
        if (chartData.length > 0 && chartRef.current) {
          const valueSeries = chartRef.current.get('stockSeries');
          const volumeSeries = chartRef.current.get('volumeSeries');
  
          if (valueSeries && volumeSeries) {
            const existingData = valueSeries.data.values as CandleData[];
            const combinedData = [...chartData, ...existingData];
            valueSeries.data.setAll(combinedData);
            volumeSeries.data.setAll(combinedData);
          }
        }
      }

    } catch (error) {
      console.error('Geçmiş veriler yüklenirken hata:', error);
    } finally {
      isLoadingHistoricalDataRef.current = false;
    }
  };
  // DateAxis için event listener
  useEffect(() => {
    if (!dateAxisRef.current || !hasZoomedInitially) {
      console.log("dateAxisRef.current yok")
      return;
    }
    const handleStart = (start: number | undefined) => {
      if (start === undefined || isLoadingHistoricalDataRef.current || !hasZoomedInitially ){
        return;
      }
      const now = Date.now();
      if (now - lastLoadTimeRef.current < 1000) {
        console.log("1 saniye geçmedi")
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
        loadHistoricalCandlestickData(from, to);
      }
    };
    dateAxisRef.current?.on("start", handleStart);
    return () => {
      dateAxisRef.current?.off("start", handleStart);
    };
  }, [hasZoomedInitially]); //dateAxisRef vardı kaldırdım gerek yok, ilk zoom yapıldıında x ekseni izlenmeye başlayabilir

  useEffect(() => {
    console.log("hasZoomedInitially değişti ",hasZoomedInitially)
    console.log("isLoadingHistoricalDataRef.current değişti ",isLoadingHistoricalDataRef.current)
  }, [hasZoomedInitially,isLoadingHistoricalDataRef.current])

  const addComparisonLine = async (key: string, variableName: string) => {
    console.log(`📊 Adding comparison line:`, { key, variableName });
    if (!rootRef.current || !chartRef.current || !dateAxisRef.current || !valueAxisRef.current) {
      console.warn('⚠️ Chart references not ready for comparison line.');
      return;
    }
  
    const chart = chartRef.current;
    const mainPanel = chart.panels.getIndex(0);
    if (!mainPanel) return;
  
    const [il, ges, arac] = key.split('/');
    const dbName = `${il}_${ges}`;
    const variableConfig = dropdownData?.[il]?.[ges]?.[arac]?.find(v => v.name === variableName);
    if (!variableConfig) {
      console.warn(`⚠️ Variable config not found for comparison line:`, { key, variableName });
      return;
    }
  
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 10 * 60 * 60 * 1000); // son 10 saat
    console.log(`📥 Fetching historical data for comparison line:`, { dbName, arac, startTime, endTime });
    
    // Türkiye saati için özel format
    const startTimeStr = startTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
    const endTimeStr = endTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
    
    const rawRecords = await window.electronAPI.getTablesHistory(dbName, arac, undefined, startTimeStr, endTimeStr);
    console.log(`✅ Historical data received for comparison line:`, { recordCount: rawRecords?.length || 0 });
  
    const rawData: ChartDataPoint[] = rawRecords.map(record => ({
      timestamp: new Date(record.timestamp).getTime(),
      value: variableName === "p" ? Math.abs(Number(record[variableName])) : Number(record[variableName]) // p değişkeni için pozitife çevir
    })).filter(d => !isNaN(d.value));
  
    console.log(`🔧 Creating chart data for comparison line with worker...`);
    const lineData = await window.electronAPI.getChartData({
      data: rawData,
      timeUnit: timeIntervalRef.current.timeUnit,
      count: timeIntervalRef.current.count,
      chartType: 'line'
    }) as ChartDataPoint[];
    //console.log(`📈 Chart data created for comparison line:`, { dataPointCount: lineData?.length || 0 });
  
    // Renk seçimi - mevcut karşılaştırma serilerinin sayısına göre
    const currentComparisonCount = comparisonSeriesRefs.current.length;
    const colorIndex = currentComparisonCount % COMPARISON_COLORS.length;
    const selectedColor = COMPARISON_COLORS[colorIndex];
  
    const series = am5xy.LineSeries.new(rootRef.current, {
      name: `${key}-${variableName}`,
      valueXField: "timestamp",
      valueYField: "value",
      xAxis: dateAxisRef.current,
      yAxis: valueAxisRef.current,
      stroke: am5.color(selectedColor),
      tooltip: am5.Tooltip.new(rootRef.current, {
        labelText: `{name}\n[bold]{valueY}[/]`,
        pointerOrientation: "horizontal"
      })
    });

    // Çizgi kalınlığı ve şeffaflığını ayarla
    series.strokes.template.setAll({
      strokeWidth: 2,
      strokeOpacity: 0.8
    });
  
    series.data.setAll(lineData);
    mainPanel.series.push(series);
    comparisonSeriesRefs.current.push(series);
  
    // MQTT aboneliği
    const mqttIl = il.charAt(0).toUpperCase() + il.slice(1);
    const mqttGes = ges.charAt(0).toUpperCase() + ges.slice(1);
    const cihazGrubu = getCihazGrubu(arac);
    if (!cihazGrubu) return;
  
    const topic = `${mqttIl}/${mqttGes}/${cihazGrubu}/${arac}`;
    console.log(`📡 Subscribing to MQTT for comparison line:`, { topic });
    await window.electronAPI.subscribeMqtt(topic);
  
    const unsubscribe = window.electronAPI.onMqttData(async (data, incomingTopic) => {
      if (incomingTopic?.toLowerCase() === topic.toLowerCase()) {
        try {
          const result = await window.electronAPI.processMqttData(data, variableConfig);
          if (!result) return;
          const { timestamp } = result;
          const value = variableName === "p" ? Math.abs(result.value) : result.value; // p değişkeni için pozitife çevir
          
          const { timeUnit, count } = timeIntervalRef.current;
          const ms = timeUnit === "minute" ? count * 60000 : count * 3600000;
          const roundedTime = Math.floor(timestamp / ms) * ms;

          const lastPoint: any = series.data.getIndex(series.data.length - 1);

          if (lastPoint && lastPoint.timestamp === roundedTime) {
            // Mevcut zaman aralığındaki noktanın ortalamasını güncelle
            const currentSum = lastPoint._sum || lastPoint.value;
            const currentCount = lastPoint._count || 1;
            
            const newSum = currentSum + value;
            const newCount = currentCount + 1;

            series.data.setIndex(series.data.length - 1, {
              timestamp: roundedTime,
              value: newSum / newCount,
              _sum: newSum,
              _count: newCount
            });
          } else {
            // Yeni zaman aralığı için yeni bir nokta ekle
            series.data.push({
              timestamp: roundedTime,
              value: value,
              _sum: value,
              _count: 1
            });
          }
        } catch (err) {
          console.error("❌ MQTT comparison parse error:", err);
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

  
  // timeInterval değişikliğini dinleyen effect
  useEffect(() => {
    const hours = new Set<string>();
    dataBuffer.forEach((d: any) => {
      const date = new Date(d.timestamp);
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

    // Worker kullanarak yeni chart verisi oluştur
    const processChartData = async () => {
      try {
        const chartData = await window.electronAPI.getChartData({
          data: dataBuffer,
          timeUnit: timeIntervalRef.current.timeUnit,
          count: timeIntervalRef.current.count,
          chartType: 'candlestick'
        }) as CandleData[];

        const volumeSeries = chart.get('volumeSeries');
        // Verileri güncelle
        valueSeries.data.setAll(chartData);
        volumeSeries?.data.setAll(chartData);

        // DateAxis'i güncelle
        if (dateAxisRef.current) {
          dateAxisRef.current.set("baseInterval", {
            timeUnit: timeIntervalRef.current.timeUnit,
            count: timeIntervalRef.current.count
          });
        }

        // Veri güncellemesi tamamlandığında zoom'u ayarla
        valueSeries.events.once("datavalidated", function() {
          if (dateAxisRef.current && chartData.length > 0) {
            const start = chartData[0].timestamp;
            const end = chartData[chartData.length - 1].timestamp;
            dateAxisRef.current.zoomToDates(new Date(start), new Date(end));
          }
        });
      } catch (error) {
        console.error('Worker chart data processing error in timeInterval effect:', error);
      }
    };

    processChartData();

    return () => {
      // Cleanup function if needed
    };
  }, [timeIntervalRef.current]);

  // Grafiği en sağa kaydırma fonksiyonu
  const scrollToEnd = useCallback(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const valueSeries = chart.get('stockSeries');
    if (!valueSeries) return;

    const seriesData = valueSeries.data.values as { timestamp: number }[];
    if (!seriesData || seriesData.length === 0) return;

    // En son veri noktasını bul
    const lastDataPoint = seriesData[seriesData.length - 1];
    const lastTimestamp = lastDataPoint.timestamp;

    // Grafiği en son veri noktasına odakla
    if (dateAxisRef.current) {
      const endDate = new Date(lastTimestamp);
      
      // Zaman aralığına göre başlangıç tarihini ayarla
      const { timeUnit, count } = timeIntervalRef.current;
      const intervalMs = timeUnit === "minute" ? count * 60 * 1000 : count * 60 * 60 * 1000;
      const viewWindowMs = intervalMs * 200; // 200 veri noktası için gerekli süre
      
      const startDate = new Date(lastTimestamp - viewWindowMs);
      
      // Grafiği yumuşak bir şekilde kaydır
      dateAxisRef.current.zoomToDates(startDate, endDate);
      
      console.log('📈 Grafik en sağa kaydırıldı:', { 
        startDate: startDate.toISOString(), 
        endDate: endDate.toISOString(),
        dataPoints: seriesData.length 
      });
    }
  }, [timeIntervalRef.current]);

  const handleMainSeriesSelect = (il: string, ges: string, arac: string, variable: string) => {
    setSelectedIl(il);
    setSelectedGes(ges);
    setSelectedArac(arac);
    setSelectedVariable(variable);
    if (il && ges && arac && variable) {
      setMainSeriesConfig({ il, ges, arac, variable, color: "#8884d8" });
    }
  };

  const handleComparisonSeriesSelect = (il: string, ges: string, arac: string, variables: string[]) => {
    // Ayrı state'leri güncelle
    setSelectedComparisonIl(il);
    setSelectedComparisonGes(ges);
    setSelectedComparisonArac(arac);
    
    const key = `${il}/${ges}/${arac}`;
    setComparisonSelections(prev => {
      const updated = { ...prev };
      if (variables.length > 0) {
        updated[key] = variables;
      } else {
        delete updated[key];
      }
      return updated;
    });
  };

  // Karşılaştırma çizgisinin rengini değiştir
  const changeComparisonLineColor = (seriesName: string, newColor: string) => {
    const series = comparisonSeriesRefs.current.find(s => s.get("name") === seriesName);
    if (series) {
      series.set("stroke", am5.color(newColor));
      // Renk state'ini güncelle
      setComparisonColors(prev => ({
        ...prev,
        [seriesName]: newColor
      }));
    }
  };

  // Karşılaştırma çizgisinin stilini değiştir (kesikli, düz, noktalı)
  const changeComparisonLineStyle = (seriesName: string, style: 'solid' | 'dashed' | 'dotted') => {
    const series = comparisonSeriesRefs.current.find(s => s.get("name") === seriesName);
    if (series) {
      const dashArray = style === 'dashed' ? [5, 5] : style === 'dotted' ? [2, 2] : undefined;
      series.strokes.template.set("strokeDasharray", dashArray);
      setComparisonStyles(prev => ({
        ...prev,
        [seriesName]: { ...(prev[seriesName] || { width: 2, style: 'solid' }), style }
      }));
    }
  };

  // Karşılaştırma çizgisinin kalınlığını değiştir
  const changeComparisonLineWidth = (seriesName: string, width: number) => {
    const series = comparisonSeriesRefs.current.find(s => s.get("name") === seriesName);
    if (series) {
      series.strokes.template.set("strokeWidth", width);
      setComparisonStyles(prev => ({
        ...prev,
        [seriesName]: { ...(prev[seriesName] || { width: 2, style: 'solid' }), width }
      }));
    }
  };

  // Popup sürükleme işlevselliği
  const handleMouseDown = (e: React.MouseEvent) => {
    // Sadece sol tıklamayı dikkate al
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;

    // Sadece başlık (h4) veya kapalı ikon üzerinden sürüklemeyi başlat
    if (target.closest('h4') || target.closest('.settings-toggle-btn')) {
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - popupPosition.x,
            y: e.clientY - popupPosition.y
        };
        e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      
      const elementWidth = showSettings ? popupRef.current?.offsetWidth : 44;
      const elementHeight = showSettings ? popupRef.current?.offsetHeight : 44;

      const maxX = window.innerWidth - (elementWidth || 44);
      const maxY = window.innerHeight - (elementHeight || 44);
      
      setPopupPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse event listener'ları ekle/çıkar
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Popup'ın başlangıç pozisyonunu ayarla
  useEffect(() => {
    if (showSettings && popupRef.current && !isInitialPositionSet) {
      const popupHeight = popupRef.current.offsetHeight;
      setPopupPosition({ x: 10, y: window.innerHeight - popupHeight - 20 });
      setIsInitialPositionSet(true);
    }
  }, [showSettings, isInitialPositionSet]);

  return (
    <div className="overview-container">
      <div className="chart-controls">
        <div className="control-group">
          <label>Ana Değer Seç</label>
          <MainSeriesNestedDropdown
            dropdownData={dropdownData}
            onSelect={handleMainSeriesSelect}
            selectedIl={selectedIl}
            selectedGes={selectedGes}
            selectedArac={selectedArac}
            selectedVariable={selectedVariable}
          />
        </div>
        <div className="control-group">
          <label>+ Karşılaştır</label>
          <ComparisonSeriesNestedDropdown
            dropdownData={dropdownData}
            onSelect={handleComparisonSeriesSelect}
            selectedIl={selectedComparisonIl}
            selectedGes={selectedComparisonGes}
            selectedArac={selectedComparisonArac}
            selectedVariables={comparisonSelections}
          />
        </div>

        {/* This div is for AmCharts' own toolbar (zoom, draw, etc.) */}
        <div id="chartcontrols" className="amcharts-toolbar-container" />
        
        <div className="chart-controls-right">
          <button 
            onClick={scrollToEnd}
            className="scroll-to-end-btn"
            title="Grafiği en son veri noktasına kaydır"
          >
            ➡️ En Sağa Kaydır
          </button>
        </div>
      </div>
      
      <div id="chartdiv" className="chart-container">
        {/* Karşılaştırma çizgi ayarları */}
        {comparisonSeriesRefs.current.length > 0 && showSettings && (
          <div 
            ref={popupRef}
            className={`comparison-line-settings ${isDragging ? 'dragging' : ''}`}
            style={{
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`
            }}
            onMouseDown={handleMouseDown}
          >
            <h4>
              Karşılaştırma Çizgi Ayarları
              <button 
                className="close-btn"
                onClick={() => setShowSettings(false)}
                title="Ayarları kapat"
              >
                ×
              </button>
            </h4>
            {/* @ts-ignore */}
            {comparisonSeriesRefs.current
              .filter(series => series && !series.isDisposed())
              .map((series, index) => {
              const seriesName = series.get("name") as string;
              const displayName = seriesName
                .split('/')
                .pop()
                ?.replace(/-/g, ' ') || seriesName;
              
              const currentColor = comparisonColors[seriesName] || COMPARISON_COLORS[index % COMPARISON_COLORS.length];
              
              return (
                <div key={seriesName} className="comparison-line-item">
                  <label title={seriesName}>{displayName}</label>
                  <input
                    type="color"
                    className="color-picker"
                    value={currentColor}
                    onChange={(e) => changeComparisonLineColor(seriesName, e.target.value)}
                    title="Renk seç"
                  />
                  <select
                    className="line-style-select"
                    defaultValue={series.strokes.template.get("strokeDasharray") ? "dashed" : "solid"}
                    onChange={(e) => changeComparisonLineStyle(seriesName, e.target.value as 'solid' | 'dashed' | 'dotted')}
                    title="Çizgi stili"
                  >
                    <option value="solid">Düz</option>
                    <option value="dashed">Kesikli</option>
                    <option value="dotted">Noktalı</option>
                  </select>
                  <input
                    type="number"
                    className="line-width-input"
                    min="1"
                    max="10"
                    defaultValue={series.strokes.template.get("strokeWidth")}
                    onChange={(e) => changeComparisonLineWidth(seriesName, Number(e.target.value))}
                    title="Çizgi kalınlığı"
                  />
                </div>
              );
            })}
          </div>
        )}
        
        {/* Ayarları tekrar açma butonu */}
        {comparisonSeriesRefs.current.length > 0 && !showSettings && (
          <button
            className="settings-toggle-btn"
            style={{
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`,
            }}
            onClick={() => setShowSettings(true)}
            onMouseDown={handleMouseDown}
            title="Çizgi ayarlarını aç"
          >
            ⚙️
          </button>
        )}
      </div>
    </div>
  );
};
export default Overview;


