// column_config.ts
// テーブル名、カラム名、KEY、型の情報をJSON形式で返す関数

export interface ColumnConfig {
  tableName: string;
  columns: {
    name: string;
    key: string;
    type: string;
  }[];
}

// サンプルデータ（実際のデータベースに合わせて更新してください）
export const columnConfigs: ColumnConfig[] = [
  {
    tableName: 'BOM_BUZAI',
    columns: [
      { name: 'buzai_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'unit_weight', key: '', type: 'TEXT' },
      { name: 'quantity', key: '', type: 'TEXT' },
      { name: 'ZAISITU_name', key: '', type: 'TEXT' },
      { name: 'ZARYO_name', key: '', type: 'TEXT' },
      { name: 'part_id', key: '', type: 'TEXT' },
      { name: 'Zumen_ID', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'BOM_PART',
    columns: [
      { name: 'part_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'quantity', key: '', type: 'TEXT' },
      { name: 'sub_quantity', key: '', type: 'TEXT' },
      { name: 'spare_quantity', key: '', type: 'TEXT' },
      { name: 'part_name', key: '', type: 'TEXT' },
      { name: 'remarks', key: '', type: 'TEXT' },
      { name: 'tehai_division', key: '', type: 'TEXT' },
      { name: 'tehai_id', key: '', type: 'TEXT' },
      { name: 'manufacturer', key: '', type: 'TEXT' },
      { name: 'part_project_id', key: '', type: 'TEXT' },
      { name: 'zumen_id', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'BOM_Zume',
    columns: [
      { name: 'Zumen_ID', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_ID', key: '', type: 'TEXT' },
      { name: 'Zumen_Name', key: '', type: 'TEXT' },
      { name: 'Zumen_Kind', key: '', type: 'TEXT' },
      { name: 'Kumitate_Zumen', key: '', type: 'TEXT' },
      { name: 'Souti_ID', key: '', type: 'TEXT' },
      { name: 'Souti_name', key: '', type: 'TEXT' },
      { name: 'rev_number', key: '', type: 'TEXT' },
      { name: 'Tantou_a1', key: '', type: 'TEXT' },
      { name: 'Tantou_a2', key: '', type: 'TEXT' },
      { name: 'Tantou_b1', key: '', type: 'TEXT' },
      { name: 'Tantou_b2', key: '', type: 'TEXT' },
      { name: 'Tantou_c1', key: '', type: 'TEXT' },
      { name: 'Tantou_c2', key: '', type: 'TEXT' },
      { name: 'status', key: '', type: 'TEXT' },
      { name: 'Syutuzubi_Date', key: '', type: 'TEXT' },
      { name: 'Sakuzu_a', key: '', type: 'TEXT' },
      { name: 'Sakuzu_b', key: '', type: 'TEXT' },
      { name: 'Sakuzu_date', key: '', type: 'TEXT' },
      { name: 'Scale', key: '', type: 'TEXT' },
      { name: 'Size', key: '', type: 'TEXT' },
      { name: 'Sicret_code', key: '', type: 'TEXT' },
      { name: 'WRITEver', key: '', type: 'TEXT' },
      { name: 'KANREN_ZUMEN', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'KONPO',
    columns: [
      { name: 'KONPO_ID', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_ID', key: '', type: 'TEXT' },
      { name: 'weight', key: '', type: 'TEXT' },
      { name: 'HASSOU_IN', key: '', type: 'TEXT' },
      { name: 'HASSOU_TO', key: '', type: 'TEXT' },
      { name: 'IMAGE_ID', key: '', type: 'TEXT' },
      { name: 'created_at', key: '', type: 'DATETIME' },
      { name: 'updated_at', key: '', type: 'DATETIME' }
    ]
  },
  {
    tableName: 'KONPOU_UNIT',
    columns: [
      { name: 'KONPO_UNIT_ID', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'ZUMEN_ID', key: '', type: 'TEXT' },
      { name: 'PART_ID', key: '', type: 'TEXT' },
      { name: 'PARCENTAGE', key: '', type: 'TEXT' },
      { name: 'KONPO_ID', key: '', type: 'TEXT' },
      { name: 'created_at', key: '', type: 'DATETIME' },
      { name: 'updated_at', key: '', type: 'DATETIME' }
    ]
  },
  {
    tableName: 'KONPO_LIST',
    columns: [
      { name: 'KONPO_ID', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_ID', key: '', type: 'TEXT' },
      { name: 'weight', key: '', type: 'TEXT' },
      { name: 'HASSOU_IN', key: '', type: 'TEXT' },
      { name: 'HASSOU_TO', key: '', type: 'TEXT' },
      { name: 'IMAGE_ID', key: '', type: 'TEXT' },
      { name: 'created_at', key: '', type: 'DATETIME' },
      { name: 'updated_at', key: '', type: 'DATETIME' }
    ]
  },
  {
    tableName: 'KONPO_TANNI',
    columns: [
      { name: 'KONPO_UNIT_ID', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'ZUMEN_ID', key: '', type: 'TEXT' },
      { name: 'PART_ID', key: '', type: 'TEXT' },
      { name: 'PARCENTAGE', key: '', type: 'TEXT' },
      { name: 'KONPO_ID', key: '', type: 'TEXT' },
      { name: 'created_at', key: '', type: 'DATETIME' },
      { name: 'updated_at', key: '', type: 'DATETIME' }
    ]
  },
  {
    tableName: 'Zumen',
    columns: [
      { name: 'Zumen_ID', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_ID', key: '', type: 'TEXT' },
      { name: 'Zumen_Name', key: '', type: 'TEXT' },
      { name: 'Zumen_Kind', key: '', type: 'TEXT' },
      { name: 'Kumitate_Zumen', key: '', type: 'TEXT' },
      { name: 'Souti_ID', key: '', type: 'TEXT' },
      { name: 'Souti_name', key: '', type: 'TEXT' },
      { name: 'rev_number', key: '', type: 'TEXT' },
      { name: 'Tantou_a1', key: '', type: 'TEXT' },
      { name: 'Tantou_a2', key: '', type: 'TEXT' },
      { name: 'Tantou_b1', key: '', type: 'TEXT' },
      { name: 'Tantou_b2', key: '', type: 'TEXT' },
      { name: 'Tantou_c1', key: '', type: 'TEXT' },
      { name: 'Tantou_c2', key: '', type: 'TEXT' },
      { name: 'status', key: '', type: 'TEXT' },
      { name: 'Syutuzubi_Date', key: '', type: 'TEXT' },
      { name: 'Sakuzu_a', key: '', type: 'TEXT' },
      { name: 'Sakuzu_b', key: '', type: 'TEXT' },
      { name: 'Sakuzu_date', key: '', type: 'TEXT' },
      { name: 'Scale', key: '', type: 'TEXT' },
      { name: 'Size', key: '', type: 'TEXT' },
      { name: 'Sicret_code', key: '', type: 'TEXT' },
      { name: 'WRITEver', key: '', type: 'TEXT' },
      { name: 'KANREN_ZUMEN', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'Zumen_old',
    columns: [
      { name: 'Zumen_ID', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_ID', key: '', type: 'TEXT' },
      { name: 'Zumen_Name', key: '', type: 'TEXT' },
      { name: 'Zumen_Kind', key: '', type: 'TEXT' },
      { name: 'Kumitate_Zumen', key: '', type: 'TEXT' },
      { name: 'Souti_ID', key: '', type: 'TEXT' },
      { name: 'Souti_name', key: '', type: 'TEXT' },
      { name: 'rev_number', key: '', type: 'TEXT' },
      { name: 'Tantou_a1', key: '', type: 'TEXT' },
      { name: 'Tantou_a2', key: '', type: 'TEXT' },
      { name: 'Tantou_b1', key: '', type: 'TEXT' },
      { name: 'Tantou_b2', key: '', type: 'TEXT' },
      { name: 'Tantou_c1', key: '', type: 'TEXT' },
      { name: 'Tantou_c2', key: '', type: 'TEXT' },
      { name: 'status', key: '', type: 'TEXT' },
      { name: 'Syutuzubi_Date', key: '', type: 'TEXT' },
      { name: 'Sakuzu_a', key: '', type: 'TEXT' },
      { name: 'Sakuzu_b', key: '', type: 'TEXT' },
      { name: 'Sakuzu_date', key: '', type: 'TEXT' },
      { name: 'Scale', key: '', type: 'TEXT' },
      { name: 'Size', key: '', type: 'TEXT' },
      { name: 'Sicret_code', key: '', type: 'TEXT' },
      { name: 'WRITEver', key: '', type: 'TEXT' },
      { name: 'KANREN_ZUMEN', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'Zumen_old2',
    columns: [
      { name: 'Zumen_ID', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_ID', key: '', type: 'TEXT' },
      { name: 'Zumen_Name', key: '', type: 'TEXT' },
      { name: 'Zumen_Kind', key: '', type: 'TEXT' },
      { name: 'Kumitate_Zumen', key: '', type: 'TEXT' },
      { name: 'Souti_ID', key: '', type: 'TEXT' },
      { name: 'Souti_name', key: '', type: 'TEXT' },
      { name: 'rev_number', key: '', type: 'TEXT' },
      { name: 'Tantou_a1', key: '', type: 'TEXT' },
      { name: 'Tantou_a2', key: '', type: 'TEXT' },
      { name: 'Tantou_b1', key: '', type: 'TEXT' },
      { name: 'Tantou_b2', key: '', type: 'TEXT' },
      { name: 'Tantou_c1', key: '', type: 'TEXT' },
      { name: 'Tantou_c2', key: '', type: 'TEXT' },
      { name: 'status', key: '', type: 'TEXT' },
      { name: 'Syutuzubi_Date', key: '', type: 'TEXT' },
      { name: 'Sakuzu_a', key: '', type: 'TEXT' },
      { name: 'Sakuzu_b', key: '', type: 'TEXT' },
      { name: 'Sakuzu_date', key: '', type: 'TEXT' },
      { name: 'Scale', key: '', type: 'TEXT' },
      { name: 'Size', key: '', type: 'TEXT' },
      { name: 'Sicret_code', key: '', type: 'TEXT' },
      { name: 'WRITEver', key: '', type: 'TEXT' },
      { name: 'KANREN_ZUMEN', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'all_department',
    columns: [
      { name: 'department_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'department_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'all_user',
    columns: [
      { name: 'user_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'user_name', key: '', type: 'TEXT' },
      { name: 'department_id', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'all_user_temp_pkchg',
    columns: [
      { name: 'user_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'user_name', key: '', type: 'TEXT' },
      { name: 'department_id', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'app_settings',
    columns: [
      { name: 'setting_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'setting_name', key: '', type: 'TEXT' },
      { name: 'setting_value', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'bumon',
    columns: [
      { name: 'bumon_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'bumon_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'bumon_history',
    columns: [
      { name: 'history_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'bumon_id', key: '', type: 'TEXT' },
      { name: 'bumon_name', key: '', type: 'TEXT' },
      { name: 'change_date', key: '', type: 'DATETIME' }
    ]
  },
  {
    tableName: 'd_culum_style',
    columns: [
      { name: 'style_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'style_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'd_datakind',
    columns: [
      { name: 'kind_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'kind_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'departments',
    columns: [
      { name: 'department_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'department_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'employees',
    columns: [
      { name: 'employee_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'employee_name', key: '', type: 'TEXT' },
      { name: 'department_id', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'm_activity_types',
    columns: [
      { name: 'activity_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'activity_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'm_kintai',
    columns: [
      { name: 'kintai_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'employee_id', key: '', type: 'TEXT' },
      { name: 'date', key: '', type: 'TEXT' },
      { name: 'start_time', key: '', type: 'TEXT' },
      { name: 'end_time', key: '', type: 'TEXT' },
      { name: 'break_time', key: '', type: 'REAL' }
    ]
  },
  {
    tableName: 'main_Zisseki',
    columns: [
      { name: 'zisseki_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'employee_id', key: '', type: 'TEXT' },
      { name: 'project_id', key: '', type: 'TEXT' },
      { name: 'date', key: '', type: 'TEXT' },
      { name: 'hours', key: '', type: 'REAL' },
      { name: 'description', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'prant_B_id',
    columns: [
      { name: 'prant_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'prant_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'project',
    columns: [
      { name: 'project_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_name', key: '', type: 'TEXT' },
      { name: 'department', key: '', type: 'TEXT' },
      { name: 'created_at', key: '', type: 'DATETIME' }
    ]
  },
  {
    tableName: 'project_equipment',
    columns: [
      { name: 'equipment_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_id', key: '', type: 'TEXT' },
      { name: 'equipment_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'project_item',
    columns: [
      { name: 'item_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_id', key: '', type: 'TEXT' },
      { name: 'item_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'project_member_histories',
    columns: [
      { name: 'history_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_id', key: '', type: 'TEXT' },
      { name: 'employee_id', key: '', type: 'TEXT' },
      { name: 'change_date', key: '', type: 'DATETIME' }
    ]
  },
  {
    tableName: 'project_purchase_items',
    columns: [
      { name: 'purchase_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_id', key: '', type: 'TEXT' },
      { name: 'item_name', key: '', type: 'TEXT' },
      { name: 'quantity', key: '', type: 'INTEGER' }
    ]
  },
  {
    tableName: 'project_purchase_items_old',
    columns: [
      { name: 'purchase_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_id', key: '', type: 'TEXT' },
      { name: 'item_name', key: '', type: 'TEXT' },
      { name: 'quantity', key: '', type: 'INTEGER' }
    ]
  },
  {
    tableName: 'project_setubi_ID',
    columns: [
      { name: 'setubi_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_id', key: '', type: 'TEXT' },
      { name: 'setubi_name', key: '', type: 'TEXT' }
    ]
  },
  {
    tableName: 'project_ticket',
    columns: [
      { name: 'ticket_id', key: 'PRIMARY KEY', type: 'TEXT' },
      { name: 'project_id', key: '', type: 'TEXT' },
      { name: 'ticket_name', key: '', type: 'TEXT' }
    ]
  }
];

// テーブル名、カラム名、KEY、型の情報をJSON形式で返す関数
export function getColumnConfigs(): ColumnConfig[] {
  return columnConfigs;
} 