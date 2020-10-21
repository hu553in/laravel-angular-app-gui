export const API_METHODS = {
  PUBLIC_TRANSPORT: 'public_transport',
  ORGANIZATION_NAME: 'organization_name',
  SIGN_IN: 'sign_in',
  SIGN_UP: 'sign_up',
};

export const ROUTES = {
  DEFAULT: '',
  PUBLIC_TRANSPORT: 'public_transport',
  SIGN_IN: 'sign_in',
  SIGN_UP: 'sign_up',
};

export const ROWS_OPTIONS = [10, 25, 50, 100];

export const DEFAULT_ROWS = 10;

export const DEFAULT_PAGE = 1;

export const PUBLIC_TRANSPORT_TABLE_COLUMNS = [
  'actions',
  'id',
  'type',
  'route_number',
  'capacity',
  'organization_name',
  'created_at',
  'updated_at',
];

export enum PUBLIC_TRANSPORT_TABLE_ACTION_TYPES {
  EDIT = 0,
  DELETE = 1,
}

export const PUBLIC_TRANSPORT_TYPE_MAPPING = {
  bus: 'Bus',
  trolleybus: 'Trolleybus',
  route_taxi: 'Route taxi',
  tram: 'Tram',
};
