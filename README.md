# spreadsheet-db
Googleスプレッドシートをデータベースライクに扱うためのGAS

### 読み込み

```
readRecords(table, filter, orderby)
```
- table:    テーブル名（シート名）     例）'Table01'
- filter:   フィルター               例）'郵便番号=5406112'
- orderby:  並び替えするフィールド名   例）'住所 DESC'


