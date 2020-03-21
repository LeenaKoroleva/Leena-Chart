/**
 * Leena Chart
 * Расширение Qlik Sense для линейного графика
 */
define(
	// Список зависимостей
	[
		// Qlik API
		"qlik",
		// jQuery API
		'jquery'
	],

	/**
	 * Создаёт модуль расширения
	 * @param {QlikApi} qlik Qlik API
	 * @param {*} $ jQuery API
	 */
	function (qlik, $) {

		// Определения свойств
		var propertyDefinitions = {
			type: 'items',
			component: 'accordion',
			items: {
				// Блок свойств Измерения
				dimensions: {
					uses: 'dimensions',
					min: 1,
					max: 1
				},
				// Блок свойств Меры
				measures: {
					uses: 'measures',
					min: 1,
					max: 10
				},
				// Блок свойств Сортировка
				sorting: {
					uses: 'sorting'
				},
				// Блок свойств Вид
				settings: {
					uses: 'settings'
				}
			}
		};

		// Модуль расширения Qlik Sense
		var extensionModule = {

			// Определения свойств
			definition: propertyDefinitions,

			// Настройки первичной загрузки данных
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 11,
						qHeight: 900
					}]
				}
			},

			// Настройки выгрузки
			support: {
				snapshot: true,
				export: true,
				exportData : false
			},

			/**
			 * Создаёт и обновляет интерфейс расширения
			 * @param {*} $element Родительский jQuery-элемент
			 * @param {QlikLayout} qlikLayout Данные расширения
			 * @returns {Promise} Promise завершения отрисовки
			 */
			paint: function ($element, qlikLayout) {
				try {
					// DEBUG:
					console.log('Данные Qlik: ', qlikLayout);

					$element.html( "Линейный график Leena Chart" );

					// Получение данных для графика
					var chart = getLineChartData(qlikLayout);

					// TODO: Отрисовка графика
					// DEBUG:
					console.log('Данные графика:', chart);

                }
                catch (error) {
                    console.log(error);
					throw error;
                }

				return qlik.Promise.resolve();
			}

		};

		return extensionModule;

		/**
		 * Возвращает данные для линейного графика
		 * @param {QlikLayout} qlikLayout Данные расширения Qlik
		 * @returns {LineChart} График
		 */
		function getLineChartData(qlikLayout) {
			
			// Строки данных Qlik
			var rows = qlikLayout.qHyperCube.qDataPages[0].qMatrix;
			// Столбцы данных Qlik
			var columns = qlikLayout.qHyperCube.qDimensionInfo
				.concat(qlikLayout.qHyperCube.qMeasureInfo);

			// Линии
			/** @type {LineChartLine[]} */
			var lines = [];
			for (var columnIndex = 1; columnIndex < columns.length; columnIndex++) {
				var line = getLineChartLine(rows, columns, 0, columnIndex);
				lines.push(line);
			}

			// Список аргументов
			var arguments = lines[0].points.map(
				function(point) {
					return point.argument;
				}
			);

			// График
			/** @type {LineChart} */
			var chart = {
				lines: lines,
				arguments: arguments
			};
			return chart;
		}

		/**
		 * Возвращает точку линейного графика для строки данных
		 * @param {NxCell[][]} rows Строки данных
		 * @param {(NxDimension|NxMeasure)[]} columns Столбцы данных
		 * @param {Number} argumentColumnIndex Индекс столбца аргумента
		 * @param {Number} valueColumnIndex Индекс столбца значения
		 * @returns {LineChartPoint} Точка графика
		 */
		function getLineChartLine(rows, columns, argumentColumnIndex, valueColumnIndex) {

			var linePoints = rows.map(
				function (row) {
					return getLineChartPoint(row, argumentColumnIndex, valueColumnIndex);
				}
			);

			/** @type {LineChartLine} */
			var line = {
				title: columns[valueColumnIndex].qFallbackTitle,
				points: linePoints
			};
			return line;
		}

		/**
		 * Возвращает точку линейного графика для строки данных
		 * @param {NxCell[]} row Данные строки
		 * @param {Number} argumentColumnIndex Индекс столбца аргумента
		 * @param {Number} valueColumnIndex Индекс столбца значения
		 * @returns {LineChartPoint} Точка графика
		 */
		function getLineChartPoint(row, argumentColumnIndex, valueColumnIndex) {
			console.log('Text:', row[valueColumnIndex].qText, 'Number:', row[valueColumnIndex].qNum, 'Cell: ', row[valueColumnIndex]);
			
			var value = null;
			if (!row[valueColumnIndex].qIsEmpty) {
				if (row[valueColumnIndex].qNum === 'number') {
					value = row[valueColumnIndex].qNum;
				}
			}

			/** @type {LineChartPoint} */ 
			var point = {
				argument: row[argumentColumnIndex].qText,
				value: value
			};
			return point;
		}
	}
);

/**
 * JSDoc-определения для линейного графика Leena Chart
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


 /**
 * Данные расширения Qlik
 * @typedef {Object} ExtensionCustomProperties
 * @property {String} ext - Заголовок расширения
 */

/**
 * Мера гиперкуба
 * @typedef {Object} ColumnCustomProperties
 * @property {String} col - Заголовок меры
*/