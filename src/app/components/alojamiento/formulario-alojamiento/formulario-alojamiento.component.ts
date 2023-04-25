import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AlojamientoService } from '../../../services/alojamiento.service';
import { Alojamiento } from '../../../models/alojamiento.model';

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
  public form!: FormGroup;

  constructor(
    private alojamientoServicio: AlojamientoService,
    public dialogRef: MatDialogRef<FormularioAlojamientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.createForm()
  }

  ngOnInit(): void {}

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
      this.form = this.fb.group({
        id: this.data.alojam!.id,
        nombre: new FormControl(this.data.alojam!.nombre, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25)
        ]),
        descripcion: new FormControl(this.data.alojam!.descripcion, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(150)
        ]),
        tiempo_estadia: new FormControl(this.data.alojam!.tiempo_estadia, [
          Validators.required,
          Validators.minLength(1),
        ]),
        eliminado: new FormControl('NO'),
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
          },
          error: (error: any) => console.log('Hubo un error' + error)
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
