import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AlojamientoService } from '../../../services/alojamiento.service';
import { Alojamiento, IAlojamientoResponse } from '../../../Models/alojamiento.model';

interface DialogData {
  type: string;
  alojam?: Alojamiento | IAlojamientoResponse;
}

@Component({
  selector: 'app-formulario-alojamiento',
  templateUrl: './formulario-alojamiento.component.html',
  styleUrls: ['./formulario-alojamiento.component.scss'],
})
export class FormularioAlojamientoComponent {
  public alojamientos = new Alojamiento();
  public edit!: boolean;
  subs: Subscription[] = [];
  public selected = '0';
  public form!: FormGroup;

  constructor(
    private alojamientoServicio: AlojamientoService,
    public dialogRef: MatDialogRef<FormularioAlojamientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.createForm()
  }

  createForm(id?: string): void {
    if (this.data.type === 'c') {
      this.form = this.fb.group({
        id: new FormControl(0),
        nombre: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25)
        ]),
        descripcion: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(150)
        ]),
        tiempo_estadia: new FormControl('', [
          Validators.required,
          Validators.minLength(1),
        ]),
        eliminado: new FormControl('NO'),
      });
    } else {
      const alojamiento: IAlojamientoResponse = this.data.alojam as IAlojamientoResponse;
      this.form = this.fb.group({
        id: alojamiento.id,
        nombre: new FormControl(alojamiento.nombre, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25)
        ]),
        descripcion: new FormControl(alojamiento.descripcion, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(150)
        ]),
        tiempo_estadia: new FormControl(alojamiento.tiempo_estadia, [
          Validators.required,
          Validators.minLength(1),
        ]),
        eliminado: new FormControl('NO'),
      });
    }
  }

  saveAccommodation(): void {
    let alojam = new Alojamiento();
    alojam = Object.assign(alojam, this.form.value);
    this.subs.push(
      this.alojamientoServicio.addAccommodations(alojam).subscribe(
        {
          next: () => {
            this.dialogRef.close();
          },
          error: (error: unknown) => console.log('Hubo un error' + error)
        }
      )
    );
  }

  updateAccommodation(): void {
    let alojam = new Alojamiento();
    alojam = Object.assign(alojam, this.form.value);
    this.subs.push(
      this.alojamientoServicio
        .updateAccommodation(alojam.id!, alojam)
        .subscribe(
          {
            next: () => {
              this.dialogRef.close();
              (error: unknown) => console.log('Hubo un error' + error)
            }
          }
        )
    );
  }

  get Form(): unknown {
    return this.form.controls;
  }
}
