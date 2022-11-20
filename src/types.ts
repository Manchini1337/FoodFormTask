export enum FieldName {
  Name = 'name',
  PreparationTime = 'preparation_time',
  Type = 'type',
  NoOfSlices = 'no_of_slices',
  Diameter = 'diameter',
  SpicinessScale = 'spiciness_scale',
  SlicesOfBread = 'slices_of_bread',
}

export type FormData = {
  [FieldName.Name]: string;
  [FieldName.PreparationTime]: string;
  [FieldName.Type]?: string;
  [FieldName.NoOfSlices]?: number;
  [FieldName.Diameter]?: number;
  [FieldName.SpicinessScale]?: number;
  [FieldName.SlicesOfBread]?: number;
};

// Record creates error type object to be of key and value pairs, for example { no_of_slices: 'should be a number' }
// Partial allows it to be undefined, in case there is no error
export type FormErrors = Partial<Record<FieldName, string>>;

export type ResponseData = {
  id: number;
} & FormData;
