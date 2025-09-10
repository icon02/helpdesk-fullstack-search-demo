export interface SearchHit {
  language: string;
  url: string;
  entityClassName: string;
  entityId: string;
  title: string;
  snippet: string;
  score: number;
}

export type SearchHitList = SearchHit[];
