# BOMシステム実装詳細

## 1. システム構成

### 1.1 技術スタック
- フロントエンド
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - React Hook Form
- バックエンド
  - Next.js API Routes
  - SQLite3
  - Prisma（ORM）
- データベース
  - SQLite (data/achievements.db)

### 1.2 ディレクトリ構造
```
app/bom/
├── components/     # コンポーネント
├── hooks/         # カスタムフック
├── libs/          # ユーティリティ
├── types/         # 型定義
├── [projectNumber]/ # プロジェクト固有のコンポーネント
├── page.tsx       # メインページ
├── README.md      # システム概要
├── part_database.mdc  # データベース仕様
└── mdc_app_02_pacage.mdc  # 梱包管理仕様
```

## 2. データベース設計

### 2.1 主要テーブル
1. BOM_PROJECT
   - プロジェクト情報管理
   - プロジェクトID、名称、番号を管理

2. BOM_ZUMEN
   - 図面情報管理
   - 図面ID、名称、種別、担当者情報を管理

3. BOM_PART
   - 部品情報管理
   - 部品ID、名称、数量、重量を管理

4. BOM_BUZAI
   - 部材情報管理
   - 部材ID、名称、重量、数量を管理

5. KONPO_LIST
   - 梱包リスト管理
   - 梱包ID、発送情報、重量を管理

6. KONPO_TANNI
   - 梱包単位管理
   - 梱包単位ID、部品個数、全数個数を管理

### 2.2 データ連携
- 図面と部品の関連付け
- 部品と部材の関連付け
- 梱包単位と部品の関連付け

## 3. 主要機能実装

### 3.1 プロジェクト管理
- プロジェクト一覧表示
- 新規プロジェクト作成
- プロジェクト詳細表示
- プロジェクト編集・削除

### 3.2 図面管理
- 図面一覧表示
- 図面詳細表示
- 図面の新規作成
- 図面の編集・削除
- 図面検索機能

### 3.3 部品管理
- 部品一覧表示
- 部品詳細表示
- 部品の新規登録
- 部品の編集・削除
- 部品検索機能

### 3.4 重量管理
- 部品ごとの重量表示
- 図面ごとの総重量表示
- プロジェクト全体の総重量表示
- 重量の自動計算機能

### 3.5 梱包管理
- 梱包リスト作成
- 梱包単位管理
- 発送情報管理
- 一括梱包単位登録
- 重量計算と表示

## 4. API実装

### 4.1 プロジェクト関連
- GET /api/bom/projects
- POST /api/bom/projects
- GET /api/bom/projects/[id]
- PUT /api/bom/projects/[id]
- DELETE /api/bom/projects/[id]

### 4.2 図面関連
- GET /api/bom/drawings
- POST /api/bom/drawings
- GET /api/bom/drawings/[id]
- PUT /api/bom/drawings/[id]
- DELETE /api/bom/drawings/[id]

## 5. 画面実装

### 5.1 メインページ
- プロジェクト一覧表示
- 新規プロジェクト作成
- プロジェクト検索

### 5.2 プロジェクト詳細
- プロジェクト情報表示
- 図面一覧表示
- 新規図面作成
- 総重量表示

### 5.3 図面詳細
- 図面情報表示
- 部品一覧表示
- 部品追加
- 重量情報表示

### 5.4 梱包管理
- 梱包リスト一覧
- 梱包単位管理
- 発送情報管理
- 一括登録機能

## 6. 運用管理

### 6.1 バックアップ
- データベースの定期的なバックアップ
- バックアップファイルの安全な保管

### 6.2 パフォーマンス
- インデックスの適切な設定
- 大量データ処理の最適化
- 定期的なVACUUM実行

### 6.3 セキュリティ
- ユーザー権限の管理
- データアクセス制御
- 機密情報の保護

## 7. 今後の拡張予定

### 7.1 機能拡張
- バーコード/QRコード対応
- 発送業者との連携
- 在庫管理システムとの連携

### 7.2 システム改善
- モバイル対応
- 多言語対応
- パフォーマンス最適化 