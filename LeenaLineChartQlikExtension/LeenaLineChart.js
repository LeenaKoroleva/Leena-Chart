/**
 * Leena Chart
 * Отрисовщик линейного графика
 */
define(
	// Список зависимостей
    [ ],
    
	/**
	 * Создаёт модуль
	 */
	function () {
        return {
            
            /**
             * Отрисовывает интерфейс графика
             * @param {*} parentElement Родительский DOM-узел
             * @param {LineChart} lineChart Данные линейного графика
             */
            paint: function (parentNode, lineChart) {
            }

        };
    }
);

/**
 * JSDoc-определения для линейного графика Leena Chart
 */

 /**
  * Отрисовщик линейного графика
  * @typedef {Object} LineChartPainter
  * @property {function(*, LineChart): Number} paint Отрисовывает интерфейс графика
  * - arg0 - Родительский DOM-узел
  * - arg1 - Данные линейного графика
  */

 /**
 * Данные для построения линейного графика
 * @typedef {Object} LineChart
 * @property {LineChartLine[]} lines Линии графика
 * @property {String[]} arguments Аргументы
 */

/**
 * Линия линейного графика
 * @typedef {Object} LineChartLine
 * @property {String} title Заголовок линии
 * @property {LineChartPoint[]} points Точки линии
 */

/**
 * Точка линейного графика
 * @typedef {Object} LineChartPoint
 * @property {String} argument Категория 
 * @property {Number=} value Значение
 */