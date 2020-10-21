import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import {
  DEFAULT_PAGE,
  DEFAULT_ROWS,
  PUBLIC_TRANSPORT_TABLE_ACTION_TYPES,
  PUBLIC_TRANSPORT_TABLE_COLUMNS,
  PUBLIC_TRANSPORT_TYPE_MAPPING,
  ROWS_OPTIONS
} from 'src/app/misc/constants';
import { PublicTransport } from 'src/app/models/public-transport.model';
import { PublicTransportService } from 'src/app/services/public-transport.service';

export interface TableAction {
  type: PUBLIC_TRANSPORT_TABLE_ACTION_TYPES;
  name: string;
}

interface State {
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
  styleUrls: ['./public-transport-table.component.scss'],
})
export class PublicTransportTableComponent {
  readonly columns = PUBLIC_TRANSPORT_TABLE_COLUMNS;
  readonly rowsOptions = ROWS_OPTIONS;
  state: State = {
    page: DEFAULT_PAGE,
    rows: DEFAULT_ROWS,
    sortBy: 'id',
    order: 'asc',
    type: [],
    organizationName: [],
  };
  publicTransportTypeMapping = PUBLIC_TRANSPORT_TYPE_MAPPING;
  publicTransportTypes = Object.keys(this.publicTransportTypeMapping);
  typeSelectFormControl = new FormControl();
  organizationNameSelectFormControl = new FormControl();

  constructor(public publicTransportService: PublicTransportService) { }

  @Input()
  props: {
    data: PublicTransport[];
    organizationNames: string[];
    headers: string[];
    rows: number;
    total: number;
    onChange: (
      page: number,
      rows: number,
      sortBy: string,
      order: string,
      type: string[],
      organizationName: string[]
    ) => void;
    onTableActionClick: (action: TableAction, row: PublicTransport) => void;
  };

  onPaginatorStateChange = (event: PageEvent) => {
    this.state = {
      ...this.state,
      page: event.pageIndex + 1,
      rows: event.pageSize,
    };
    this.callPropsOnChange();
  }

  onTypeSelectStateChange = (event: MatSelectChange) => {
    this.state = {
      ...this.state,
      type: event.value,
    };
    this.callPropsOnChange();
  }

  onOrganizationNameSelectStateChange = (event: MatSelectChange) => {
    this.state = {
      ...this.state,
      organizationName: event.value,
    };
    this.callPropsOnChange();
  }

  onSortStateChange = (event: Sort) => {
    this.state = {
      ...this.state,
      sortBy: event.active,
      order: event.direction,
    };
    this.callPropsOnChange();
  }

  callPropsOnChange = () => {
    const { page, rows, sortBy, order, type, organizationName } = this.state;
    this.props.onChange(page, rows, sortBy, order, type, organizationName);
  }

  onTableActionClick = (action: TableAction, row: PublicTransport) =>
    this.props.onTableActionClick(action, row)
}
