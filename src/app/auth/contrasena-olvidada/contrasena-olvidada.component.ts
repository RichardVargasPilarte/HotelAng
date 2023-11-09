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


@Component({
  selector: 'app-contrasena-olvidada',
  templateUrl: './contrasena-olvidada.component.html',
  styleUrls: ['./contrasena-olvidada.component.scss']
})
export class ContrasenaOlvidadaComponent implements OnInit {

  public form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private reestablecerContrasenaService: ReestablecerPasswordService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContrasenaOlvidadaComponent>
  ) {
    this.createForm()
  }

  ngOnInit(): void {
  }

  createForm(): void {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  enviarCorreo() {
    // let email = new SendEmail();
    // email = Object.assign(email, this,this.form.value);
    // this.reestablecerContrasenaService.sendEmailPassword(this.emailUser).subscribe(
    //   {
    //     next: (res) => {
    //       console.log(this.emailUser)
    //     },
    //     error: (error: any) => console.log('Hubo un error' + error)
    //   }
    // )

    const {email} = this.form.value;

    this.reestablecerContrasenaService.sendEmailPassword(this.form.value).subscribe((resp: any) => {
      this.dialogRef.close();
      console.log(resp);
      console.log(email);
    })
  }

}
