import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { FormularioClienteComponent } from '../formulario-cliente/formulario-cliente.component';

import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

import { RoleId } from '../../../shared/types/Roles.types';
import { Permission } from '../../../shared/types/permissions.types';
import { JwtService } from '../../../services/jwt.service';

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
  public dataSource: Cliente[] = [];
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'telefono',
    'email',
    // 'tipo_identificacion',
    // 'num_identificacion',
    'actions',
  ];
  success = false;
  roleIds = RoleId
  permissions = new Permission();

  constructor(
    private _clienteService: ClienteService,
    private dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private jwtService: JwtService,
    private cdRef: ChangeDetectorRef
  ) {
    this.refClient = this._clienteService.getList();
  }

  ngOnInit(): void {
    this.showLoading();
    this.refClient.subscribe((data) => {
      this.clientes = data;
      console.log('clientes', this.clientes);
      this.dataSource = [];
      this.clientes.forEach((element) => {
        this.dataSource.push(element);
      });
      console.log('clientes', this.dataSource);
      this.cdRef.detectChanges();
      this.hideLoading();
      this.isLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this._clienteService.list = [];
    this.subs.map((sub) => sub.unsubscribe());
  }

  deleteClient(id: number): any {
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
        this._clienteService.deleteClient(id).subscribe((data) => {
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

  showLoading() {
    this.SpinnerService.show()
  }

  hideLoading(): void {
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

  hasRole(roleId: number) {
    return this.jwtService.hasRole(roleId);
  }

  hasPermission(permissionId: number) {
    return this.jwtService.hasPermission(permissionId);
  }
}
