import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HabitacionService } from '../../../services/habitacion.service';
import { AlojamientoService } from '../../../services/alojamiento.service';
import { Habitacion } from '../../../Models/habitacion.model';
import { Alojamiento } from '../../../Models/alojamiento.model';
import { FormularioHabitacionComponent } from '../formulario-habitacion/formulario-habitacion.component';
import { RedirIfFailPipe } from '../../../Pipes/redir-if-fail.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-listado-habitacion',
  templateUrl: './listado-habitacion.component.html',
  styleUrls: ['./listado-habitacion.component.scss'],
})
export class ListadoHabitacionComponent implements OnInit, OnDestroy {
  public habitaciones: Habitacion[] = []; // propiedad encarga de interactuar con el modelo habitaciones
  public alojamiento: Alojamiento[] = []; // propiedad encarga de interactuar con el modelo alojamientos
  alerts = true;
  public subs: Subscription[] = [];
  sub: Subscription | undefined;
  private promesas: Promise<any>[] = [];
  public isLoaded = false;
  public dataSource: Habitacion[] = [];
  refHabitacion!: Observable<any[]>;
  refAlojamiento!: Observable<any[]>;
  socket!: WebSocket;

  displayedColumns: string[] = [
    'id',
    'nombre',
    'nombre_alojamiento',
    'numero_personas',
    'precio',
    'activo',
    'actions',
  ];

  constructor(
    private habitacionservice: HabitacionService,
    private alojamiento$: AlojamientoService,
    private dialog: MatDialog,
    private router: Router,
    private SpinnerService: NgxSpinnerService
  ) {
    this.promesas.push(
      new Promise<void>((resolve) => {
        const sub = this.habitacionservice.ListadoHabitaciones().subscribe(
          // (resp) => this.habitaciones.push(resp),
          // (error) => console.log(error),
          // () => resolve()
          {
            next: (resp) => {
              this.habitaciones.push(resp);
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
        const sub = this.alojamiento$.ObtenerAlojamientos().subscribe(
          // (resp) => this.alojamiento.push(resp),
          // (error) => console.log(error),
          // () => resolve()

          {
            next: (resp) => {
              this.alojamiento.push(resp);
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
    this.refHabitacion = this.habitacionservice.getList();
    // console.log(this.refHabitacion);
    this.refAlojamiento = this.alojamiento$.getList();
  }

  async ngOnInit(): Promise<void> {
    this.SpinnerService.show();
    Promise.all(this.promesas).then(() => {
      if (
        new RedirIfFailPipe().transform(
          'Alojamientos/Listado',
          this.alojamiento,
          this.router
        )
      ) {
        this.dataSource = this.habitaciones;
        console.log('estas son las habitaciones:', this.dataSource);
        this.isLoaded = true;
        this.subs.push();
        this.CloseDialog();
      }
    });
    this.refHabitacion.subscribe((data) => {
      this.habitaciones = data;
      // console.log('probando', data);
      this.dataSource = [];
      this.habitaciones.forEach((element) => {
        this.dataSource.push(element);
      });
      this.CloseDialog();
    });
  }

  ngOnDestroy(): void {
    this.habitacionservice.list = [];
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }

  // Metodo encargado de eliminar las habitaciones mediante su Id
  async eliminarhabitacion(id: number): Promise<void> {
    const result:SweetAlertResult  = await Swal.fire({
      title: '¿Esta seguro de eliminar este dato?',
      text: '¡No se podra recuperar este dato luego de ser eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    })
    console.log(result)
    if(result.isConfirmed){
    this.habitacionservice.BorrarHabitacion(id).subscribe((data) => {
      console.log('Se elimino la habitación');
      // se debe mandar a llamar al servicio para que se actualice la lista de datos para obtener los datos registrados
      console.log(data);
    });
  }

  }

  CloseDialog(): void {
    this.SpinnerService.hide();
  }

  openDialog(tipo: string, id?: number): void {
    if (tipo === 'c') {
      this.dialog.open(FormularioHabitacionComponent, {
        data: { type: tipo },
      });
    } else {
      const habitac = this.habitaciones.find((d) => d.id === id);
      this.dialog.open(FormularioHabitacionComponent, {
        // width: '80%',
        data: { type: tipo, hab: habitac },
      });
    }
  }
}
