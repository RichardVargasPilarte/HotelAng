import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ReestablecerPasswordService } from '../../services/reestablecer-password.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.component.html',
  styleUrls: ['./restablecer-contrasena.component.scss']
})
export class RestablecerContrasenaComponent implements OnInit {

  public form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private reestablecerContrasenaService: ReestablecerPasswordService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RestablecerContrasenaComponent>
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): void {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  sendMail() {
    const { email } = this.form.value;

    this.reestablecerContrasenaService.sendEmailPassword(this.form.value).subscribe(
      {
        next: () => {
          this.dialogRef.close();
          console.log(email);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "El correo a sido enviado correctamente, revisa tu bandeja de entrada",
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "A ocurrido un error al momento de enviar se el correo, vuelva a intententar lo nuevamente",
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
    )
  }
}
