import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateParser, TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class MatPaginatorIntlService extends MatPaginatorIntl {
  private rangeLabel: string;
  private readonly I18N_KEYS = {
    PREVIOUS_PAGE: 'matPaginator.previousPage',
    NEXT_PAGE: 'matPaginator.nextPage',
    ITEMS_PER_PAGE: 'matPaginator.itemsPerPage',
    FIRST_PAGE: 'matPaginator.firstPage',
    LAST_PAGE: 'matPaginator.lastPage',
    RANGE: 'matPaginator.range'
  };

  constructor(
    private translateService: TranslateService,
    private translateParser: TranslateParser
  ) {
    super();
    this.getTranslations();
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    const processedLength = Math.max(length, 0);
    const startIndex = page * pageSize + 1;
    const endIndex = startIndex < processedLength
      ? Math.min(startIndex + pageSize - 1, processedLength)
      : startIndex + pageSize - 1;
    return this.translateParser.interpolate(
      this.rangeLabel,
      { startIndex, endIndex, length: processedLength }
    );
  }

  getTranslations = () => {
    this.translateService
      .get(Object.values(this.I18N_KEYS))
      .subscribe(translate => {
        this.previousPageLabel = translate[this.I18N_KEYS.PREVIOUS_PAGE];
        this.nextPageLabel = translate[this.I18N_KEYS.NEXT_PAGE];
        this.itemsPerPageLabel = translate[this.I18N_KEYS.ITEMS_PER_PAGE];
        this.firstPageLabel = translate[this.I18N_KEYS.FIRST_PAGE];
        this.lastPageLabel = translate[this.I18N_KEYS.LAST_PAGE];
        this.rangeLabel = translate[this.I18N_KEYS.RANGE];
        this.changes.next();
      });
  }
}
