import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  PublicTransportFormComponent,
  PublicTransportFormData
} from 'src/app/components/public-transport-form/public-transport-form.component';

@Injectable({ providedIn: 'root' })
export class PublicTransportFormService {
  constructor(private dialog: MatDialog) { }

  openForm = (
    action: string,
    onSubmit: (
      type: string,
      routeNumber: string,
      capacity: number,
      organizationName: string
    ) => void,
    type?: string,
    routeNumber?: string,
    capacity?: number,
    organizationName?: string
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
