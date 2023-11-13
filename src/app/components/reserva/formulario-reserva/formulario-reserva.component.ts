import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ReservaService } from '../../../services/reserva.service';

import { HabitacionService } from '../../../services/habitacion.service';
import { Habitacion } from '../../../models/habitacion.model';

import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { DatePipe } from '@angular/common';
import { IReservaResponse, Reserva } from 'src/app/models/reserva.model';

interface DialogData {
  type: string;
  reserv?: Reserva | IReservaResponse;
}

@Component({
  selector: 'app-formulario-reserva',
  templateUrl: './formulario-reserva.component.html',
  styleUrls: ['./formulario-reserva.component.scss']
})
export class FormularioReservaComponent implements OnInit, OnDestroy {
  public reserva: Reserva = new Reserva();
  // public clientes: any[] = [{
  //   nombre: 'nombre',
  //   id: 'nomb'
  // },
  // {
  //   nombre: 'nombre2',
  //   id: 'nomb2'
  // }];
  public habitaciones: Habitacion[] = [];
  subs: Subscription[] = [];
  public selected?= '0';
  public form!: FormGroup;
  public refCliente!: Observable<any>;
  public refHabitacion!: Observable<any>;
  public clientes: Cliente[] = [];

  TipoPago: string[] = [
    ("Tarjeta Debito"),
    ("Tarjeta Credito"),
    ("Efectivo")
  ];

  constructor(
    private reservaServicio: ReservaService,
    public clienteServicio$: ClienteService,
    public habitacionServicio$: HabitacionService,
    public dialogRef: MatDialogRef<FormularioReservaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.clientes = this.clienteServicio$.list;
    this.habitaciones = this.habitacionServicio$.list;
    this.refCliente = this.clienteServicio$.getList();
    this.refHabitacion = this.habitacionServicio$.getList();
    // this.selected = this.clientes[0].id;
    // this.selected = this.habitaciones[0].id;
  }

  ngOnInit(): void {
    this.subs.push(
      this.refCliente.subscribe(
        (clients) => (this.clientes = clients)
      ),
      // this.subs.push(
      //   this.refHabitacion.subscribe(
      //     (habs) => (this.habitaciones = habs)
      //   )
      // )
    );
    this.createForm();
    // this.changeLocale();
  }

  // changeLocale(){
  //   this.adapter.setLocale('es');
  // }

  ngOnDestroy(): void {
    this.clientes = [];
    this.habitaciones = [];
    this.subs.map((sub) => sub.unsubscribe());
  }

  createForm(id?: string): void {
    if (this.data.type === 'c') {
      this.form = this.fb.group({
        id: new FormControl(-1),
        cliente_id: new FormControl(-1, Validators.required),
        habitacion_id: new FormControl(-1, Validators.required),
        fecha_inicio: new FormControl('', Validators.required),
        fecha_fin: new FormControl('', Validators.required),
        tipo_pago: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        // pago_choices: new FormControl('', Validators.required),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(15), Validators.maxLength(150)]),
        eliminado: new FormControl('NO'),
      });
    } else {
      const reserva: IReservaResponse = this.data.reserv as IReservaResponse;
      this.form = this.fb.group({
        id: reserva.id,
        cliente_id: new FormControl(
          reserva.cliente_id.id,
          Validators.required
        ),
        habitacion_id: new FormControl(
          reserva.habitacion_id.id,
          Validators.required
        ),
        fecha_inicio: new FormControl(reserva.fecha_inicio, Validators.required),
        fecha_fin: new FormControl(reserva.fecha_fin, Validators.required),
        tipo_pago: new FormControl(reserva.tipo_pago, [
          Validators.required,
          Validators.minLength(6),
        ]),
        // pago_choices: new FormControl(rserva.pago_choices, Validators.required),
        descripcion: new FormControl(reserva.descripcion, [Validators.required, Validators.minLength(15), Validators.maxLength(150)]),
      });
    }
  }

  GuardarReserva(): void {
    let reserva = new Reserva();
    reserva = Object.assign(reserva, this.form.value);
    reserva.fecha_inicio = this.dateFormat(reserva.fecha_inicio);
    reserva.fecha_fin = this.dateFormat(reserva.fecha_fin)
    this.subs.push(
      this.reservaServicio.AddReservations(reserva).subscribe(
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
    let reserv = new Reserva();
    reserv = Object.assign(reserv, this.form.value);
    this.subs.push(
      this.reservaServicio.updateReservation(reserv.id!, reserv).subscribe(
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

  dateFormat(date: string, format = 'yyyy-MM-dd'): string {
    return this.datePipe.transform(date, format) || '';
  }

  get Form(): any {
    return this.form.controls;
  }

}
