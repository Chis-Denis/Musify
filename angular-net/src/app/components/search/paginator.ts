export class Paginator<T> {
  private _items: T[] = [];
  private _perPage = 7;
  private _currentPage = 1;

  constructor(items: T[] = [], perPage: number = 13) {
    this._items = items;
    this._perPage = perPage;
  }

  set items(items: T[]) {
    this._items = items;
    this._currentPage = 1;
  }

  get items(): T[] {
    return this._items;
  }

  get perPage(): number {
    return this._perPage;
  }

  set perPage(val: number) {
    this._perPage = val;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  get totalPages(): number {
    return Math.ceil(this._items.length / this._perPage) || 1;
  }

  get paginatedItems(): T[] {
    const start = (this._currentPage - 1) * this._perPage;
    return this._items.slice(start, start + this._perPage);
  }

  nextPage(): void {
    this._currentPage = this._currentPage < this.totalPages ? this._currentPage + 1 : 1;
  }

  prevPage(): void {
    this._currentPage = this._currentPage > 1 ? this._currentPage - 1 : this.totalPages;
  }
}
