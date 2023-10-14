import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateUser, Usuario } from '../../models/usuario.model';
import { ReestablecerPasswordService } from '../../services/reestablecer-password.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

interface DialogData {
  type: string;
  user?: CreateUser;
}

@Component({
  selector: 'app-reestablecer-password',
  templateUrl: './reestablecer-password.component.html',
  styleUrls: ['./reestablecer-password.component.scss']
})
export class ReestablecerPasswordComponent implements OnInit {
  subs: Subscription[] = [];

  token!: string;
  newPassword!: string;
  confirmPassword!: string;
  resetSuccessful = false;

  public form!: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private reestablecerContrasenaService: ReestablecerPasswordService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReestablecerPasswordComponent>
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    this.createForm();
  }

  createForm(): void {
      this.form = this.fb.group({
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
      });
  }

  // enviarCorreo() {
  //   let email = new CreateUser();
  //   email = Object.assign(email, this,this.form.value);
  //   this.reestablecerContrasenaService.sendEmailPassword(email).subscribe(
  //     {
  //       next: (res) => {

  //       },
  //       error: (error: any) => console.log('Hubo un error' + error)
  //     }
  //   )
  // }

  resetearContraseña() {
    if (this.newPassword === this.confirmPassword) {
      // Call the password reset service
      this.reestablecerContrasenaService.restaurarContraseña(this.token, this.newPassword)
        .subscribe(
          {
            next: () => {
              this.resetSuccessful = true;
            },
            error: (error: any) => console.log('Password reset error:', error)
          }
        );
    } else {
      // Handle password mismatch error
      console.error('Passwords do not match.');
    }
  }

  navigateToLogin() {
    // Redirect the user to the login page after a successful password reset
    this.router.navigate(['/Login']);
  }

}
