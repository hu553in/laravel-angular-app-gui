import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DEFAULT_PAGE,
  DEFAULT_ROWS,
  PUBLIC_TRANSPORT_TABLE_ACTION_TYPES,
  PUBLIC_TRANSPORT_TABLE_COLUMNS,
  PUBLIC_TRANSPORT_TYPE_MAPPING
} from 'src/app/misc/constants';
import { GetAllPublicTransportResponse } from 'src/app/models/get-all-public-transport-response.model';
import { PublicTransport } from 'src/app/models/public-transport.model';
import { OrganizationNameService } from 'src/app/services/organization-name.service';
import { PublicTransportService } from 'src/app/services/public-transport.service';
import { TableAction } from '../../public-transport-table/public-transport-table.component';

@Component({
  selector: 'app-public-transport-page',
  templateUrl: './public-transport-page.component.html',
  styleUrls: ['./public-transport-page.component.scss'],
})
export class PublicTransportPageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  data: GetAllPublicTransportResponse = {
    _meta: {
      total: 0,
      rows: 0,
      total_pages: 0,
    },
    paginated_data: [],
  };
  organizationNames: string[] = [];

  constructor(
    public publicTransportService: PublicTransportService,
    private organizationNameService: OrganizationNameService
  ) { }

  ngOnInit(): void {
    this.loadData(DEFAULT_PAGE, DEFAULT_ROWS, 'id', 'asc', [], []);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleTableActionClick = (action: TableAction, row: PublicTransport) => {
    switch (action.type) {
      case PUBLIC_TRANSPORT_TABLE_ACTION_TYPES.EDIT: {
        // TODO: implement edit feature
        break;
      }
      case PUBLIC_TRANSPORT_TABLE_ACTION_TYPES.DELETE: {
        const pageFromMeta = this.data._meta.page;
        const page = pageFromMeta ? pageFromMeta : DEFAULT_PAGE;
        this.subscriptions.push(
          this.publicTransportService
            .deleteById(row.id)
            .subscribe((_) => this.loadData(
              page,
              this.data._meta.rows,
              'id',
              'asc',
              null,
              null
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
      onChange: this.loadData,
      onTableActionClick: this.handleTableActionClick,
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
    this.loadPublicTransport(page, rows, sortBy, order, type, organizationName);
    this.loadOrganizationNames();
  }

  loadPublicTransport = (
    page: number,
    rows: number,
    sortBy: string,
    order: string,
    type: string[],
    organizationName: string[]
  ) => this.subscriptions.push(
    this.publicTransportService
      .getAll({ page, rows, sortBy, order, type, organizationName })
      .subscribe(response => (this.data = {
        _meta: response.data._meta,
        paginated_data: response.data.paginated_data.map(
          (publicTransport: PublicTransport) => ({
            ...publicTransport,
            type: PUBLIC_TRANSPORT_TYPE_MAPPING[publicTransport.type],
            actions: [
              { type: PUBLIC_TRANSPORT_TABLE_ACTION_TYPES.EDIT },
              { type: PUBLIC_TRANSPORT_TABLE_ACTION_TYPES.DELETE },
            ],
          })
        ),
      }))
  )

  loadOrganizationNames = () => this.subscriptions.push(
    this.organizationNameService
      .getAll()
      .subscribe(response => (this.organizationNames = response.data))
  )
}
