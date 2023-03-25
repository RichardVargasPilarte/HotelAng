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
import { Reserva } from '../../../Models/reserva.model';

import { HabitacionService } from '../../../services/habitacion.service';
import { Habitacion } from '../../../Models/habitacion.model';

import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../Models/cliente.model';
import { DateAdapter } from '@angular/material/core';

interface DialogData {
  type: string;
  resv?: Reserva;
}

@Component({
  selector: 'app-formulario-reserva',
  templateUrl: './formulario-reserva.component.html',
  styleUrls: ['./formulario-reserva.component.scss']
})
export class FormularioReservaComponent implements OnInit, OnDestroy {
  public reservas: Reserva = new Reserva();
  public clientes: Cliente[] = [];
  public habitaciones: Habitacion[] =[];
  subs: Subscription[] = [];
  public selected? = '0';
  public form!: FormGroup;
  public refCliente!: Observable<any>;
  public refHabitacion!: Observable<any>;

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
    private adapter: DateAdapter<any>
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
        id: new FormControl(0),
        nombre_cliente: new FormControl('', Validators.required),
        nombre_habitacion: new FormControl('', Validators.required),
        fecha_inicio: new FormControl('', Validators.required),
        fecha_fin: new FormControl('', Validators.required),
        tipo_pago: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        pago_choices: new FormControl('', Validators.required),
        num_tarjeta: new FormControl('', [Validators.maxLength(25)]),
        nombre_cliente_id: new FormControl(0),
        nombre_habitacion_id: new FormControl(0),
        descripcion: new FormControl('', [Validators.required, Validators.minLength(15) ,Validators.maxLength(150)]),
        eliminado: new FormControl('NO'),
      });
    } else {
      this.form = this.fb.group({
        id: this.data.resv!.id,
        nombre_cliente: new FormControl(
          this.data.resv!.nombre_cliente,
          Validators.required
        ),
        nombre_habitacion: new FormControl(
          this.data.resv!.nombre_habitacion,
          Validators.required
        ),
        fecha_inicio: new FormControl(this.data.resv!.fecha_inicio, Validators.required),
        fecha_fin: new FormControl(this.data.resv!.fecha_fin, Validators.required),
        tipo_pago: new FormControl(this.data.resv!.tipo_pago, [
          Validators.required,
          Validators.minLength(6),
        ]),
        pago_choices: new FormControl(this.data.resv!.pago_choices, Validators.required),
        num_tarjeta: new FormControl(this.data.resv!.num_tarjeta, [Validators.required, Validators.maxLength(25)]),
        nombre_cliente_id: new FormControl(
          this.data.resv!.nombre_cliente
        ),
        nombre_habitacion_id: new FormControl(
          this.data.resv!.nombre_habitacion
        ),
        descripcion: new FormControl(this.data.resv!.descripcion, [Validators.required, Validators.minLength(15) ,Validators.maxLength(150)]),
      });
    }
  }

  GuardarReserva(): void {
    let reserv = new Reserva();
    reserv = Object.assign(reserv, this.form.value);
    this.subs.push(
      this.reservaServicio.Agregar(reserv).subscribe(
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
      this.reservaServicio.ActualizarReserva(reserv.id!, reserv).subscribe(
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
