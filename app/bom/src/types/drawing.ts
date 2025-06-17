export interface Drawing {
  Zumen_ID: string;
  project_ID: string;
  Zumen_Name: string;
  Zumen_Kind: string;
  Kumitate_Zumen: string;
  Souti_ID: string;
  Souti_name: string;
  rev_number: string;
  Tantou_a1: string;
  Tantou_a2: string;
  Tantou_b1: string;
  Tantou_b2: string;
  Tantou_c1: string;
  Tantou_c2: string;
  status: string;
  Syutuzubi_Date: string;
  Sakuzu_a: string;
  Sakuzu_b: string;
  Sakuzu_date: string;
  Scale: string;
  Size: string;
  Sicret_code: string;
  WRITEver: string;
  KANREN_ZUMEN: string;
  total_weight?: number;
}

export interface Part {
  PART_ID: string;
  part_name: string;
  manufacturer: string;
  total_weight?: number;
}

export interface DrawingDetail {
  drawing: Drawing;
  parts: Part[];
}

export interface BuzaiDetail {
  Buzai_ID: string;
  ZAISITU_name: string;
  unit_weight: number;
  quantity: number;
  total_weight: number;
} 