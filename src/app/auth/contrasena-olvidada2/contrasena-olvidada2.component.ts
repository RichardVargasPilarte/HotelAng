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
  selector: 'app-contrasena-olvidada2',
  templateUrl: './contrasena-olvidada2.component.html',
  styleUrls: ['./contrasena-olvidada2.component.scss']
})
export class ContrasenaOlvidada2Component implements OnInit {

  public form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private reestablecerContrasenaService: ReestablecerPasswordService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContrasenaOlvidada2Component>
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    // this.enviarCorreo()
  }

  createForm(): void {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  enviarCorreo() {
    const { email } = this.form.value;

    this.reestablecerContrasenaService.sendEmailPassword(this.form.value).subscribe((resp: any) => {
      this.dialogRef.close();
      console.log(resp);
      console.log(email);
    })

    // Swal.fire({
    //   position: "top-end",
    //   icon: "success",
    //   title: "El correo a sido enviado correctamente, revisa tu bandeja d entrada",
    //   showConfirmButton: false,
    //   timer: 1500
    // })
  }
}
