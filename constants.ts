
import { Requirement, DocType } from './types';

export const REQUIREMENTS: Record<DocType, Requirement | null> = {
  [DocType.None]: null,
  [DocType.Photo]: {
    widthCm: 2.5,
    heightCm: 3.5,
    maxSizeKb: 20,
    dpi: 300,
  },
  [DocType.Signature]: {
    widthCm: 4.5,
    heightCm: 2.0,
    maxSizeKb: 50,
    dpi: 600,
  },
};
