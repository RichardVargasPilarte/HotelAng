import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';

interface DialogData {
  type: string;
  client?: Cliente;
}

@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.scss']
})
export class FormularioClienteComponent implements OnInit {

  public clientes = new Cliente();
  public edit!: boolean;
  subs: Subscription[] = [];
  public selected = '0';
  public form!: FormGroup;

  TipoDocumento: string[] = [
    'Cedula',
    'Pasaporte'
  ];

  constructor(
    private clienteServicio: ClienteService,
    public dialogRef: MatDialogRef<FormularioClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.createForm()
  }
  ngOnInit(): void {
  }

  createForm(id?: string): void {
    if (this.data.type === 'c') {
      this.form = this.fb.group({
        id: new FormControl(0),
        nombre: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        apellido: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        direccion: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        telefono: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        tipo_identificacion: new FormControl('', [
          Validators.required
        ]),
        num_identificacion: new FormControl('', [
          Validators.required,
          Validators.minLength(16),
        ]),
        email: new FormControl('', [Validators.required,Validators.email]),
        eliminado: new FormControl('NO'),
      });
    } else {
      this.form = this.fb.group({
        id: this.data.client!.id,
        nombre: new FormControl(this.data.client!.nombre, [
          Validators.required,
          Validators.minLength(3),
        ]),
        apellido: new FormControl(this.data.client!.apellido, [
          Validators.required,
          Validators.minLength(5),
        ]),
        telefono: new FormControl(this.data.client!.telefono, [
          Validators.required,
          Validators.minLength(9),
        ]),
        tipo_identificacion: new FormControl(this.data.client!.tipo_identificacion, [
          Validators.required,
          Validators.minLength(9),
        ]),
        num_identificacion: new FormControl(this.data.client!.num_identificacion, [
          Validators.required,
          Validators.minLength(16),
        ]),
        email: new FormControl(this.data.client!.email, [Validators.required,Validators.email]),
        eliminado: new FormControl('NO'),
      });
    }
  }

  GuardarCliente(): void {
    let client = new Cliente();
    client = Object.assign(client, this.form.value);
    this.subs.push(
      this.clienteServicio.Agregar(client).subscribe(
        // (res) => this.dialogRef.close(),
        // (error) => console.log('Hubo un error' + error)

        {
          next: (res) => {
            this.dialogRef.close();
          },
          error: (error: any) => console.log('Hubo un error' + error)
        }
      )
    );
  }

  ActualizarCliente(): void {
    let client = new Cliente();
    client = Object.assign(client, this.form.value);
    this.subs.push(
      this.clienteServicio
        .ActualizarCliente(client.id!, client)
        .subscribe(
          // (res) => this.dialogRef.close(),
          // (error) => console.log('Hubo un error' + error)

          {
            next: (res) => {
              this.dialogRef.close();
              (error: any) => console.log('Hubo un error' + error)
            }
          }
        )
    );
  }

  get Form(): any {
    return this.form.controls;
  }
}
