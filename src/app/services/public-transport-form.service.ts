import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  PublicTransportFormComponent,
  PublicTransportFormData
} from '../components/public-transport-form/public-transport-form.component';

@Injectable({ providedIn: 'root' })
export class PublicTransportFormService {
  constructor(private dialog: MatDialog) { }

  openForm = (
    action: string,
    type: string,
    routeNumber: string,
    capacity: number,
    organizationName: string,
    onSubmit: (
      type: string,
      routeNumber: string,
      capacity: number,
      organizationName: string
    ) => void
  ) => {
    const formConfig = new MatDialogConfig<PublicTransportFormData>();
    formConfig.data = {
      action,
      type,
      routeNumber,
      capacity,
      organizationName,
      onSubmit
    };
    formConfig.width = '300px';
    this.dialog.open(PublicTransportFormComponent, formConfig);
  }
}
