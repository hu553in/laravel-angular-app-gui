import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import {
  DEFAULT_PAGE,
  DEFAULT_ROWS,
  PUBLIC_TRANSPORT_FORM_ACTION_MAPPING,
  PUBLIC_TRANSPORT_TABLE_ACTIONS,
  PUBLIC_TRANSPORT_TABLE_COLUMNS,
  PUBLIC_TRANSPORT_TYPES,
  ROWS_OPTIONS
} from 'src/app/misc/constants';
import { PublicTransport } from 'src/app/models/public-transport.model';
import { PublicTransportFormService } from 'src/app/services/public-transport-form.service';
import { PublicTransportService } from 'src/app/services/public-transport.service';

export interface TableAction {
  type: PUBLIC_TRANSPORT_TABLE_ACTIONS;
  name: string;
}

export interface PublicTransportTableState {
  page: number;
  rows: number;
  sortBy: string;
  order: string;
  type?: string[];
  organizationName?: string[];
}

@Component({
  selector: 'app-public-transport-table',
  templateUrl: './public-transport-table.component.html',
  styleUrls: ['./public-transport-table.component.scss']
})
export class PublicTransportTableComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  readonly columns = PUBLIC_TRANSPORT_TABLE_COLUMNS;
  readonly rowsOptions = ROWS_OPTIONS;
  publicTransportTableActions = PUBLIC_TRANSPORT_TABLE_ACTIONS;
  publicTransportTypes = PUBLIC_TRANSPORT_TYPES;
  typeSelectFormControl = new FormControl();
  organizationNameSelectFormControl = new FormControl();
  state: PublicTransportTableState = {
    page: DEFAULT_PAGE,
    rows: DEFAULT_ROWS,
    sortBy: 'id',
    order: 'asc',
    type: [],
    organizationName: []
  };

  @Input()
  props: {
    data: PublicTransport[];
    organizationNames: string[];
    headers: string[];
    rows: number;
    total: number;
    loadData: (
      page: number,
      rows: number,
      sortBy: string,
      order: string,
      type: string[],
      organizationName: string[]
    ) => void;
    onClickTableAction: (action: TableAction, row: PublicTransport) => void;
  };

  constructor(
    public publicTransportService: PublicTransportService,
    private publicTransportFormService: PublicTransportFormService
  ) { }

  ngOnInit(): void {
    this.callLoadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onCreateSubmit = (
    type: string,
    routeNumber: string,
    capacity: number,
    organizationName: string
  ) => {
    this.subscriptions.push(
      this.publicTransportService
        .add({
          type,
          route_number: routeNumber,
          capacity,
          organization_name: organizationName
        })
        .subscribe((_) => this.callLoadData())
    );
  }

  onAddButtonClick = () => this.publicTransportFormService.openForm(
    PUBLIC_TRANSPORT_FORM_ACTION_MAPPING.CREATE,
    this.onCreateSubmit
  )

  onPaginatorStateChange = (event: PageEvent) => {
    this.state = {
      ...this.state,
      page: event.pageIndex + 1,
      rows: event.pageSize
    };
    this.callLoadData();
  }

  onTypeSelectStateChange = (event: MatSelectChange) => {
    this.state.type = event.value;
    this.callLoadData();
  }

  onOrganizationNameSelectStateChange = (event: MatSelectChange) => {
    this.state.organizationName = event.value;
    this.callLoadData();
  }

  onSortStateChange = (event: Sort) => {
    this.state = {
      ...this.state,
      sortBy: event.active,
      order: event.direction
    };
    this.callLoadData();
  }

  callLoadData = () => {
    const { page, rows, sortBy, order, type, organizationName } = this.state;
    this.props.loadData(page, rows, sortBy, order, type, organizationName);
  }

  onClickTableAction = (action: TableAction, row: PublicTransport) =>
    this.props.onClickTableAction(action, row)
}
