export interface NormalizedData<TValue = any> {
  byId: {
    [key: string]: TValue;
  };
  allIds: string[];
}
