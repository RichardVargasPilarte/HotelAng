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
import { Habitacion, IHabitacionResponse } from '../../../models/habitacion.model';
import { AlojamientoService } from '../../../services/alojamiento.service';
import { Alojamiento } from '../../../models/alojamiento.model';

interface DialogData {
  type: string;
  hab?: Habitacion | IHabitacionResponse;
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
    'Fuera_de_Servicio',
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
        id: new FormControl(-1),
        nombre: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25)
        ]),
        descripcion: new FormControl('', [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(150)
        ]),
        precio: new FormControl('', [
          Validators.required
        ]),
        activo: new FormControl('', Validators.required),
        numero_personas: new FormControl('', [
          Validators.required,
          Validators.minLength(1),
        ]),
        alojamiento_id: new FormControl(-1, Validators.required),
        eliminado: new FormControl('NO'),
      });
    } else {
      const habitacion: IHabitacionResponse = this.data.hab as IHabitacionResponse;
      this.form = this.fb.group({
        id: habitacion.id,
        nombre: new FormControl(habitacion.nombre, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25)
        ]),
        descripcion: new FormControl(habitacion.descripcion, [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(150)
        ]),
        precio: new FormControl(habitacion.precio, [
          Validators.required
        ]),
        activo: new FormControl(habitacion.activo, Validators.required),
        numero_personas: new FormControl(habitacion.numero_personas, [
          Validators.required,
          Validators.minLength(1),
        ]),
        alojamiento_id: new FormControl(
          habitacion.alojamiento_id.id,
          Validators.required
        ),
      });
    }
  }

  GuardarHabitacion(): void {
    let hab = new Habitacion();
    hab = Object.assign(hab, this.form.value);
    this.subs.push(
      this.habitacionServicio.Agregar(hab).subscribe(
        {
          next: (res) => {
            this.dialogRef.close();
            console.log(res);
          },
          error: (error: any) => console.log(error)
        }
      )
    );
  }

  ActualizarHabitacion(): void {
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
      )
    );
  }

  get Form(): any {
    return this.form.controls;
  }
}
