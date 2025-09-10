export interface PagedEntityWrapper<ENTITY, KEY extends string> {
  _embedded: {
    [key in KEY]: ENTITY[]
  },
  _links: {
    first: { href: string },
    self: { href: string },
    next: { href: string },
    last: { href: string }
  }
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }
}
