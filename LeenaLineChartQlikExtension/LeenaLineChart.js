/**
 * Leena Chart
 * Отрисовщик линейного графика
 */
define(
	// Список зависимостей
    [ 
		// D3		
        './d3.v3.min'
    ],
    
	/**
	 * Создаёт модуль
	 * @param {D3Api} d3 D3 API
     * @returns {LineChartPainter} Отрисовщик линейного графика
	 */
	function (d3) {

        /** @type {LineChartPainter} */
        var lineChartPainter = {
            paint: paintLineChart
        };

        return lineChartPainter;

        /**
         * Отрисовывает интерфейс графика
         * @param {*} parentElement Родительский DOM-узел
         * @param {LineChart} chart Данные линейного графика
         */
        function paintLineChart(parentNode, chart) {
                
            // SVG
            var svg = d3.select(parentNode);
            
            // Отступы от границ до области построения
            var horizontalPaddingValue = 5;
            var verticalPaddingValue = 10;
            var padding = {
                left: horizontalPaddingValue + 20,	// Отступ слева для подписей оси значений
                top: verticalPaddingValue,
                right: horizontalPaddingValue, 
                bottom: verticalPaddingValue + 70   // Отступ снизу для подписи оси аргументов
            };

            // Размеры области построения
            var size = {
                width: svg.attr('width') - padding.left - padding.right,
                height: svg.attr('height') - padding.top - padding.bottom
            };

            // Область построения
            var plotArea = createIfNotExists(svg, null, 'g', 'plotArea')
                .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

            // Шкалы

            // Шкала аргументов
            var argumentXScale = d3.scale.ordinal()
                .domain(chart.arguments)
                .rangeBands([0, size.width]);

            // Шкала значений
            var valueYScale = d3.scale.linear()
                .domain([getChartMinValue(chart), getChartMaxValue(chart)])
                .range([size.height, 0])
                .nice();

            // Шкала цветов
            // TODO: Реализовать автоподбор цветов для линий
            var lineColorScale = d3.scale.ordinal()
                .domain(chart.lines.map(function (l) { return l.title; }))
                .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']);

            // График
            
            // Линия графика
            createLine(plotArea, chart, argumentXScale, valueYScale, lineColorScale);
            
			// Оси
			
			// Ось аргументов
			createXAxis(plotArea, argumentXScale, valueYScale);
        }

        /**
		 * Возвращает минимальное значение графика
		 * @param {LineChart} chart График
		 * @return {Number} Минимальное значение
		 */
		function getChartMinValue(chart) {
			var getPointValue = function (point) { return point.value; };
			var getLineMinValue = function(line) {
				return Math.min.apply(null, line.points.map(getPointValue));
			};
			return Math.min.apply(null, chart.lines.map(getLineMinValue));
		}
		
		/**
		 * Возвращает максимальное значение графика
		 * @param {LineChart} chart График
		 * @return {Number} Максимальное значение
		 */
		function getChartMaxValue(chart) {
			var getPointValue = function (point) { return point.value; };
			var getLineMinValue = function(line) {
				return Math.max.apply(null, line.points.map(getPointValue));
			};
			return Math.max.apply(null, chart.lines.map(getLineMinValue));
        }
        
        /**
		 * Добавляет линию графика
		 * @param {*} parentElement D3-объект родительского элемента
		 * @param {LineChart} chart Данные графика
		 * @param {*} argumentXScale Шкала аругментов
		 * @param {*} valueYScale Шкала значений
         * @returns {*} D3-объект для линии
		 */
		function createLine(parentElement, chart, argumentXScale, valueYScale, colorScale) {
			
			// Генератор пути для линии
			var lineGenerator = d3.svg.line()
				.x(function(point) { return argumentXScale(point.argument) + argumentXScale.rangeBand()/2; })
				.y(function(point) { return valueYScale(point.value); });

			// Линии
            var linePath = parentElement.selectAll('path.line')
				.data(chart.lines, function (line) { return line.title; });

			// Новые линии
			linePath.enter()
				// Добавление пути
				.append('path')
				.attr('class', 'line');

			// Изменённые линии
			linePath
				// Установка пути
				.attr('d', function(line) { return lineGenerator(line.points); })
				// Цвет линии
				.style({
                    stroke: function(line) { return colorScale(line.title); },
                    fill: 'none'
                });
			
			// Старые линии
			linePath.exit()
				// Удаление пути
                .remove();
                
            return linePath;
        }
        
        /**
		 * Добавляет ось аргументов графика
		 * @param {*} parentElement D3-объект родительского элемента
		 * @param {*} argumentXScale Шкала аругментов
		 * @param {*} valueYScale Шкала значений
         * @returns {*} D3-объект для оси
		 */
		function createXAxis(parentElement, argumentXScale, valueYScale) {

			// Длина засечки на оси
			var axisNickLength = 6;

			// Ось
			var xAxis = d3.svg.axis()
				.scale(argumentXScale)
				.orient('bottom')
				.tickSize(axisNickLength);

			// Группа для оси
			var axisGroup = parentElement.selectAll('g.axis.x')
				.data([null]);

			// Новая группа
		    axisGroup.enter()
				// Добавление
				.append('g')
				.attr('class', 'axis x');

			// Изменённая группа
			axisGroup
				// Размещение в нуле вертикальной оси
				.attr('transform', 'translate(' + 0 + ',' + valueYScale(0) + ')')
				// Изменение оси
				.call(xAxis);

			// Настройка подписей
			axisGroup.selectAll('text')
				// Размещение
				.attr({
					// Размещение под засечкой
					x: axisNickLength + 2,
					dx: 0,
					// Центрирование по высоте шрифта
					y: '0.4em',
					dy: 0,
					// Вертикальное расположение текста        
					transform: 'rotate(90)' 
                })
				.style({
                    'text-anchor': 'start',
                    'fill': 'rgb(120, 120, 120)'
                });

            // Настройка засечек
            axisGroup.selectAll('line')
                .style({
                    'stroke': 'rgb(120, 120, 120)', 
                    'stroke-width': '1',
                    'fill': 'none', 
                    'shape-rendering': 'optimizeSpeed'
                });
            
            // Настройка линии оси
            axisGroup.selectAll('path')
                .style({
                    'stroke': 'rgb(120, 120, 120)', 
                    'stroke-width': '1',
                    'fill': 'none', 
                    'shape-rendering': 'optimizeSpeed'
                });

			// Старая группа
			axisGroup.exit()
				// Удаление
                .remove();
            
            return axisGroup;
		}

        /**
         * Ищет или создаёт элемент с тегом, идентификатором и классами
         * @param {*} parent D3-объет для родительского элемента
         * @param {*} data Привязываемые данные; null, если данных нет
         * @param {*} tag Искомый тэг
         * @param {String=} id Назначаемый идентификатор
         * @param {String[]=} classes Набор назначаемых классов
         * @returns {*} D3-объект для найденного или созданного элемента
         */
        function createIfNotExists(parent, data, tag, id, classes, createHandler, updateHandler) {

            var hasId = id !== undefined && id !== null && id !== '';
            var hasClasses = classes !== undefined && classes !== null && classes.length > 0;

            var selector = tag +
                (hasId ? '#' + id : '') +
                (hasClasses ? '.' + classes.join('.') : '');

            var element = parent.selectAll(selector)
                .data(data !== null ? data : [ null ]);
            
            var newElement = element
                .enter()
                .append(tag);

            if (hasId) {
                newElement
                    .attr('id', id);
            }
            if (hasClasses) {
                newElement
                    .attr('class', classes.join(' '));
            }

            if (createHandler != null) {
                createHandler(newElement);
            }

            if (updateHandler != null) {
                updateHandler(element);
            }

            return element;
        }
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

/**
 * JSDoc-определения для геометрии
 */

 /**
 * Точка
 * @typedef {Object} Point
 * @property {Number} x Горизонтальная координата
 * @property {Number} y Вертикальная координата
 */