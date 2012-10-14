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
		this.getRows = function() {
			return this.table.find("tr").length;
		};
		/**
		 * Get the number of cols
		 */
		this.getCols = function() {
			console.time("getCols");
			var max_col = 0;
			$.each(this.table.find("tr"), function(idx, tr) {
				max_col = Math.max(max_col, $(tr).find("td").length);
			});
			console.timeEnd("getCols");
			return max_col;
		}
		/**
		 * Private Method Insert Row.
		 *
		 * @param rowIndex
		 *            {Number}
		 * @param cells
		 *            {Array}
		 * @param insertMethodName
		 * 			  {String}  [before|after]
		 */
		this.__insertRow = function(rowIndex, cells, insertMethodName) {
			console.time("insertRow");
			if (!$.isArray(cells) || cells.length === 0) {// 参数cells为长度不为0的数组
				console.error("table cell data type should be an array and length of not less then 0!");
				return false;
			}
			if (rowIndex < -1) {// 插入行位置不能小于-1
				console.error("The rowIndex (" + rowIndex + ") can not be less than -1 !");
				return false;
			}

			var rows = this.getRows();

			if (rowIndex > rows) {// 插入行位置不能大于当前总行数
				console.error("The " + ordinal(rowIndex + 1) + " row can not be inserted, because the table is only " + rows + " rows");
				return false;
			}
			console.info('rows: ' + this.getRows() + ' rowIndex: ' + rowIndex);

			/*
			* it's easy to get the object of `TableRow` by `Table.insertRow` method,
			* but the browser will reflow and repain DOM tree when every call `TableRow.insertCell` method!
			*/
			// var tr = this.table[0].insertRow(rowIndex);

			var addTr = $("<tr>")[0];
			$.each(cells, function(idx, cell) {
				if ( cell instanceof jQuery) {
					$(addTr.insertCell(idx)).append(cell);
				} else {
					addTr.insertCell(idx).innerHTML = cell;
				}
			});
			var $tr = this.table.find('tr:eq(' + rowIndex + ")");
			if ($tr[0]) {
				$tr[insertMethodName](addTr);
			} else {
				this.table.append(addTr);
			}
			console.timeEnd("insertRow");
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
			console.time("insertCol");
			if (!$.isArray(cells) || cells.length === 0) {// 参数cells为长度不为0的数组
				console.error("table cell data type should be an array and length of not less then 0!");
				return false;
			}
			if (colIndex < -1) {// 插入列位置不能小于-1
				console.error("The colIndex (" + colIndex + ") can not be less than -1 !");
				return false;
			}

			var self = this, rows = this.table[0].rows, row_len = rows.length;

			//recursive insert table Column
			(function addCol(iRow) {

				if (row_len && iRow >= row_len)
					return;

				var row = rows[iRow];

				if (!row) {
					row = $("<tr>")[0];
					self.table.append(row);
				}
				console.info("colIndex: " + colIndex, " row.cells: " + row.cells.length);
				if (colIndex > row.cells.length) {
					addCol(++iRow);
				} else {
					var cell = cells.shift();
					if ( cell instanceof jQuery) {
						$(row.insertCell(colIndex)).append(cell);
					} else {
						row.insertCell(colIndex).innerHTML = cell;
					}
					if (cells.length != 0)
						addCol(++iRow);
				}
			})(0);
			console.timeEnd("insertCol");
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
			console.time("deleteRow");
			if (this.getRows() === 0) {
				console.warn("Empty table !");
				return;
			}
			if (rowIndex > this.getRows() - 1) {
				console.warn("the " + ordinal(rowIndex + 1) + " rows does not exist ");
				return;
			}
			this.table[0].deleteRow(rowIndex);
			console.info('rows: ' + this.getRows() + ' rowIndex: ' + rowIndex);
			console.timeEnd("deleteRow");
		};

		this.__deleteCol = function(colIndex) {
			console.time("deleteCol");
			if (this.getRows() === 0) {
				console.warn("Empty table !");
				return;
			}
			var rows = this.table[0].rows;
			for (var r = rows.length - 1; r > -1; r--) {
				var iCell = rows[r].cells.length;
				if (colIndex > iCell - 1) {
					console.warn("the " + ordinal(colIndex + 1) + " cols does not exist");
					continue;
				}
				rows[r].deleteCell(colIndex);
				if (iCell === 1) {
					this.__deleteRow(r);
				}
			}
			console.timeEnd("deleteCol");
		}
		/**
		 * Append a new row
		 *
		 * @param cells
		 *            {Array}
		 *
		 */
		this.appendRow = function(cells) {
			this.__insertRow(this.getRows() - 1, cells, 'after');
			//this.__insertRow(-1, cells);
		};

		/**
		 * Insert into the 1st row
		 *
		 * @param cells
		 *            {Array}
		 */
		this.insertToFirstRow = function(cells) {
			this.__insertRow(0, cells, 'before');
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
			this.__insertRow(rowIndex - 1, cells, "before");
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
			this.__insertRow(rowIndex - 1, cells, 'after');
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
			this.__insertCol(this.getCols(), cells);
		};
		this.insertToFirstCol = function(cells) {
			this.__insertCol(0, cells);
		};
		this.insertToLastCol = this.appendCol;

		this.insertBeforeCol = function(colIndex, cells) {
			this.__insertCol(colIndex - 1, cells);
		};
		this.insertAfterCol = function(colIndex, cells) {
			this.__insertCol(colIndex, cells);
		};
		this.deleteFirstCol = function() {
			this.__deleteCol(0);
		};
		this.deleteLastCol = function() {
			this.__deleteCol(this.getCols() - 1);
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