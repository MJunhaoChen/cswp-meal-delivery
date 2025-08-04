export interface ApiMetaInfo {
  type: 'object' | 'list' | 'none';
  count: number;
}

export interface ApiResponse<T> {
  results?: T[] | T;
  info: ApiMetaInfo;
}
