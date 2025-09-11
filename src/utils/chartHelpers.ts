import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5stock from '@amcharts/amcharts5/stock';

/**
 * Chart'taki tüm LineSeries'leri bulur
 * @param chart - StockChart referansı
 * @returns LineSeries dizisi
 */
export const getAllLineSeries = (chart: am5stock.StockChart | null): am5xy.LineSeries[] => {
  const lineSeries: am5xy.LineSeries[] = [];
  
  if (!chart) return lineSeries;
  
  chart.panels.getIndex(0)?.series.each((series: any) => {
    if (series instanceof am5xy.LineSeries) {
      lineSeries.push(series);
    }
  });
  
  return lineSeries;
};

/**
 * Belirli bir isme sahip LineSeries'i bulur
 * @param chart - StockChart referansı
 * @param seriesName - Aranacak seri adı
 * @returns Bulunan LineSeries veya null
 */
export const findLineSeriesByName = (chart: am5stock.StockChart | null, seriesName: string): am5xy.LineSeries | null => {
  if (!chart) return null;
  
  let foundSeries: am5xy.LineSeries | null = null;
  
  chart.panels.getIndex(0)?.series.each((series: any) => {
    if (series instanceof am5xy.LineSeries && series.get("name") === seriesName) {
      foundSeries = series;
    }
  });
  
  return foundSeries;
};

/**
 * Belirli bir prefix ile başlayan LineSeries'leri bulur
 * @param chart - StockChart referansı
 * @param prefix - Aranacak prefix
 * @returns Bulunan LineSeries dizisi
 */
export const findLineSeriesByPrefix = (chart: am5stock.StockChart | null, prefix: string): am5xy.LineSeries[] => {
  const matchingSeries: am5xy.LineSeries[] = [];
  
  if (!chart) return matchingSeries;
  
  chart.panels.getIndex(0)?.series.each((series: any) => {
    if (series instanceof am5xy.LineSeries) {
      const seriesName = series.get("name");
      // Daha kesin prefix matching: prefix'ten sonra / veya - olmalı
      if (seriesName && (
        seriesName === prefix || 
        seriesName.startsWith(prefix + '/') || 
        seriesName.startsWith(prefix + '-')
      )) {
        matchingSeries.push(series);
      }
    }
  });
  
  return matchingSeries;
};

/**
 * Chart'taki LineSeries sayısını döndürür
 * @param chart - StockChart referansı
 * @returns LineSeries sayısı
 */
export const getLineSeriesCount = (chart: am5stock.StockChart | null): number => {
  let count = 0;
  
  if (!chart) return count;
  
  chart.panels.getIndex(0)?.series.each((series: any) => {
    if (series instanceof am5xy.LineSeries) {
      count++;
    }
  });
  //console.log("------------------------------- count", count);      ÖNEMLİİİ
  return count;
};

/**
 * Chart'taki tüm LineSeries'leri dispose eder
 * @param chart - StockChart referansı
 */
export const disposeAllLineSeries = (chart: am5stock.StockChart | null): void => {
  if (!chart) return;
  
  chart.panels.getIndex(0)?.series.each((series: any) => {
    if (series instanceof am5xy.LineSeries && !series.isDisposed()) {
      series.dispose();
    }
  });
}; 