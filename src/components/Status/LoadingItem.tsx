export enum LoadingItemType {
  Quote,
  Fact,
}

export interface LoadingItemData {
  text: string;
  source: string;
  link: string;
  type: LoadingItemType;
}
