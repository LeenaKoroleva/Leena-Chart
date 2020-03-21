/**
 * Шаблон расширения Qlik Sense для диаграммы Leena Chart
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
	 * @param {*} qlik Qlik API
	 * @param {*} $ jQuery API
	 */
	function (qlik, $) {
		var extensionModule = {

			support: {
				snapshot: true,
				export: true,
				exportData : false
			},

			/**
			 * Создаёт и обновляет интерфейс расширения
			 * @param {*} $element Родительский jQuery-элемент
			 */
			paint: function ($element) {

				$element.html( "Шаблон для создания диаграмм Leena Chart" );

				return qlik.Promise.resolve();
			}

		};

		return extensionModule;
	}
);

