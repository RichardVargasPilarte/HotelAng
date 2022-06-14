import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { HabitacionService } from '../../../services/habitacion.service';
import { Habitacion } from '../../../Models/habitacion.model';
import { AlojamientoService } from '../../../services/alojamiento.service';
import { Alojamiento } from '../../../Models/alojamiento.model';

interface DialogData {
  type: string;
  hab?: Habitacion;
}

@Component({
  selector: 'app-formulario-habitacion',
  templateUrl: './formulario-habitacion.component.html',
  styleUrls: ['./formulario-habitacion.component.scss'],
})
export class FormularioHabitacionComponent implements OnInit, OnDestroy {
  public habitaciones: Habitacion = new Habitacion();
  public AlojamientosCargados: Alojamiento[] = [];
  public edit!: boolean;
  subs: Subscription[] = [];
  public selected? = '0';
  public form!: FormGroup;
  public refAloajamiento!: Observable<any>;

  EstadoHabitaciones: string[] = [
    'Disponible',
    'Reservada',
    'Fuera de Servicio',
  ];

  constructor(
    private habitacionServicio: HabitacionService,
    public alojamiento$: AlojamientoService,
    public dialogRef: MatDialogRef<FormularioHabitacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.AlojamientosCargados = this.alojamiento$.list;
    this.refAloajamiento = this.alojamiento$.getList();
    this.selected = this.AlojamientosCargados[0].id;
  }

  ngOnInit(): void {
    this.subs.push(
      this.refAloajamiento.subscribe(
        (alojs) => (this.AlojamientosCargados = alojs)
      )
    );
    this.createForm();
  }

  ngOnDestroy(): void {
    this.AlojamientosCargados = [];
    this.subs.map((sub) => sub.unsubscribe());
  }

  createForm(id?: string): void {
    if (this.data.type === 'c') {
      this.form = this.fb.group({
        id: new FormControl(0),
        nombre: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        descripcion: new FormControl('', [
          Validators.required,
          Validators.minLength(15),
        ]),
        precio: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
        ]),
        activo: new FormControl('', Validators.required),
        numero_personas: new FormControl('', [
          Validators.required,
          Validators.minLength(1),
        ]),
        nombre_alojamiento: new FormControl('', Validators.required),
        nombre_alojamiento_id: new FormControl(0),
        eliminado: new FormControl('NO'),
      });
    } else {
      this.form = this.fb.group({
        id: this.data.hab!.id,
        nombre: new FormControl(this.data.hab!.nombre, [
          Validators.required,
          Validators.minLength(5),
        ]),
        descripcion: new FormControl(this.data.hab!.descripcion, [
          Validators.required,
          Validators.minLength(15),
        ]),
        precio: new FormControl(this.data.hab!.precio, [
          Validators.required,
          Validators.minLength(2),
        ]),
        activo: new FormControl(this.data.hab!.activo, Validators.required),
        numero_personas: new FormControl(this.data.hab!.numero_personas, [
          Validators.required,
          Validators.minLength(1),
        ]),
        nombre_alojamiento: new FormControl(
          this.data.hab!.nombre_alojamiento,
          Validators.required
        ),
        nombre_alojamiento_id: new FormControl(
          this.data.hab!.nombre_alojamiento
        ),
      });
    }
  }

  saveHabitacion(): void {
    let hab = new Habitacion();
    hab = Object.assign(hab, this.form.value);
    this.subs.push(
      this.habitacionServicio.Agregar(hab).subscribe(
        {
          next: (res) => {
            this.dialogRef.close();
            console.log(res),
            (error: any) => console.log(error);
          }
        }
        // (res) => {
        //   this.dialogRef.close();
        //   console.log(res);
        // },
        // (error) => console.error(error)
      )
    );
  }

  updateHabitacion(): void {
    let hab = new Habitacion();
    hab = Object.assign(hab, this.form.value);
    this.subs.push(
      this.habitacionServicio.ActualizarHabitacion(hab.id!, hab).subscribe(
        {
          next: (res) => {
            this.dialogRef.close();
            console.log(res),
            (error: any) => console.error(error);
          },
        }
        // res => this.dialogRef.close(),
        // error => console.error(error),
      )
    );
  }

  get Form(): any {
    return this.form.controls;
  }
}
