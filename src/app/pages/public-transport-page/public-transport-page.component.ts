import { Component, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Subscription } from 'rxjs';
import {
  PublicTransportTableComponent,
  TableAction
} from 'src/app/components/public-transport-table/public-transport-table.component';
import {
  PUBLIC_TRANSPORT_FORM_ACTION_MAPPING,
  PUBLIC_TRANSPORT_TABLE_ACTIONS,
  PUBLIC_TRANSPORT_TABLE_COLUMNS
} from 'src/app/misc/constants';
import { GetAllPublicTransportResponse } from 'src/app/models/get-all-public-transport-response.model';
import { PublicTransport } from 'src/app/models/public-transport.model';
import { OrganizationNameService } from 'src/app/services/organization-name.service';
import { PublicTransportFormService } from 'src/app/services/public-transport-form.service';
import { PublicTransportService } from 'src/app/services/public-transport.service';

@Component({
  selector: 'app-public-transport-page',
  templateUrl: './public-transport-page.component.html',
  styleUrls: ['./public-transport-page.component.scss']
})
export class PublicTransportPageComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private readonly dateFnsLocalesForLangs = { en: enUS };
  data: GetAllPublicTransportResponse = {
    _meta: {
      total: 0,
      rows: 0,
      total_pages: 0
    },
    paginated_data: []
  };
  organizationNames: string[] = [];

  @ViewChild(PublicTransportTableComponent)
  publicTransportTableComponent: PublicTransportTableComponent;

  constructor(
    public publicTransportService: PublicTransportService,
    private organizationNameService: OrganizationNameService,
    private publicTransportFormService: PublicTransportFormService,
    private translateService: TranslateService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private getDateFnsLocaleForLang(lang: string): Locale {
    const locale = this.dateFnsLocalesForLangs[lang];
    return locale ? locale : enUS;
  }

  onUpdateSubmit = (
    id: number,
    type: string,
    routeNumber: string,
    capacity: number,
    organizationName: string
  ) => {
    this.subscriptions.push(
      this.publicTransportService
        .updateById(id, {
          type,
          route_number: routeNumber,
          capacity,
          organization_name: organizationName
        })
        .subscribe((_) => this.loadData(
          this.publicTransportTableComponent.state.page,
          this.publicTransportTableComponent.state.rows,
          this.publicTransportTableComponent.state.sortBy,
          this.publicTransportTableComponent.state.order,
          this.publicTransportTableComponent.state.type,
          this.publicTransportTableComponent.state.organizationName
        ))
    );
  }

  handleClickTableAction = (action: TableAction, row: PublicTransport) => {
    switch (action.type) {
      case PUBLIC_TRANSPORT_TABLE_ACTIONS.EDIT: {
        this.publicTransportFormService.openForm(
          PUBLIC_TRANSPORT_FORM_ACTION_MAPPING.EDIT,
          (
            type: string,
            routeNumber: string,
            capacity: number,
            organizationName: string
          ) => this.onUpdateSubmit(
            row.id,
            type,
            routeNumber,
            capacity,
            organizationName
          ),
          row.type,
          row.route_number,
          row.capacity,
          row.organization_name
        );
        break;
      }
      case PUBLIC_TRANSPORT_TABLE_ACTIONS.DELETE: {
        this.subscriptions.push(
          this.publicTransportService
            .deleteById(row.id)
            .subscribe((_) => this.loadData(
              this.publicTransportTableComponent.state.page,
              this.publicTransportTableComponent.state.rows,
              this.publicTransportTableComponent.state.sortBy,
              this.publicTransportTableComponent.state.order,
              this.publicTransportTableComponent.state.type,
              this.publicTransportTableComponent.state.organizationName
            ))
        );
        break;
      }
    }
  }

  getTableProps(): object {
    return {
      data: this.data.paginated_data,
      organizationNames: this.organizationNames,
      headers: PUBLIC_TRANSPORT_TABLE_COLUMNS,
      rows: this.data._meta.rows,
      total: this.data._meta.total,
      loadData: this.loadData,
      onClickTableAction: this.handleClickTableAction
    };
  }

  loadData = (
    page: number,
    rows: number,
    sortBy?: string,
    order?: string,
    type?: string[],
    organizationName?: string[]
  ) => {
    this.subscriptions.push(
      this.publicTransportService
        .getAll({ page, rows, sortBy, order, type, organizationName })
        .subscribe(publicTransportResponse => {
          const currentLang = this.translateService.currentLang;
          const locale = this.getDateFnsLocaleForLang(currentLang);
          const datetimeFormat = 'PPpp';
          this.data = {
            _meta: publicTransportResponse.data._meta,
            paginated_data: publicTransportResponse.data.paginated_data.map(
              (publicTransport: PublicTransport) => ({
                ...publicTransport,
                actions: [
                  { type: PUBLIC_TRANSPORT_TABLE_ACTIONS.EDIT },
                  { type: PUBLIC_TRANSPORT_TABLE_ACTIONS.DELETE },
                ],
                created_at: format(
                  new Date(publicTransport.created_at),
                  datetimeFormat,
                  { locale }
                ),
                updated_at: format(
                  new Date(publicTransport.updated_at),
                  datetimeFormat,
                  { locale }
                )
              })
            )
          };
          this.subscriptions.push(
            this.organizationNameService
              .getAll()
              .subscribe(organizationNameResponse => (
                this.organizationNames = organizationNameResponse.data
              ))
          );
        })
    );
  }
}
