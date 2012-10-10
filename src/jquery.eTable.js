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
		 * @param cells
		 *            {Array}
		 */
		this.__insertRow = function(rowIndex, cells) {
			if (!$.isArray(cells) || cells.length === 0) {// 参数tds为长度不为0的数组
				console.error("table cell data type should be an array and length of not less then 0!");
				return false;
			}
			if (rowIndex < -1) {// 插入行位置不能小于-1
				console.error("The rowIndex (" + rowIndex + ") can not be less than -1 !");
				return false;
			}

			var rows = this.getRow();

			if (rowIndex > rows) {// 插入行位置不能大于当前总行数
				console.error("The " + ordinal(rowIndex + 1) + " row can not be inserted, because the table is only " + rows + " rows");
				return false;
			}
			console.info('rows: ' + this.getRow() + ' rowIndex: ' + rowIndex);
			var tr = this.table[0].insertRow(rowIndex);

			$.each(cells, function(idx, cell) {
				if ( cell instanceof jQuery) {
					$(tr.insertCell(idx)).append(cell);
				} else {
					tr.insertCell(idx).innerHTML = cell;
				}
			});
		};
		/**
		 * Private Method Insert Col.
		 *
		 * @param colIndex
		 *            {Number}
		 * @param cells
		 *            {Array}
		 */
		this.__insertCol = function(colIndex, cells) {
			if (!$.isArray(cells) || cells.length === 0) {// 参数tds为长度不为0的数组
				console.error("table cell data type should be an array and length of not less then 0!");
				return false;
			}
			if (colIndex < -1) {// 插入列位置不能小于-1
				console.error("The colIndex (" + colIndex + ") can not be less than -1 !");
				return false;
			}

			var self = this, rows = this.table[0].rows;

			$.each(cells, function(idx, cell) {
				var row = rows[idx];
				if (!row) {
					row = $("<tr>")[0];
					self.table.append(row);
				}

				var iCell = row.cells.length;

				if (colIndex > iCell) {// 插入单元格位置不能大于当前行所包含的单元格数量
					console.warn("the " + ordinal(colIndex + 1) + " cell can not be append, because the " + ordinal(idx + 1) + " row only " + iCell + " cells");
				} else {
					if ( cell instanceof jQuery) {
						$(row.insertCell(colIndex)).append(cell);
					} else {
						row.insertCell(colIndex).innerHTML = cell;
					}
				}
			});
		};
		/**
		 * Pirvate Method Delete Row
		 * <ul>
		 * <li>rowIndex = 0 : first row</li>
		 * <li>rowIndex = -1 : last row</li>
		 * </ul>
		 *
		 * @param rowIndex
		 *            {Number}
		 *
		 */
		this.__deleteRow = function(rowIndex) {
			if (this.getRow() === 0) {
				console.warn("Empty table !");
				return;
			}
			if (rowIndex > this.getRow() - 1) {
				console.warn("the " + ordinal(rowIndex + 1) + " rows does not exist ");
				return;
			}
			this.table[0].deleteRow(rowIndex);
			console.info('rows: ' + this.getRow() + ' rowIndex: ' + rowIndex);
		};

		this.__deleteCol = function(colIndex) {
			if (this.getRow() === 0) {
				console.warn("Empty table !");
				return;
			}
			var rows = this.table[0].rows;
			for (var r = rows.length - 1; r > -1; r--) {
				var iCell = rows[r].cells.length;
				if (colIndex > iCell - 1) {
					console.error("the " + ordinal(colIndex + 1) + " cols does not exist");
					break;
				}
				rows[r].deleteCell(colIndex);
				if (iCell === 1) {
					this.__deleteRow(r);
				}
			}
		}
		/**
		 * Append a new row
		 *
		 * @param cells
		 *            {Array}
		 *
		 */
		this.appendRow = function(cells) {
			// this.__insertRow(this.getRow(), cells);
			this.__insertRow(-1, cells);
		};

		/**
		 * Insert into the 1st row
		 *
		 * @param cells
		 *            {Array}
		 */
		this.insertToFirstRow = function(cells) {
			this.__insertRow(0, cells);
		};

		/**
		 * Insert into the last row
		 */
		this.insertToLastRow = this.appendRow;

		/**
		 * Inserted before the specified row
		 *
		 * @param rowIndex
		 *            {Number}
		 * @param cells
		 *            {Array}
		 */
		this.insertBeforeRow = function(rowIndex, cells) {
			this.__insertRow(rowIndex - 1, cells);
		};

		/**
		 * Inserted after the specified row
		 *
		 * @param rowIndex
		 *            {Number}
		 * @param cells
		 *            {Array}
		 */
		this.insertAfterRow = function(rowIndex, cells) {
			this.__insertRow(rowIndex, cells);
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
			this.__deleteRow(-1);
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
			for (var r = rowIndexs.length - 1; r > -1; r--) {
				this.__deleteRow(rowIndexs[r]);
			}
		};

		this.appendCol = function(cells) {
			this.__insertCol(-1, cells);
		};
		this.insertToFirstCol = function(cells) {
			this.__insertCol(0, cells);
		};
		this.insertToLastCol = this.appendCol;

		this.insertBeforeCol = function(colIndex, cells) {
			this.__insertCol(colIndex, cells);
		};
		this.insertAfterCol = function(colIndex, cells) {
			this.__insertCol(colIndex, cells);
		};
		this.deleteFirstCol = function() {
			this.__deleteCol(0);
		};
		this.deleteLastCol = function() {
			this.__deleteCol(-1);
		};
		this.deleteCol = function(colIndex) {
			this.__deleteCol(colIndex);
		};
		this.deleteCols = function(colIndexs) {
			for (var ci = colIndexs.length - 1; ci > -1; ci--) {
				this.__deleteCol(colIndexs[ci]);
			}
		}
	};

	$.fn.eTable = function() {

		var eTable = new ETable(this);

		return eTable;
	};

})(jQuery);
