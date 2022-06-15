import { Component, OnInit, Inject } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AlojamientoService } from '../../../services/alojamiento.service';
import { Alojamiento } from '../../../Models/alojamiento.model';

interface DialogData {
  type: string;
  alojam?: Alojamiento;
}

@Component({
  selector: 'app-formulario-alojamiento',
  templateUrl: './formulario-alojamiento.component.html',
  styleUrls: ['./formulario-alojamiento.component.scss'],
})
export class FormularioAlojamientoComponent implements OnInit {
  public alojamientos = new Alojamiento();
  public edit!: boolean;
  subs: Subscription[] = [];
  public selected = '0';
  public form!: UntypedFormGroup;

  constructor(
    private alojamientoServicio: AlojamientoService,
    public dialogRef: MatDialogRef<FormularioAlojamientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {}

  createForm(id?: string): void {
    if (this.data.type === 'c') {
      this.form = this.fb.group({
        id: new UntypedFormControl(0),
        nombre: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        descripcion: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(10),
        ]),
        tiempo_estadia: new UntypedFormControl('', [
          Validators.required,
          Validators.minLength(1),
        ]),
        eliminado: new UntypedFormControl('NO'),
      });
    } else {
      this.form = this.fb.group({
        id: this.data.alojam!.id,
        nombre: new UntypedFormControl(this.data.alojam!.nombre, [
          Validators.required,
          Validators.minLength(8),
        ]),
        descripcion: new UntypedFormControl(this.data.alojam!.descripcion, [
          Validators.required,
          Validators.minLength(10),
        ]),
        tiempo_estadia: new UntypedFormControl(this.data.alojam!.tiempo_estadia, [
          Validators.required,
          Validators.minLength(1),
        ]),
        eliminado: new UntypedFormControl('NO'),
      });
    }
  }

  GuardarAlojamiento(): void {
    let alojam = new Alojamiento();
    alojam = Object.assign(alojam, this.form.value);
    this.subs.push(
      this.alojamientoServicio.Agregar(alojam).subscribe(
        // (res) => this.dialogRef.close(),
        // (error) => console.log('Hubo un error' + error)

        {
          next: (res) => {
            this.dialogRef.close();
            (error: any) => console.log('Hubo un error' + error)
          }
        }
      )
    );
  }

  ActualizarAlojamiento(): void {
    let alojam = new Alojamiento();
    alojam = Object.assign(alojam, this.form.value);
    this.subs.push(
      this.alojamientoServicio
        .ActualizarAlojamiento(alojam.id!, alojam)
        .subscribe(
          // (res) => this.dialogRef.close(),
          // (error) => console.log('Hubo un error' + error)

          {
            next: (res) => {
              this.dialogRef.close();
              (error: any) => console.log('Hubo un error' + error)
            }
          }
        )
    );
  }

  get Form(): any {
    return this.form.controls;
  }
}
