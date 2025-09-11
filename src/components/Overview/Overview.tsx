import React, { useEffect, useRef, useState,useCallback, useMemo } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5stock from '@amcharts/amcharts5/stock';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import './Overview.css';
import candlestickIcon from '../../assets/candlestick-chart.png';
import imageIcon from '../../assets/image.png';
import deviceConfigs from '../../config/deviceConfigs.json';
import MainSeriesNestedDropdown from './mainSeriesNestedDropDown';
import ComparisonSeriesNestedDropdown from './comparisonSeriesNestedDropdown';
import { findLineSeriesByName, findLineSeriesByPrefix, getLineSeriesCount, disposeAllLineSeries, getAllLineSeries } from '../../utils/chartHelpers';
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

// Karşılaştırma çizgileri için renk paleti
const COMPARISON_COLORS = [
  "#ff5733", // Koyu Kırmızı
  "#900c3f", // Bordo
  "#ffbd69", // Altın Sarısı
  "#00b894", // Zeytin Yeşili
  "#0984e3", // Canlı Mavi
  "#6c5ce7", // Lavanta Moru
  "#e17055", // Mercan Kırmızısı
  "#00cec9", // Parlak Turkuaz
  "#d63031", // Koyu Kırmızı
  "#ffeaa7", // Açık Sarı
  "#ff6348", // Domates Kırmızısı
  "#00bfff", // Derin Mavi
  "#e84393", // Şeftali Pembe
  "#55efc4", // Mint Yeşili
  "#f39c12", // Kehribar Sarısı
  "#ff9f43", // Altın Turuncu
  "#22d6b3", // Zümrüt Yeşili
  "#8e44ad", // Mor
  "#1abc9c", // Akdeniz Mavisi
  "#2ecc71", // Canlı Yeşil
  "#8e44ad", // Mor
  "#f1c40f", // Sarı Altın
  "#f0f0f0", // Soluk Beyaz
  "#9b59b6", // Orkide Moru
  "#c0392b", // Koyu Kırmızı
  "#34495e", // Koyu Mavi-Gri
  "#16a085", // Deniz Yeşili
  "#1f78d1", // Koyu Mavi
  "#f5b7b1", // Soluk Pembe
  "#3498db", // Mavi
  "#f6e58d", // Soluk Sarı
  "#e84393", // Pembe
  "#6c5ce7", // Mor
  "#f39c12", // Turuncu Sarı
  "#ff6f61", // Kızıl
  "#6a5acd", // Orta Mor
  "#ff1493", // Canlı Pembe
  "#e74c3c", // Canlı Kırmızı
];



const Overview: React.FC<{visible: boolean}> = ({visible=true}) => {
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
  const pendingRequestsRef = useRef<Set<string>>(new Set());
  const isLoading=useRef(false);
  const [selectedComparisonIl, setSelectedComparisonIl] = useState('');
  const [selectedComparisonGes, setSelectedComparisonGes] = useState('');
  const [selectedComparisonArac, setSelectedComparisonArac] = useState('');
  const [comparisonSelections, setComparisonSelections] = useState<Record<string, string[]>>({});
  const comparisonUnsubscribeRefs = useRef<Map<string, () => void>>(new Map());
  const prevComparisonSelections = useRef<Record<string, string[]>>({});
  // Karşılaştırma çizgilerinin renklerini saklamak için
  const [comparisonColors, setComparisonColors] = useState<Record<string, string>>({});
  // Karşılaştırma serileri yüklenirken loading state'i
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);

  // Popup pozisyonu için state
  const [popupPosition, setPopupPosition] = useState({ x: 10, y: 10 });
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Bildirim sistemi için state'ler
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timestamp: number;
  }>>([]);
  
  // Bildirim gösterme fonksiyonu
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    // Benzersiz ID oluştur - timestamp + random sayı
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = {
      id,
      message,
      type,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Bildirim türüne göre farklı süreler
    let timeoutDuration = 5000; // Varsayılan 5 saniye
    
    switch (type) {
      case 'success':
        timeoutDuration = 3000; // Başarı bildirimleri 3 saniye
        break;
      case 'error':
        timeoutDuration = 8000; // Hata bildirimleri 8 saniye
        break;
      case 'warning':
        timeoutDuration = 6000; // Uyarı bildirimleri 6 saniye
        break;
      case 'info':
        timeoutDuration = 5000; // Bilgi bildirimleri 5 saniye
        break;
    }
    
    // Belirlenen süre sonra bildirimi otomatik kaldır
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, timeoutDuration);
  }, []);
  
  // Bildirimi manuel kaldırma fonksiyonu
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
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
      setSelectedIl("diyarbakir")
      setSelectedGes("cva12")
      setSelectedArac("analizor1")
      setSelectedVariable("p")
    });
  }, []);
  
    // Ana effect -  grafik yalnızca ilk render oluşturuluyor müklü
  useEffect(() => {
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
          maxZoomCount: 500,
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
      stockChart.set("stockSeries", valueSeries);    //bu satır AmCharts'ın ana seriyi tanıması için gereklidir.
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
      valueLegend.data.setAll([valueSeries]);
  
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
      return () => {           //component unmpunt olduğunda çalışacak yer yoruma aldım çünkü başka sayfaya geçince grafik silinmesin
        if (rootRef.current) {
          rootRef.current.dispose();
        }
        console.log("rootRef.current temizlendi");
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
          valueSeries?.data.setAll(chartData);
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

                  setTimeout(() => {
                    const afterMin = axis.getPrivate("selectionMin");
                    const afterMax = axis.getPrivate("selectionMax");
  
                    if (afterMin !== beforeMin || afterMax !== beforeMax) {
                      setHasZoomedInitially(true);
                    } else {
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
        unsubscribeMqtt();
      }
    };
  }, [selectedIl, selectedGes, selectedArac, selectedVariable]);
  
  
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
  const loadHistoricalCandlestickData = async (startTime: Date, endTime: Date ) => {
    if (!selectedIlRef.current || !selectedGesRef.current || !selectedAracRef.current || !selectedVariableRef.current || isLoadingHistoricalDataRef.current){ 
  
      return;
    }
    isLoadingHistoricalDataRef.current = true;
    const dbName = `${selectedIlRef.current}_${selectedGesRef.current}`;
    try {
      // Türkiye saati için özel format
      const startTimeStr = startTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
      const endTimeStr = endTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
      const records = await window.electronAPI.getTablesHistory(dbName, selectedAracRef.current, undefined, startTimeStr, endTimeStr);
  
      if (records && records.length > 0) {
        const newData: ChartDataPoint[] = records
          .map(record => ({
            timestamp: new Date(record.timestamp).getTime(),
            value: selectedVariableRef.current === "p" ? Math.abs(Number(record[selectedVariableRef.current])) : Number(record[selectedVariableRef.current]) // p değişkeni için pozitife çevir
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
          
          if (valueSeries) {
            const existingData = valueSeries.data.values as CandleData[];
            const combinedData = [...chartData, ...existingData];
            valueSeries.data.setAll(combinedData);

          }
        }
      }

    } catch (error) {
      console.error('Geçmiş veriler yüklenirken hata:', error);
    } finally {
      isLoadingHistoricalDataRef.current = false;

    }
  };

  // Karşılaştırma serileri için geçmiş veri yükleme fonksiyonu
  const loadHistoricalComparisonData = async (il: string, ges: string, arac: string, variableName: string, startTime: Date, endTime: Date): Promise<void> => {
    const dbName = `${il}_${ges}`;
    const variableConfig = dropdownData?.[il]?.[ges]?.[arac]?.find(v => v.name === variableName);
    if (!variableConfig ) {
      console.warn(`⚠️ Variable config not found for comparison:`, { il, ges, arac, variableName });
      return;
    }

    try {
      const startTimeStr = startTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
      const endTimeStr = endTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
      
      const records = await window.electronAPI.getTablesHistory(dbName, arac, undefined, startTimeStr, endTimeStr);
      
      if (records && records.length > 0) {
        const rawData: ChartDataPoint[] = records
          .map(record => ({
            timestamp: new Date(record.timestamp).getTime(),
            value: variableName === "p" ? Math.abs(Number(record[variableName])) : Number(record[variableName])
          }))
          .filter(d => !isNaN(d.value))
          .sort((a, b) => a.timestamp - b.timestamp);

        const lineData = await window.electronAPI.getChartData({
          data: rawData,
          timeUnit: timeIntervalRef.current.timeUnit,
          count: timeIntervalRef.current.count,
          chartType: 'line'
        }) as ChartDataPoint[];

        // Karşılaştırma serisini bul ve güncelle
        const seriesKey = `${il}/${ges}/${arac}-${variableName}`;
        const comparisonSeries = findLineSeriesByName(chartRef.current, seriesKey);
        
        if (comparisonSeries) {
          const existingData = comparisonSeries.data.values as ChartDataPoint[];
          const combinedData = [...lineData, ...existingData];
          comparisonSeries.data.setAll(combinedData);
        }
      }
    } catch (error) {
      console.error(`❌ Comparison historical data error for ${il}/${ges}/${arac}/${variableName}:`, error);
      throw error; // Hatayı yukarı fırlat
    }
  };


  // DateAxis için event listener
  useEffect(() => {
    if (!dateAxisRef.current) {
      console.log("dateAxisRef.current yok");
      return;
    }
    const handleStart = async (start: number | undefined) => {
      if (start === undefined || !hasZoomedInitially || isLoading.current) {
        return;
      }
      const now = Date.now();
     
      const chart = chartRef.current;
      if (!chart) return;
      const intervalMs = 3*60*60*1000
      // 🟠 Ana mum grafik varsa kontrol et
      
      const valueSeries = chart.get("stockSeries");
      const dateMin = dateAxisRef.current?.getPrivate("selectionMin");
      const dateMax = dateAxisRef.current?.getPrivate("selectionMax");
      if (!dateMin) return;

      const allTimeStamps: number[] = []
      if (valueSeries && valueSeries.data.values && valueSeries.data.values.length > 0) {
        const firstDataPoint = valueSeries.data.values[0] as any;
        if (firstDataPoint && firstDataPoint.timestamp) {
          allTimeStamps.push(firstDataPoint.timestamp)
        }
      }

      chartRef.current?.panels.getIndex(0)?.series.each((series: any) => {
        if (series instanceof am5xy.LineSeries) {
          const firstDataPoint = series.data.values[0] as any;
          if (firstDataPoint && firstDataPoint.timestamp) {
            allTimeStamps.push(firstDataPoint.timestamp)
          }
        }
      })


      const minTimestamp = Math.min(...allTimeStamps)
      // Tüm yükleme işlemlerini topla
      const allLoads: Promise<any>[] = [];
      // Ana mum serisi için kontrol
      if (valueSeries) {
        const seriesData = valueSeries.data.values as ChartDataPoint[];
        if (seriesData.length > 0) {
          const oldestTimestamp = seriesData[0].timestamp;
          if (dateMin - oldestTimestamp < 5*60*60*1000) {
            const from = new Date(oldestTimestamp - intervalMs);       
            const to = new Date(oldestTimestamp);
            allLoads.push(loadHistoricalCandlestickData(from, to ));
            isLoading.current = true;
          }
        }
      }
      
      // Karşılaştırma serileri için kontrol
      for (const key of Object.keys(comparisonSelections)) {
        const [il, ges, arac] = key.split('/');
        const variables = comparisonSelections[key];

        for (const variableName of variables) {
          const seriesKey = `${il}/${ges}/${arac}-${variableName}`;
          const comparisonSeries = findLineSeriesByName(chartRef.current, seriesKey);
          
          if (comparisonSeries) {
            const seriesData = comparisonSeries.data.values as ChartDataPoint[];
            if (seriesData && seriesData.length > 0) {
              const oldestTimestamp = seriesData[0].timestamp;

              if (dateMin - oldestTimestamp < 5*60*60*1000) {
                const fromCom = new Date(oldestTimestamp - intervalMs);       
                const toCom = new Date(oldestTimestamp);
                allLoads.push(loadHistoricalComparisonData(il, ges, arac, variableName, fromCom, toCom));
                isLoading.current = true;
              }
            }
          }
        }
      }
      
      // Tüm yükleme işlemlerini paralel olarak çalıştır
      if (allLoads.length > 0) {
        try {
          await Promise.allSettled(allLoads).then((results) => {
            const succeeded = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            isLoading.current = false;
          });
    
        } catch (error) {
          console.error("❌ Geçmiş veri yükleme hatası:", error);
        }
      }
    };
  
    dateAxisRef.current.on("start", handleStart);
    return () => {
      if (dateAxisRef.current) {
        dateAxisRef.current.off("start", handleStart);
      }
    }; 
  }, [hasZoomedInitially, comparisonSelections]);
  
  const addComparisonLine = async (key: string, variableName: string) => {
    if (!rootRef.current || !chartRef.current || !dateAxisRef.current || !valueAxisRef.current) {
      return { success: false, message: 'Grafik referansları hazır değil' };
    }
  
    const chart = chartRef.current;
    const mainPanel = chart.panels.getIndex(0);
    if (!mainPanel) return { success: false, message: 'Ana panel bulunamadı' };
  
    const [il, ges, arac] = key.split('/');
    const dbName = `${il}_${ges}`;
    const variableConfig = dropdownData?.[il]?.[ges]?.[arac]?.find(v => v.name === variableName);
    if (!variableConfig) {
      return { success: false, message: `Değişken konfigürasyonu bulunamadı: ${variableName}` };
    }
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 10 * 60 * 60 * 1000); // son 10 saat
    // Türkiye saati için özel format
    const startTimeStr = startTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
    const endTimeStr = endTime.toLocaleString('sv-SE', { timeZone: 'Europe/Istanbul' }).replace(' ', 'T');
    
    const rawRecords = await window.electronAPI.getTablesHistory(dbName, arac, undefined, startTimeStr, endTimeStr);
    if (rawRecords.length === 0){
      return { success: false, message: `${dbName}/${arac} için son 10 saatte veri bulunamadı` };
    }
    
    const rawData: ChartDataPoint[] = rawRecords.map(record => ({
      timestamp: new Date(record.timestamp).getTime(),
      value: variableName === "p" ? Math.abs(Number(record[variableName])) : Number(record[variableName]) // p değişkeni için pozitife çevir
    })).filter(d => !isNaN(d.value));

    const lineData = await window.electronAPI.getChartData({
      data: rawData,
      timeUnit: timeIntervalRef.current.timeUnit,
      count: timeIntervalRef.current.count,
      chartType: 'line'
    }) as ChartDataPoint[];

    // Renk seçimi - mevcut karşılaştırma serilerinin sayısına göre
    const currentComparisonCount = getLineSeriesCount(chartRef.current);
    const colorIndex = currentComparisonCount % COMPARISON_COLORS.length;
    const selectedColor = COMPARISON_COLORS[colorIndex];
    
    // Renk state'ini güncelle
    const seriesKey = `${key}-${variableName}`;
    // Renk state'ini senkron olarak güncelle
    setComparisonColors(prev => {
      const updated = { ...prev, [seriesKey]: selectedColor };
      return updated;
    });
    
    // State güncellemesinin tamamlanmasını bekle
    await new Promise(resolve => setTimeout(resolve, 0));
  
    let series: am5xy.LineSeries;
    try {
      series = am5xy.LineSeries.new(rootRef.current, {
        name: `${key}-${variableName}`,
        valueXField: "timestamp",
        valueYField: "value",
        xAxis: dateAxisRef.current,
        yAxis: valueAxisRef.current,
        stroke: am5.color(selectedColor),
        tooltip: am5.Tooltip.new(rootRef.current, {
          labelText: `{name}\n[bold]{valueY}[/]`,
          pointerOrientation: "right",
          getFillFromSprite: false,
          background: am5.RoundedRectangle.new(rootRef.current, {
            fill: am5.color(selectedColor),
            stroke: am5.color(selectedColor),
          }),
          autoTextColor:true
        })
      });

      // Çizgi kalınlığı ve şeffaflığını ayarla
      series.strokes.template.setAll({
        strokeWidth: 2,
        strokeOpacity: 0.8
      });
    
      // Önce seriyi panele ekle
      mainPanel.series.push(series);
      
      // Sonra veriyi set et
      series.data.setAll(lineData);
    } catch (error) {
      console.error(`❌ LineSeries oluşturma hatası (${key}-${variableName}):`, error);
      return { success: false, message: `LineSeries oluşturulamadı: ${error}` };
    }

    // Karşılaştırma serisi eklendiğinde hasZoomedInitially'i true yap
    if (!hasZoomedInitially && lineData.length > 0) {
      // Veri yükleme işlemi tamamlandıktan sonra zoom yap
      series.events.once("datavalidated", function () {
        if (dateAxisRef.current) {
          const axis = dateAxisRef.current;
          const startIndex = Math.max(0, lineData.length - 180);
          const start = lineData[startIndex]?.timestamp;
          const end = lineData[lineData.length - 1]?.timestamp;
      
          if (start && end) {
            // Önce eski aralığı al
            const beforeMin = axis.getPrivate("selectionMin");
            const beforeMax = axis.getPrivate("selectionMax");
          
            axis.zoomToDates(new Date(start), new Date(end));
          
            // Zoom işleminin tamamlanmasını bekle
            setTimeout(() => {
              const afterMin = axis.getPrivate("selectionMin");
              const afterMax = axis.getPrivate("selectionMax");
          
              if (afterMin !== beforeMin || afterMax !== beforeMax) {
                setHasZoomedInitially(true);
              } else {
                console.log("⚠️ Comparison line zoom değeri değişmedi, setHasZoomedInitially yapılmadı");
              }
            }, 2000);
          }
        }
      });
    }
  
    // MQTT aboneliği
    const mqttIl = il.charAt(0).toUpperCase() + il.slice(1);
    const mqttGes = ges.charAt(0).toUpperCase() + ges.slice(1);
    const cihazGrubu = getCihazGrubu(arac);
    if (!cihazGrubu) return { success: false, message: `Cihaz grubu belirlenemedi: ${arac}` };
  
    const topic = `${mqttIl}/${mqttGes}/${cihazGrubu}/${arac}`;
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
      const seriesKey = `${key}-${variableName}`;
      comparisonUnsubscribeRefs.current.set(seriesKey, unsubscribe);
    }

    return { success: true, message: `${key}/${variableName} karşılaştırma çizgisi başarıyla eklendi (${lineData.length} veri noktası)` };
  };
  // Karşılaştırma serilerini yönetmek için useEffect
  useEffect(() => {
    // Önceki ve mevcut seçimleri karşılaştır
    const prevKeys = Object.keys(prevComparisonSelections.current);
    const currentKeys = Object.keys(comparisonSelections);

    // Kaldırılan serileri temizle - sadece tamamen kaldırılan key'ler için
    const removedKeys = prevKeys.filter(key => !currentKeys.includes(key));
    removedKeys.forEach(key => {
      const seriesToRemove = findLineSeriesByPrefix(chartRef.current, key);
      seriesToRemove.forEach(series => {
        const seriesName = series.get("name") as string;
        series.dispose();
      });       
      
      // MQTT aboneliklerini kaldır - Map yapısını kullan
      const variables = prevComparisonSelections.current[key] || [];
      variables.forEach(variableName => {
        const seriesKey = `${key}-${variableName}`;
        const unsubscribeFn = comparisonUnsubscribeRefs.current.get(seriesKey);
        if (unsubscribeFn) {
          unsubscribeFn();
          comparisonUnsubscribeRefs.current.delete(seriesKey);
        }
      });
    });

    // **YENİ EKLENEN** serileri işle
    const addedKeys = currentKeys.filter(key => !prevKeys.includes(key));
    if (addedKeys.length > 0) {
      setIsLoadingComparison(true);
      
      const processAddedKeys = async () => {
        for (const key of addedKeys) {
          const variables = comparisonSelections[key];
          for (const variableName of variables) {
            try {
              const result = await addComparisonLine(key, variableName);
              if (result.success) {
                // Başarılı durumda kullanıcıya bildirim göster
                showNotification(result.message, 'success');
              } else {
                console.warn(`❌ ${result.message}`);
                // Başarısız durumda kullanıcıya uyarı göster
                showNotification(result.message, 'error');
                
                // Başarısız olan seriyi comparisonSelections'dan kaldır
                setComparisonSelections(prev => {
                  const updated = { ...prev };
                  if (updated[key] && Array.isArray(updated[key])) {
                    updated[key] = updated[key].filter(v => v !== variableName);
                    if (updated[key].length === 0) {
                      delete updated[key];
                    }
                  }
                  return updated;
                });
              }
            } catch (error) {
              console.error(`❌ Karşılaştırma serisi eklenirken hata:`, error);
              showNotification(`${key}/${variableName} eklenirken beklenmeyen hata oluştu`, 'error');
              
              // Hata durumunda da seriyi kaldır
              setComparisonSelections(prev => {
                const updated = { ...prev };
                if (updated[key] && Array.isArray(updated[key])) {
                  updated[key] = updated[key].filter(v => v !== variableName);
                  if (updated[key].length === 0) {
                    delete updated[key];
                  }
                }
                return updated;
              });
            }
          }
        }
        
        // Tüm seriler eklendikten sonra loading state'ini false yap
        setIsLoadingComparison(false);
      };
      
      processAddedKeys();
    } else {
      // Eklenecek seri yoksa loading state'ini false yap
      setIsLoadingComparison(false);
    }
    
    // Referansı güncelle
    prevComparisonSelections.current = { ...comparisonSelections };
    
  }, [comparisonSelections]);

    // Component unmount olduğunda tüm MQTT aboneliklerini temizle
  useEffect(() => {
      return () => {   
        // Tüm unsubscribe fonksiyonlarını çağır
        comparisonUnsubscribeRefs.current.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
        comparisonUnsubscribeRefs.current = new Map();
  
        // Tüm karşılaştırma serilerini temizle
        disposeAllLineSeries(chartRef.current);
        // Pending request'leri temizle
        pendingRequestsRef.current.clear();
      };
    }, []);
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

        // Verileri güncelle
        valueSeries.data.setAll(chartData);

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

    /* return () => {
      // Cleanup function if needed
    }; */
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

    }
  }, [timeIntervalRef.current]);

  const handleMainSeriesSelect = (il: string, ges: string, arac: string, variable: string) => {
    setSelectedIl(il);
    setSelectedGes(ges);
    setSelectedArac(arac);
    setSelectedVariable(variable);
  };

  const handleComparisonSeriesSelect = (il: string, ges: string, arac: string, variables: string[]) => {
    setSelectedComparisonIl(il);
    setSelectedComparisonGes(ges);
    setSelectedComparisonArac(arac);
    const key = `${il}/${ges}/${arac}`;
    setComparisonSelections(prev => {
      const updated = { ...prev };
      if (variables && Array.isArray(variables) && variables.length > 0) {
        updated[key] = variables;
      } else {
        delete updated[key];
      }
      return updated;
    });
  };

  // Karşılaştırma çizgisinin rengini değiştir
  const changeComparisonLineColor = useCallback((seriesName: string, newColor: string) => {
    console.log(`🎨 Renk değiştiriliyor: ${seriesName} -> ${newColor}`);
    const series = findLineSeriesByName(chartRef.current, seriesName);
    if (series) {
      series.set("stroke", am5.color(newColor));
      series.get("tooltip")?.get("background")?.set("fill", am5.color(newColor));
      series.get("tooltip")?.get("background")?.set("stroke", am5.color(newColor));
      // Renk state'ini güncelle
      setComparisonColors(prev => {
        const updated = { ...prev, [seriesName]: newColor };
        console.log(`🔄 comparisonColors güncellendi:`, updated);
        return updated;
      });
    }
  }, []);

  // Karşılaştırma çizgisinin stilini değiştir (kesikli, düz, noktalı)
  const changeComparisonLineStyle = useCallback((seriesName: string, style: 'solid' | 'dashed' | 'dotted') => {
    const series = findLineSeriesByName(chartRef.current, seriesName);
    if (series) {
      const dashArray = style === 'dashed' ? [5, 5] : style === 'dotted' ? [2, 2] : undefined;
      series.strokes.template.set("strokeDasharray", dashArray);
      
    }
  }, []);

  // Karşılaştırma çizgisinin kalınlığını değiştir
  const changeComparisonLineWidth = useCallback((seriesName: string, width: number) => {
    const series = findLineSeriesByName(chartRef.current, seriesName);
    if (series) {
      series.strokes.template.set("strokeWidth", width);
      
    }
  }, []);

  // Karşılaştırma çizgisini kaldır
  const removeComparisonLine = useCallback(async (seriesName: string) => {
    console.log(`🗑️ removeComparisonLine çağrıldı: ${seriesName}`);
    
    // comparisonSelections state'ini güncelle - daha güvenli split
    const lastDashIndex = seriesName.lastIndexOf('-');
    if (lastDashIndex > 0 && lastDashIndex < seriesName.length - 1) {
      const key = seriesName.substring(0, lastDashIndex);
      const variableName = seriesName.substring(lastDashIndex + 1);
      
      console.log(`🔍 Parsed: key="${key}", variable="${variableName}"`);
      
      setComparisonSelections(prev => {
        console.log(`📊 Önceki comparisonSelections:`, prev);
        const updated = { ...prev };
        if (updated[key] && Array.isArray(updated[key])) {
          const beforeLength = updated[key].length;
          updated[key] = updated[key].filter(v => v !== variableName);
          const afterLength = updated[key].length;
          
          console.log(`🔄 ${key} serisinden ${variableName} kaldırıldı. Önceki: ${beforeLength}, Sonraki: ${afterLength}, Kalan: [${updated[key].join(', ')}]`);
          
          if (updated[key].length === 0) {
            delete updated[key];
            console.log(`🗑️ ${key} tamamen kaldırıldı (son variable'ı)`);
          }
        } else {
          console.warn(`⚠️ ${key} bulunamadı veya array değil:`, updated[key]);
        }
        console.log(`📊 Yeni comparisonSelections:`, updated);
        return updated;
      });
      
      // State güncellemesinin tamamlanmasını bekle
      await new Promise(resolve => setTimeout(resolve, 0));
    } else {
      console.error(`❌ Seri adı parse edilemedi: ${seriesName}. lastDashIndex: ${lastDashIndex}`);
    }
    
    // Seriyi grafikten kaldır - SADECE tam olarak eşleşen seri
    const series = findLineSeriesByName(chartRef.current, seriesName);
    if (series) {
      console.log(`✅ Seri bulundu ve dispose ediliyor: ${seriesName}`);
      series.dispose();
      console.log(`✅ Seri grafikten kaldırıldı: ${seriesName}`);
    } else {
      console.warn(`⚠️ Grafik'te seri bulunamadı: ${seriesName}`);
      // Fallback: prefix ile arama yap ama sadece tam eşleşenleri kaldır
      const allSeries = getAllLineSeries(chartRef.current);
      const matchingSeries = allSeries.filter(s => s.get("name") === seriesName);
      if (matchingSeries.length > 0) {
        console.log(`🔄 Fallback: ${matchingSeries.length} seri bulundu, dispose ediliyor`);
        matchingSeries.forEach(s => s.dispose());
      }
    }
    
    // MQTT unsubscribe işlemini yap
    const unsubscribeFn = comparisonUnsubscribeRefs.current.get(seriesName);
    if (unsubscribeFn) {
      unsubscribeFn();
      comparisonUnsubscribeRefs.current.delete(seriesName);
      console.log(`📡 MQTT unsubscribe completed: ${seriesName}`);
    } else {
      console.warn(`⚠️ MQTT unsubscribe fonksiyonu bulunamadı: ${seriesName}`);
    }
    
    // Renk state'inden de kaldır
    setComparisonColors(prev => {
      const updated = { ...prev };
      delete updated[seriesName];
      console.log(`🎨 Renk state'inden kaldırıldı: ${seriesName}`);
      return updated;
    });
  }, []);

  // Tüm karşılaştırma serilerini kaldır
  const removeAllComparisonLines = useCallback(() => {
    // Tüm MQTT aboneliklerini kapat
    comparisonUnsubscribeRefs.current.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    comparisonUnsubscribeRefs.current.clear();
    
    // Tüm karşılaştırma serilerini grafikten kaldır
    disposeAllLineSeries(chartRef.current);
    
    // State'leri temizle
    setComparisonSelections({});
    setComparisonColors({});
    
    // Kullanıcıya bildirim göster
    showNotification('Tüm karşılaştırma serileri kaldırıldı', 'info');
  }, [showNotification]);

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

  // Karşılaştırma çizgi ayarları listesini oluştur
  const comparisonLineSettings = useMemo(() => {
    // Line ekleme işlemi devam ediyorsa boş liste döndür
    if (isLoadingComparison) {
      console.log(`⏳ Loading devam ediyor, boş liste döndürülüyor`);
      return [];
    }
    
    const allLineSeries = getAllLineSeries(chartRef.current);
    console.log(`📈 Bulunan LineSeries sayısı:`, allLineSeries.length);
    console.log(`🎨 Mevcut comparisonColors:`, comparisonColors);
    
    // Sadece comparisonColors state'inde renk olan serileri göster
    const validSeries = allLineSeries.filter(series => {
      if (!series || series.isDisposed()) return false;
      const seriesName = series.get("name") as string;
      return seriesName && comparisonColors[seriesName];
    });
    
    console.log(`✅ Geçerli seri sayısı:`, validSeries.length);
    
    return validSeries
      .map((series, index) => {
        const seriesName = series.get("name") as string;
        const currentColor = comparisonColors[seriesName];
        
        console.log(`🔍 Seri ${index}: ${seriesName}, Renk: ${currentColor}`);
        if (!seriesName || !currentColor) {
          console.log(`❌ Seri ${seriesName} için renk bulunamadı, atlanıyor`);
          return null;
        }
        return (
          <div key={seriesName} className="comparison-line-item">
            <label title={seriesName}>{seriesName}</label>
            <input
              type="color"
              className="color-picker"
              value={currentColor}
              onChange={(e) => changeComparisonLineColor(seriesName, e.target.value)}
              title="Renk seç"
            />
              <>
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
              </>
          
            <button
              className="remove-series-btn"
              onClick={async () => await removeComparisonLine(seriesName)}
              title="Seriyi kaldır"
            >
              ×
            </button>
          </div>
        );
      });
    }, [isLoadingComparison, comparisonColors, changeComparisonLineColor, changeComparisonLineStyle, changeComparisonLineWidth, removeComparisonLine]);

    return (
    <div className={`overview-container ${!visible ? 'hidden' : ''}`}>
      {/* Bildirimler */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification notification-${notification.type}`}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="notification-content">
              <span className="notification-icon">
                {notification.type === 'success' && '✅'}
                {notification.type === 'error' && '❌'}
                {notification.type === 'warning' && '⚠️'}
                {notification.type === 'info' && 'ℹ️'}
              </span>
              <span className="notification-message">{notification.message}</span>
              <button 
                className="notification-close"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-controls">
        <div className="control-group">
          <img 
            src={candlestickIcon} 
            alt="Candlestick Chart" 
            style={{ 
              width: '24px', 
              height: '24px', 
              marginRight: '8px',
              filter: 'brightness(0.7)'
            }} 
          />
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
          <img 
            src={imageIcon} 
            alt="Image" 
            style={{ 
              width: '24px', 
              height: '24px', 
              marginRight: '8px',
              filter: 'brightness(0.7)'
            }} 
          />
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
        {getLineSeriesCount(chartRef.current) > 0 && showSettings && (
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
            <button
              className="remove-all-series-btn"
              onClick={removeAllComparisonLines}
              title="Tüm Karşılaştırma Serilerini Kaldır"
            >
              🗑️ Tümünü Kaldır
            </button>
            {isLoadingComparison ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <span>Çizgiler ekleniyor...</span>
              </div>
            ) : (
              comparisonLineSettings
            )}
          </div>
        )}
        
        {/* Ayarları tekrar açma butonu */}
        {getLineSeriesCount(chartRef.current) > 0 && !showSettings && (
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
  }
export default Overview;


