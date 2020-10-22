import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PUBLIC_TRANSPORT_TYPE_MAPPING } from 'src/app/misc/constants';

export interface PublicTransportFormData {
  action: string;
  type: string;
  routeNumber: string;
  capacity: number;
  organizationName: string;
  onSubmit: (
    type: string,
    routeNumber: string,
    capacity: number,
    organizationName: string
  ) => void;
}

@Component({
  selector: 'app-public-transport-form',
  templateUrl: './public-transport-form.component.html',
  styleUrls: ['./public-transport-form.component.scss']
})
export class PublicTransportFormComponent implements OnInit {
  form: FormGroup;
  data: PublicTransportFormData;
  publicTransportTypeMapping = PUBLIC_TRANSPORT_TYPE_MAPPING;
  publicTransportTypes = Object.keys(this.publicTransportTypeMapping);

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PublicTransportFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: PublicTransportFormData
  ) {
    this.data = data;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      type: [this.data.type, [Validators.required]],
      routeNumber: [this.data.routeNumber, [Validators.required]],
      capacity: [this.data.capacity, [
        Validators.required,
        Validators.pattern(/^[1-9][0-9]*$/)
      ]],
      organizationName: [this.data.organizationName, [Validators.required]]
    });
  }

  isFieldErrorPresent = (fieldName: string, errorName: string) =>
    !!this.form.get(fieldName).hasError(errorName)

  save = () => {
    this.data.onSubmit(
      this.form.controls.type.value,
      this.form.controls.routeNumber.value,
      this.form.controls.capacity.value,
      this.form.controls.organizationName.value
    );
    this.close();
  }

  close = () => this.dialogRef.close();
}
