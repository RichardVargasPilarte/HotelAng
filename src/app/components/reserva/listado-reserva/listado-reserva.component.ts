import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Reserva } from '../../../models/reserva.model';
import { ReservaService } from '../../../services/reserva.service';
import { FormularioReservaComponent } from '../formulario-reserva/formulario-reserva.component';

import { Habitacion } from '../../../models/habitacion.model';
import { HabitacionService } from '../../../services/habitacion.service';

import { RedirIfFailPipe } from '../../../pipes/redir-if-fail.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-listado-reserva',
  templateUrl: './listado-reserva.component.html',
  styleUrls: ['./listado-reserva.component.scss']
})
export class ListadoReservaComponent implements OnInit, OnDestroy {

  public reservas: Reserva[] = []; // propiedad encarga de interactuar con el modelo Reserva
  public habitaciones: Habitacion[] = []; // propiedad encarga de interactuar con el modelo habitaciones
  public subs: Subscription[] = [];
  sub: Subscription | undefined;
  private promesas: Promise<any>[] = [];
  public isLoaded = false;
  public dataSource: Reserva[] = [];
  refReserva!: Observable<any[]>;
  refHabitacion!: Observable<any[]>;
  socket!: WebSocket;

  displayedColumns: string[] = [
    'id',
    'nombre_cliente',
    'nombre_habitacion',
    'fecha_inicio',
    'fecha_fin',
    'tipo_pago',
    'actions',
  ];

  constructor(
    private reservaService: ReservaService,
    private habitacionservice$: HabitacionService,
    private dialog: MatDialog,
    private router: Router,
    private SpinnerService: NgxSpinnerService
  ) { this.promesas.push(
    new Promise<void>((resolve) => {
      const sub = this.reservaService.ListadoReservas().subscribe(
        {
          next: (resp) => {
            this.reservas.push(resp);
          },
          error: (error: any) => {
            console.log(error);
            console.log('Hubo un fallo al momento de traer los datos');
          },
          complete() {
            resolve();
          }
        }
      );
      this.subs.push(sub);
    })
  );

  this.promesas.push(
    new Promise<void>((resolve) => {
      const sub = this.habitacionservice$.ListadoHabitaciones().subscribe(
        {
          next: (resp) => {
            this.habitaciones.push(resp);
          },
          error: (error) => {
            console.log(error), 
            console.log('Hubo un fallo al momento de traer los datos');
          },
          complete: () => {
            resolve();
          }
        }
      );
      this.subs.push(sub);
    })
  );
  this.refReserva = this.reservaService.getList();
  // console.log(this.refReserva);
  this.refHabitacion = this.habitacionservice$.getList();
}

async ngOnInit(): Promise<void> {
  this.SpinnerService.show();
  Promise.all(this.promesas).then(() => {
    if (
      new RedirIfFailPipe().transform(
        'Habitaciones/Listado',
        this.habitaciones,
        this.router
      )
    ) {
      this.dataSource = this.reservas;
      console.log('estas son las reservas:', this.dataSource);
      this.isLoaded = true;
      this.subs.push();
      this.CloseDialog();
    }
  });
  this.refReserva.subscribe((data) => {
    this.reservas = data;
    // console.log('probando', data);
    this.dataSource = [];
    this.reservas.forEach((element) => {
      this.dataSource.push(element);
    });
    this.CloseDialog();
  });
}

  ngOnDestroy(): void {
    this.reservaService.list = [];
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  async eliminarRerserva(id: number): Promise<void> {
    const result:SweetAlertResult  = await Swal.fire({
      title: '¿Esta seguro de eliminar este dato?',
      text: '¡No se podra recuperar este dato luego de ser eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    })
    console.log(result)
    if(result.isConfirmed) {
      this.reservaService.BorrarRerserva(id).subscribe((data) => {
        console.log('Se elimino la habitación');
        // se debe mandar a llamar al servicio para que se actualice la lista de datos para obtener los datos registrados
        console.log(data);
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      (error: string) =>
      console.log('Hubo un fallo al momento de eliminar el dato' + error);
      Swal.fire(
        'Cancelado',
        'El dato no fue eliminado y esta seguro :)',
        'error'
      );
    }
  }

  CloseDialog(): void {
    this.SpinnerService.hide();
  }

  openDialog(tipo: string, id?: number): void {
    if (tipo === 'c') {
      this.dialog.open(FormularioReservaComponent, {
        data: { type: tipo },
      });
    } else {
      const reservs = this.reservas.find((d) => d.id === id);
      this.dialog.open(FormularioReservaComponent, {
        // width: '80%',
        data: { type: tipo, reserv: reservs },
      });
    }
  }
}
