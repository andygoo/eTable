/**
 * @author leeyee
 * @date 2012/10/07
 *
 */
(function() {

	if (console && !console.time) {
		if (!console.time) {
			console._times = {};
			console.time = function(name) {
				console._times[name] = new Date();
			};
			console.timeEnd = function(name) {
				var time = new Date() - console._times[name];
				console.info(name + ": " + time + 'ms');
			};
		}
		if (!console.error) {
			alert("no error");
			console.error = function(msg) {
				alert(msg);
			}
		}
		if (!console.warn) {
			console.warn = function(msg) {
				alert(msg);
			}
		}
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
			if (!$.isArray(tds) || tds.length === 0) {//参数tds为长度不为0的数组
				console.error("table cell data type should be an array and length of not less then 0!");
				return false;
			}
			if (rowIndex < -1) {//插入行位置不能小于-1
				console.error("The rowIndex (" + rowIndex + ") can not be less than -1 !");
				return false;
			}

			var rows = this.getRow();

			if (rowIndex > rows) {//插入行位置不能大于当前总行数
				console.error("The " + ordinal(rowIndex + 1) + " row can not be inserted, because the table is only " + rows + " rows");
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
		 * Private Method Insert Col.
		 *
		 * @param colIndex
		 *            {Number}
		 * @param tds
		 *            {Array}
		 */
		this.__insertCol = function(colIndex, tds) {
			if (!$.isArray(tds) || tds.length === 0) {//参数tds为长度不为0的数组
				console.error("table cell data type should be an array and length of not less then 0!");
				return false;
			}
			if (colIndex < -1) {//插入列位置不能小于-1
				console.error("The colIndex (" + colIndex + ") can not be less than -1 !");
				return false;
			}

			var self = this, rows = this.table[0].rows;

			$.each(tds, function(idx, td) {
				var row = rows[idx];
				if (!row) {
					row = $("<tr>")[0];
					self.table.append(row);
				}

				var cells = row.cells.length;

				if (colIndex > cells) {//插入单元格位置不能大于当前行所包含的单元格
					console.warn("the " + ordinal(colIndex + 1) + " cell can not be append, because the " + ordinal(idx + 1) + " row only " + cells + " cells");
				} else {

					if ( td instanceof jQuery) {
						$(row.insertCell(colIndex)).append(td);
					} else {
						row.insertCell(colIndex).innerHTML = td;
					}
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
			//this.__insertRow(this.getRow(), tds);
			this.__insertRow(-1, tds);
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

		this.appendCol = function(tds) {
			this.__insertCol(-1, tds);
		};
		this.insertToFirstCol = function(tds) {
			this.__insertCol(0, tds);
		};
		this.insertToLastCol = this.appendCol;

		this.insertBeforeCol = function(colIndex, tds) {
			this.__insertCol(colIndex - 1, tds);
		}
		this.insertAfterCol = function(colIndex, tds) {
			this.__insertCol(colIndex, tds);
		}
	};

	$.fn.eTable = function() {

		var eTable = new ETable(this);

		return eTable;
	};

})(jQuery);
