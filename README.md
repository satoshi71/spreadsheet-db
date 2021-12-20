# spreadsheet-db
Googleスプレッドシートをデータベースライクに扱うためのGAS

(詳細説明)
http://pineplanter.moo.jp/non-it-salaryman/2021/12/20/spreadsheet-db2/


### 読み込み

```
readRecords(table, filter, orderby)
```
- table:    テーブル名（シート名）     例）'Table01'
- filter:   フィルター               例）'郵便番号=5406112'
- orderby:  並び替えするフィールド名   例）'住所 DESC'


### 更新

```
var data = {'県名':'愛知県','市区名':'名古屋市緑区', '住所':'桶狭間'};
var b = updateRecord('KEN', data, "郵便番号=4580925");
console.log(b);//うまく言ったらtrue
```

### 新規登録

```
var data = {"郵便番号":"4580925", "けんめい":"ｱｲﾁｹﾝ", "しちょうそん":"ﾅｺﾞﾔｼﾐﾄﾞﾘｸ", "じゅうしょ":"ｵｹﾊｻﾞﾏ", "県名":"愛知県", "市区名":"名古屋市緑区", "住所":"桶狭間"}
var b = db.insertRecord("KEN", data);
console.log(b);//うまく言ったらtrue
```

### 削除

```
b = db.deleteRecords("KEN", "郵便番号=4580925");
console.log(b);//うまく言ったらtrue
```
