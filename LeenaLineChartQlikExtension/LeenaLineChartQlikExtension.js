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

				console.log(qlikLayout);

				$element.html( "Линейный график Leena Chart" );

				return qlik.Promise.resolve();
			}

		};

		return extensionModule;
	}
);

