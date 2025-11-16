
export enum Step {
  Upload = 1,
  Requirement = 2,
  Editor = 3,
}

export enum DocType {
  None = 'none',
  Photo = 'photo',
  Signature = 'signature',
}

export interface Requirement {
  widthCm: number;
  heightCm: number;
  maxSizeKb: number;
  dpi: number;
}
