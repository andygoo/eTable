/**
 * @author leeyee
 * @date 2012/10/07
 *
 */
(function() {

	if (console && !console.time) {
		console._times = {};
		console.time = function(name) {
			console._times[name] = new Date();
		};
		console.timeEnd = function(name) {
			var time = new Date() - console._times[name];
			console.info(name + ": " + time + 'ms');
		};
	}

	/**
	 * Convert Number to English ordinal
	 *
	 * @param num
	 *            {Number}
	 *
	 * @return {String} English orinal
	 *
	 */
	function ordinal(num) {
		var singleDigits = num % Math.pow(10, num.toString.length);
		var eSuffix = {
			1 : 'st',
			2 : 'nd',
			3 : 'rd'
		};
		return singleDigits in eSuffix ? num + eSuffix[singleDigits] : num + "th";
	}

	var ETable = function(table) {

		/**
		 * jQuery table element
		 */
		this.table = table;

		/**
		 * Get the number of rows
		 */
		this.getRow = function() {
			return this.table.find("tr").length;
		};

		/**
		 * Private Method Insert Row.
		 *
		 * @param rowIndex
		 *            {Number}
		 * @param tds
		 *            {Array}
		 */
		this.__insertRow = function(rowIndex, tds) {
			var rows = this.getRow();

			if (rowIndex > rows) {
				alert("The " + ordinal(rowIndex) + " row can not be inserted, because the table is only " + rows + " rows");
				return false;
			}
			console.info('rows: ' + this.getRow() + ' rowIndex: ' + rowIndex);
			var tr = this.table[0].insertRow(rowIndex);

			$.each(tds, function(idx, td) {
				if ( td instanceof jQuery) {
					$(tr.insertCell(idx)).append(td);
				} else {
					tr.insertCell(idx).innerHTML = td;
				}
			});
		};

		/**
		 * Pirvate Method Delete Row
		 *
		 * @param rowIndex
		 *            {Number}
		 *
		 */
		this.__deleteRow = function(rowIndex) {
			if (rowIndex === -1 || this.getRow() <= rowIndex) {
				alert("Delete rows does not exist");
				return;
			}
			this.table[0].deleteRow(rowIndex);
			console.info('rows: ' + this.getRow() + ' rowIndex: ' + rowIndex);
		};

		/**
		 * Append a new row
		 *
		 * @param tds
		 *            {Array}
		 *
		 */
		this.appendRow = function(tds) {
			this.__insertRow(this.getRow(), tds);
		};

		/**
		 * Insert into the 1st row
		 *
		 * @param tds
		 *            {Array}
		 */
		this.insertToFirstRow = function(tds) {
			this.__insertRow(0, tds);
		};
		/**
		 * Insert into the last row
		 *
		 * @param tds
		 *            {Array}
		 */
		this.insertToLastRow = this.appendRow;
		/**
		 * Inserted before the specified row
		 *
		 * @param rowIndex
		 *            {Number}
		 * @param tds
		 *            {Array}
		 */
		this.insertBeforeRow = function(rowIndex, tds) {
			this.__insertRow(rowIndex - 1, tds);
		};

		/**
		 * Inserted after the specified row
		 *
		 * @param rowIndex
		 *            {Number}
		 * @param tds
		 *            {Array}
		 */
		this.insertAfterRow = function(rowIndex, tds) {
			this.__insertRow(rowIndex, tds);
		};

		/**
		 * delete the 1st row
		 */
		this.deleteFirstRow = function() {
			this.__deleteRow(0);
		};

		/**
		 * delete the last row
		 */
		this.deleteLastRow = function() {
			this.__deleteRow(this.getRow() - 1);
		};

		/**
		 * delete the specified row
		 *
		 * @param rowIndex
		 *            {Number}
		 */
		this.deleteRow = function(rowIndex) {
			this.__deleteRow(rowIndex);
		};

		/**
		 * batch delete row
		 *
		 * @param rowIndexs
		 *            {Array}
		 */
		this.deleteRows = function(rowIndexs) {
			var row = rowIndexs.length;
			for (var r = row - 1; r > -1; r--) {
				this.__deleteRow(rowIndexs[r]);
			}
		};

		this.__insertCol = function(colIndex, tds) {
			console.info(this.table[0].rows);
			var rows = this.table[0].rows;
			$.each(rows, function(idx, row) {
				row.insertCell(colIndex).innerHTML = 'ABC';
			});
		};
		this.appendCol = function() {
			this.__insertCol(-1);
		}
	};

	$.fn.eTable = function() {

		var eTable = new ETable(this);

		return eTable;
	};

})(jQuery);
