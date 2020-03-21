/**
 * Leena Chart
 * Расширение Qlik Sense для линейного графика
 */
define(
	// Список зависимостей
	[
		// Qlik API
		"qlik"
	],

	/**
	 * Создаёт модуль расширения
	 * @param {*} qlik Qlik API
	 */
	function (qlik) {
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

				$element.html( "Линейный график Leena Chart" );

				return qlik.Promise.resolve();
			}

		};

		return extensionModule;
	}
);

