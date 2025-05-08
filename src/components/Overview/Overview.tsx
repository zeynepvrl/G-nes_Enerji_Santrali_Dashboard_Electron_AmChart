import React, { useEffect, useRef, useState, useMemo } from 'react';
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

// TypeScript için window.electronAPI global tanımı
// Eğer global.d.ts dosyan yoksa, bu dosyanın başına ekleyebilirsin
declare global {
  interface Window {
    electronAPI: {
      getDatabases: () => Promise<{ datname: string }[]>;
      getTables: (dbName: string) => Promise<string[]>;
      onMqttData: (callback: (data: string, topic?: string) => void) => void;
      getAllTables: () => Promise<{ [dbName: string]: string[] }>;
      subscribeMqtt: (topic: string) => void;
    };
  }
}

const Overview: React.FC = () => {
  const chartRef = useRef<am5stock.StockChart | null>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const [selectedIl, setSelectedIl] = useState('');
  const [selectedGes, setSelectedGes] = useState('');
  const [selectedArac, setSelectedArac] = useState('');
  const [aracVerisi, setAracVerisi] = useState<string | null>(null);
  const [selectedVariable, setSelectedVariable] = useState('');
  const [availableVariables, setAvailableVariables] = useState<DataField[]>([]);

  // Yeni: Veritabanı ve tablo isimleri için state
  const [ilList, setIlList] = useState<string[]>([]);
  const [gesList, setGesList] = useState<string[]>([]);
  const [aracList, setAracList] = useState<string[]>([]);
  const [allTables, setAllTables] = useState<{ [dbName: string]: string[] }>({});

  // Stringin ilk harfini büyüt
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

  // Tüm veritabanları ve tablo isimlerini başta çek
  useEffect(() => {
    if (!window.electronAPI?.getAllTables) return;
    window.electronAPI.getAllTables().then((all) => {
      console.log('Tüm veritabanı ve tablo isimleri:', all);
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
    } else {
      setGesList([]);
      setSelectedGes('');
      setAracList([]);
      setSelectedArac('');
    }
  }, [selectedIl, allTables]);

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
  }, [selectedIl, selectedGes, allTables]);

  // Seçim değişince veriyi sıfırla
  useEffect(() => {
    setAracVerisi(null);
  }, [selectedIl, selectedGes, selectedArac]);

  // Seçilen il, GES ve araç'a göre MQTT topic'ini dinle
  useEffect(() => {
    if (!selectedIl || !selectedGes || !selectedArac) return;

    const mqttIl = capitalize(selectedIl);
    const mqttGes = capitalize(selectedGes);
    const cihazGrubu = getCihazGrubu(selectedArac);
    if (!cihazGrubu) return;
    const topic = `${mqttIl}/${mqttGes}/${cihazGrubu}/${selectedArac}`;

    console.log('MQTT dinlenen topic:', topic);
    window.electronAPI.subscribeMqtt(topic);

    // Dinleyici fonksiyonu
    const handler = (data: string, incomingTopic?: string) => {
      if (incomingTopic && incomingTopic.toLowerCase() === topic.toLowerCase()) {
        setAracVerisi(data);
      }
    };

    // Dinleyiciyi ekle ve kaldırıcıyı al
    const unsubscribe = window.electronAPI.onMqttData(handler) as any;

    // Temizlik: component unmount veya seçim değişince dinleyiciyi kaldır
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();         //alt satırdakilerden birinde effevt olursa unsubscribe çalışacak
    };
  }, [selectedIl, selectedGes, selectedArac]);

  // Get device type from table name
  function getDeviceType(tablename: string) {
    if (!tablename) return '';
    const lower = tablename.toLowerCase();
    if (lower.startsWith('inv')) return 'inverter';
    if (lower.startsWith('analizor')) return 'analizor';
    if (lower.startsWith('rtu')) return 'rtu';
    return '';
  }

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
    const configCap = (deviceConfigs as DeviceConfigs)[capitalize(selectedIl)]?.[capitalize(selectedGes)]?.[deviceType as keyof DeviceTypeConfig];
    if (configCap) {
      setAvailableVariables(configCap as DataField[]);
    } else {
      setAvailableVariables([]);
    }
    setSelectedVariable('');
  }, [selectedIl, selectedGes, selectedArac]);

  // Parse MQTT data and get selected variable value
  const selectedValue = useMemo(() => {
    if (!aracVerisi || !selectedVariable) return null;
    try {
      const data = JSON.parse(aracVerisi);
      if (!Array.isArray(data)) return null;
      const variableConfig = Array.isArray(availableVariables)
        ? availableVariables.find(v => v.name === selectedVariable)
        : undefined;
      if (!variableConfig) return null;
      const variableIndex = variableConfig.index;
      if (variableIndex === undefined) return null;
      const value = data[variableIndex + 1];
      if (value === undefined) return null;
      // const multiplier = variableConfig.multiplier || 1;
      // return (value * multiplier).toFixed(2);
      return value;
    } catch (error) {
      console.error('Error parsing MQTT data:', error);
      return null;
    }
  }, [aracVerisi, selectedVariable, availableVariables]);

  useEffect(() => {
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

    myTheme.rule("Container").setAll({
      background: am5.Rectangle.new(root, {
        fill: am5.color("#1a1a1a"),
        fillOpacity: 0.95
      })
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
        panY: true
      })
    );

    // Create value axis
    const valueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: "zoom"
        }),
        extraMin: 0.1,
        tooltip: am5.Tooltip.new(root, {}),
        numberFormat: "#,###.00",
        extraTooltipPrecision: 2
      })
    );

    // Create date axis
    const dateAxis = mainPanel.xAxes.push(
      am5xy.GaplessDateAxis.new(root, {
        baseInterval: {
          timeUnit: "minute",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

       // Create series
       const valueSeries = mainPanel.series.push(
        am5xy.CandlestickSeries.new(root, {
          name: "GES-1",
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
          // Yükseliş için açık mavi, düşüş için koyu mor
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
      snapToSeriesBy: "y!"
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

    // Generate random data
    const data = generateData();
    valueSeries.data.setAll(data);
    volumeSeries.data.setAll(data);
    sbSeries.data.setAll(data);

    // Add initial comparison
    addComparingSeries("GES-2");

    // Add toolbar
    const container = document.getElementById("chartcontrols");
    if (container) {
      am5stock.StockToolbar.new(root, {
        container: container,
        stockChart: stockChart,
        controls: [
          mainSeriesControl,
          comparisonControl,
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
          })
        ]
      });
    }

    // Add CSS for toolbar
    const style = document.createElement('style');
    style.textContent = `
      .am5stock-control, .am5stock-control-button {
        color: #333333 !important;
        background-color: #f5f5f5 !important;
        border: 1px solid #e0e0e0 !important;
        border-radius: 4px !important;
        margin: 0 4px !important;
        padding: 6px 12px !important;
      }
      .am5stock-control:hover, .am5stock-control-button:hover {
        background-color: #e8e8e8 !important;
      }
      .am5stock-list-item {
        color: #333333 !important;
        background-color: #ffffff !important;
        padding: 8px 12px !important;
      }
      .am5stock-list-item:hover {
        background-color: #f5f5f5 !important;
      }
      #chartcontrols {
        height: auto;
        padding: 5px 5px 0 16px;
        max-width: 100%;
        background-color: #ffffff;
        border-bottom: 1px solid #e0e0e0;
      }
      .am5stock-control-group {
        margin: 0 !important;
        padding: 4px 0 !important;
      }
      .am5stock-list {
        background-color: #ffffff !important;
        border: 1px solid #e0e0e0 !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
      }
      .am5stock-list-info {
        color: #666666 !important;
      }
    `;
    document.head.appendChild(style);

    // Save references
    chartRef.current = stockChart;

    return () => {
      root.dispose();
    };
  }, []);

  console.log('Overview render');

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
          onChange={(e) => setSelectedVariable(e.target.value)}
          className="select-box"
          disabled={!selectedArac || !Array.isArray(availableVariables) || availableVariables.length === 0}
        >
          <option value="">Değişken Seçiniz</option>
          {Array.isArray(availableVariables) && availableVariables.map((config) => (
            <option key={config.name} value={config.name}>{config.name}</option>
          ))}
        </select>

        {selectedValue !== null && selectedVariable && (
          <div className="selected-value">
            Değer: {selectedValue}
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