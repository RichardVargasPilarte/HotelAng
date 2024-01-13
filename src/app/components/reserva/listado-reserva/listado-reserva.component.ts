import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Reserva } from '../../../Models/reserva.model';

import { ReservaService } from '../../../services/reserva.service';
import { FormularioReservaComponent } from '../formulario-reserva/formulario-reserva.component';

import { Habitacion } from '../../../Models/habitacion.model';

import { HabitacionService } from '../../../services/habitacion.service';

import Swal, { SweetAlertResult } from 'sweetalert2';

import { SpinnerService } from '../../../services/spinner.service';

@Component({
  selector: 'app-listado-reserva',
  templateUrl: './listado-reserva.component.html',
  styleUrls: ['./listado-reserva.component.scss']
})
export class ListadoReservaComponent implements OnInit, OnDestroy {

  public reservas: Reserva[] = [];
  public habitaciones: Habitacion[] = [];
  public subs: Subscription[] = [];
  sub: Subscription | undefined;
  public isLoaded = false;
  public dataSource: Reserva[] = [];
  refReserva!: Observable<any[] | null>;
  refHabitacion!: Observable<any[] | null>;
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
    private spinnerService: SpinnerService
  ) {
    this.refReserva = this.reservaService.getList();
    this.refHabitacion = this.habitacionservice$.getList();
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.showLoading();

    this.refHabitacion.subscribe((data) => {
      if (!data) data = [];
      this.habitaciones = data;
    })

    this.refReserva.subscribe((data) => {
      if (!data) data = [];
      this.reservas = data;
    })

    this.handleReservaRef()
  }

  ngOnDestroy(): void {
    this.reservaService.list = [];
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  async deleteReserve(id: number): Promise<void> {
    const result: SweetAlertResult = await Swal.fire({
      title: '¿Esta seguro de eliminar este dato?',
      text: '¡No se podra recuperar este dato luego de ser eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    })
    if (result.isConfirmed) {
      this.reservaService.deleteReserve(id).subscribe((data) => {
        console.log('Se elimino la habitación');
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

  openDialog(tipo: string, id?: number): void {
    if (tipo === 'c') {
      this.dialog.open(FormularioReservaComponent, {
        data: { type: tipo },
      });
    } else {
      const reservs = this.reservas.find((d) => d.id === id);
      this.dialog.open(FormularioReservaComponent, {
        data: { type: tipo, reserv: reservs },
      });
    }
  }

  private handleReservaRef() {
    this.refReserva.subscribe((data) => {
      this.isLoaded = data !== null;
      if (!data) data = [];
      this.reservas = data;
      this.dataSource = [...data]
      if (this.isLoaded) this.spinnerService.hideLoading();
    })
  }
}
