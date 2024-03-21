//version_code 4 (w/o encryption and binary)
//JSON VERSION, NOT SQLITE, (but same Game API here, JSON<->SQLITE bases interchangeable)
var g_DatabaseLocal = null; //spreadsheet as JSON object, 

function Database() {

};

Database.init = function () {
    g_DatabaseLocal = cc.loader.getRes(res.database);
};

Database.release = function () {
    g_DatabaseLocal = null;
};

Database.colNameToIdx = function (strTable, str) {
    var table = g_DatabaseLocal[strTable];
    var firstRow = table[0];
    var length = firstRow.length;
    for (var i = 0; i < length; i++) {
        if (firstRow[i] == str) {
            return i;
        }
    }
    return -1;
};

Database.getTableRowByValue = function (strTable, strColumn, strValue, vData) {
    console.assert(g_DatabaseLocal);
    var table = g_DatabaseLocal[strTable];
    var idxCol = Database.colNameToIdx(strTable, strColumn);
    var length = table.length;
    for (var i = 1; i < length; i++) {
        var row = table[i];
        if (row[idxCol] == strValue) {
            var rowVals = [];
            for (var j = 0; j < row.length; j++) {
                rowVals.push(row[j]);
            }
            vData.push(rowVals);
        }
    }
};

Database.getTableRowByValues = function (strTable, strColumn, strValue, strColumn1, strValue1, vData) {

    console.assert(g_DatabaseLocal);

    var strRequest = 'SELECT* FROM ' + strTable + ' WHERE ' + strColumn + ' LIKE \"' + strValue + '\"' + ' AND ' + strColumn1 + ' LIKE \"' + strValue1 + '\"';

    var result = Database.doExec(strRequest);

    if (result.length == 0) {
        return;
    }

    var resLength = result[0].values.length;

    for (var i = 0; i < resLength; i++) {
        vData.push(result[0].values[i]);
    }
};

Database.getCellInt = function (strTable, strCol, iRow) {
    return parseInt(g_DatabaseLocal[strTable][iRow + 1][Database.colNameToIdx(strTable, strCol)]);
};

Database.getTableRow = function (strTable, iRow, vData) {

    console.assert(g_DatabaseLocal);

    //local database request
    var strOffset = iRow.toString();
    var strRequest = 'SELECT* FROM ' + strTable + ' LIMIT 1 OFFSET ' + strOffset;

    var result = Database.doExec(strRequest);
    vData.push.apply(vData, result[0].values[0]);

};

Database.getTableColumn = function (strTable, strColumn, vData) {
    console.assert(g_DatabaseLocal);
    var table = g_DatabaseLocal[strTable];
    var length = table.length;
    var colIdx = Database.colNameToIdx(strTable, strColumn);
    for (var i = 1; i < length; i++) {
        vData.push(table[i][colIdx]);
    }
};

Database.getTableColumnSum = function (strTable, strColumn) {

    var vData = null;
    Database.getTableColumn(strTable, strColumn, vData);

    var iVals = 0;
    for (var i = 0; i < vData.length; i++) {
        iVals += parseInt(vData[i]);
    }

    return iVals;
};

Database.getRowsNum = function (strTable) {
    return g_DatabaseLocal[strTable].length - 1;
};

Database.getTable = function (strTable, vData) {

    console.assert(g_DatabaseLocal);

    var strRequest = 'SELECT* FROM ' + strTable;

    var result = Database.doExec(strRequest);
    var resLength = result[0].values.length;

    for (var i = 0; i < resLength; i++) {
        vData.push(result[0].values[i]);
    }

};

Database.getCellString = function (strTable, strColumn, strValue, strColumnSrch, vData) {
    console.assert(g_DatabaseLocal);
    var table = g_DatabaseLocal[strTable];
    var length = table.length;
    var colIdx = Database.colNameToIdx(strTable, strColumn);
    for (var i = 0; i < length; i++) {
        var row = table[i];
        if (row[colIdx] == strValue) {
            vData.push(row[Database.colNameToIdx(strTable, strColumnSrch)]);
        }
    }
};

Database.getGameString = function (strKey, lang) {
    var vData = [];
    if (lang === undefined) {
        lang = Globals.LANGUAGE;
    }
    Database.getCellString("strings", "key", strKey, lang + "_" + (Globals.TOUCH ? "touch" : "numpad"), vData);
    var strText = vData[0];
    strText = Globals.strReturnReplace(strText, '\\\\n');
    return strText;
};