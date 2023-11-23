import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { Habitacion } from '../../../models/habitacion.model';
import { HabitacionService } from '../../../services/habitacion.service';
import { Alojamiento } from '../../../models/alojamiento.model';
import { AlojamientoService } from '../../../services/alojamiento.service';

import { FormularioHabitacionComponent } from '../formulario-habitacion/formulario-habitacion.component';
import { RedirIfFailPipe } from '../../../pipes/redir-if-fail.pipe';

import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { JwtService } from '../../../services/jwt.service';
import { RoleId } from '../../../shared/types/Roles.types';
import { Permission } from '../../../shared/types/permissions.types';

@Component({
  selector: 'app-listado-habitacion',
  templateUrl: './listado-habitacion.component.html',
  styleUrls: ['./listado-habitacion.component.scss'],
})
export class ListadoHabitacionComponent implements OnInit, OnDestroy {
  public habitaciones: Habitacion[] = []; // propiedad encarga de interactuar con el modelo habitaciones
  public alojamientos: Alojamiento[] = []; // propiedad encarga de interactuar con el modelo alojamientos
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

  roleIds = RoleId
  permissions = new Permission();

  constructor(
    private habitacionservice: HabitacionService,
    private alojamiento$: AlojamientoService,
    private dialog: MatDialog,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private jwtService: JwtService
  ) {
    this.promesas.push(
      new Promise<void>((resolve) => {
        const sub = this.habitacionservice.listingRooms().subscribe(
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
        const sub = this.alojamiento$.GetAccommodations().subscribe(
          // (resp) => this.alojamiento.push(resp),
          // (error) => console.log(error),
          // () => resolve()

          {
            next: (resp) => {
              this.alojamientos.push(resp);
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
          this.alojamientos,
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
  async removeRoom(id: number): Promise<void> {
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
      this.habitacionservice.deleteRoom(id).subscribe((data) => {
        console.log('Se elimino la habitación');
        Swal.fire('Eliminado!', 'El dato ha sido eliminado.', 'success');
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

  hasRole(roleId: number) {
    return this.jwtService.hasRole(roleId);
  }

  hasPermission(permissionId: number) {
    return this.jwtService.hasPermission(permissionId);
  }
}
