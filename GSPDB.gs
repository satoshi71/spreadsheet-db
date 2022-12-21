const sheetID = "シートID";

//読み込み
function readRecords(table, filter, orderby){
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName('QUERY');
  if(sheet==null) throw new Error('データベースに[QUERY]シートが存在しません。');

  var fields = getFields(table);
  if(filter!='' && filter!=null) filter= "WHERE " + filter;
  for(var i=0; i<fields.length; i++){
    filter=filter.replace(fields[i], getColName(i));
    if(orderby!=null) orderby=orderby.replace(fields[i], getColName(i));
  }
  if(orderby!=null && orderby!=''){
    filter += " ORDER BY " + orderby;
  }

  var lastCol = getLastColName(table);
  var lastRow = getLastRowNumber(table);
  if(lastRow<2) return null;//lastRow=2;
  sheet.getRange("A2").setValue("=QUERY("+table+"!A2:"+lastCol+lastRow+",\""+filter+"\")");
  var c = sheet.getLastColumn();
  var r = sheet.getLastRow();
  if(r<2) return null;
  var data = sheet.getRange("A2:"+lastCol+r).getValues();

  if(data[0][0]=="#N/A" || data[0][0]=="#VALUE!") data=null;
  return data;
}

//新規追加
function insertRecord(table, data){
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName(table);
  if(sheet==null) throw new Error('データベースに['+table+']テーブルが存在しません。');

  row = getLastRowNumber(table);
  if(row==-1) throw new Error('最終行が取得できません。');

  //主キーチェック
  var fields = getFields(table);
  if(!data[fields[1]]) throw new Error('主キーを指定してください。');
  for(var key in data){
    if(fields.indexOf(key)<0) throw new Error('データベースに['+key+']フィールドが存在しません。');
    if(fields.indexOf(key)==0) throw new Error('IDは自動採番なので登録することはできません。');
  }

  for(var key in data){
    var c = fields.indexOf(key);
    sheet.getRange(row+1, c+1).setValue(data[key]);
  }
  sheet.getRange(row+1, 1).setValue("=row()");

  return true;
}

//更新
function updateRecord(table, data, filter){
  var buf = readRecords(table, filter,);
  if(buf==null) return false;
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName(table);
  if(sheet==null) throw new Error('データベースに['+table+']テーブルが存在しません。');
  var fields = getFields(table);
  for(var key in data){
    if(fields.indexOf(key)<0) throw new Error('データベースに['+key+']フィールドが存在しません。');
    if(fields.indexOf(key)==0) throw new Error('IDを変更することはできません。');
    if(fields.indexOf(key)==1) throw new Error('主キー['+key+']を変更することはできません。');
  }

  for(var i=0; i<buf.length; i++){
    var row = buf[i][0];
    for(var key in data){
      var c = fields.indexOf(key);
      // console.log(c+" : "+key);
      sheet.getRange(row, c+1).setValue(data[key]);
    }
  }
  return true;
}


//削除
function deleteRecords(table, filter) {
  var buf = readRecords(table, filter,);
  if(buf==null) return false;
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName(table);
  if(sheet==null) throw new Error('データベースに['+table+']テーブルが存在しません。');

  for(var i=buf.length-1; i>=0; i--){
    var id = buf[i][0];
    if(isFinite(id)) sheet.deleteRows(id);
  }

  return true;
};


function getColName(index) {
  var code = String.fromCharCode(65+index);
  return code;
}

function getMaxIndex(table){
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName('QUERY');
  if(sheet==null) return null;

  sheet.getRange("A2").setValue("=max("+table+"!A:A)");
  var maxID = sheet.getRange("A2").getValue();

  return maxID;
}

function getFields(table){
  var en = getLastColName(table);
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName(table);
  var fields = sheet.getRange("A1:" +en+ "1").getValues();
  return fields[0];
}

function getTables(){
  var sheets = SpreadsheetApp.openById(sheetID).getSheets();
  var buf = [];
  if (sheets.length > 0){
    for(sheet of sheets){
      if(sheet.getName()!='QUERY'){
        buf.push(sheet.getName());
      }
    }
  }
  return buf;
}


function getLastRowNumber(table){
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName(table);
  //スプレッドイートの最大行を取得
  var maxRow = sheet.getMaxRows();
  //最終行のID欄が空欄じゃない＝空行がないと判断
  if(sheet.getRange(maxRow,1).getValue()!=""){
    //一番下に空行を100行追加する
    sheet.insertRowsAfter(maxRow, 100);
  }
  var row = sheet.getRange(sheet.getMaxRows(), 1).getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  return row;
}


function getLastColNumber(table){
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName(table);
  var col = sheet.getRange(1, sheet.getMaxColumns()).getNextDataCell(SpreadsheetApp.Direction.PREVIOUS).getColumn();
  return col;
}

function getLastColName(table){
  var sheet = SpreadsheetApp.openById(sheetID).getSheetByName(table);
  var col = sheet.getRange(1, sheet.getMaxColumns()).getNextDataCell(SpreadsheetApp.Direction.PREVIOUS).getColumn();
  return String.fromCharCode(64+col);
}
