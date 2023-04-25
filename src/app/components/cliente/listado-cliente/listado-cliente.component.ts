import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { FormularioClienteComponent } from '../formulario-cliente/formulario-cliente.component';

import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-listado-cliente',
  templateUrl: './listado-cliente.component.html',
  styleUrls: ['./listado-cliente.component.scss']
})
export class ListadoClienteComponent implements OnInit, OnDestroy {
  public clientes: Cliente[] = [];
  refClient: Observable<any>;
  subs: Subscription[] = [];
  public isLoaded = false;
  private promesa: Promise<any>;
  public dataSource: Cliente[] = [];
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'telefono',
    'email',
    'tipo_identificacion',
    'num_identificacion',
    'actions',
  ];
  success = false;

  constructor(
    private _clienteService: ClienteService,
    private dialog: MatDialog,
    private SpinnerService: NgxSpinnerService
  ) {
    this.promesa = new Promise<void>((resolve) => {
      const sub = this._clienteService.ObtenerClientes().subscribe(
        // (res) => this.alojamientos.push(res),
        // (error) => console.log('Hubo un fallo al momento de traer los datos'),
        // () => resolve()

        {
          next: (res) => {
            this.clientes.push(res);
          },
          error: (error: any) => {
            console.log(error),
            console.log('Hubo un fallo al momento de traer los datos');
          },
          complete() {
            resolve();
          },
        }
      );
      this.subs.push(sub);
    });
    this.refClient = this._clienteService.getList();
  }

  ngOnInit(): void {
    this.SpinnerService.show();
    this.promesa.then(() => {
      this.dataSource = this.clientes;
      console.log('Yo traigo los datos y son estos:', this.dataSource);
      this.isLoaded = true;
      this.subs.push();
      this.CloseDialog();
    });
    this.refClient.subscribe((data) => {
      this.clientes = data;
      // console.log('Hola', data);
      this.dataSource = [];
      this.clientes.forEach((element) => {
        this.dataSource.push(element);
      });
      this.CloseDialog();
    });
  }

  ngOnDestroy(): void {
    this._clienteService.list = [];
    this.subs.map((sub) => sub.unsubscribe());
  }

  eliminarAlojamiento(id: number): any {
    Swal.fire({
      title: '¿Esta seguro de eliminar este dato?',
      text: '¡No se podra recuperar este dato luego de ser eliminado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.SpinnerService.show();
        this._clienteService.BorrarCliente(id).subscribe((data) => {
          this.success = true;
          Swal.fire('Eliminado!', 'El dato ha sido eliminado.', 'success');
          this.SpinnerService.hide();
          console.log('Se elimino el cliente');
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
    });
  }

  CloseDialog(): void {
    this.SpinnerService.hide();
  }

  openDialog(tipo: string, id?: number): void {
    if (tipo === 'c') {
      this.dialog.open(FormularioClienteComponent, {
        data: { type: tipo },
      });
    } else {
      const habitac = this.clientes.find((d) => d.id === id);
      this.dialog.open(FormularioClienteComponent, {
        // width: '80%',
        data: { type: tipo, hab: habitac },
      });
    }
  }

}
