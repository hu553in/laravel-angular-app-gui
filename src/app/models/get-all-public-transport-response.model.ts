import { Meta } from './meta.model';
import { PublicTransport } from './public-transport.model';

export interface GetAllPublicTransportResponse {
  _meta: Meta;
  paginated_data: PublicTransport[];
}
