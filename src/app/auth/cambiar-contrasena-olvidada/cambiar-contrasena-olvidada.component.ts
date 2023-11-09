import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

import { ChangeForgottenPassword } from '../../models/usuario.model';

import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ReestablecerPasswordService } from '../../services/reestablecer-password.service';

@Component({
  selector: 'app-cambiar-contrasena-olvidada',
  templateUrl: './cambiar-contrasena-olvidada.component.html',
  styleUrls: ['./cambiar-contrasena-olvidada.component.scss']
})
export class CambiarContrasenaOlvidadaComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  token!: string;
  password!: '';
  confirmPassword!: string;
  resetSuccessful = false;

  public form!: FormGroup;
  
  constructor(
    private observer: BreakpointObserver,
    private route: ActivatedRoute,
    private reestablecerContrasenaService: ReestablecerPasswordService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ])
    },
    {
      validators: this.MustMatch('password', 'confirmPassword')
    });
  }

  resetearContrasena() {
    if (this.password === this.confirmPassword) {
      // Call the password reset service
      this.reestablecerContrasenaService.resetPassword(this.password, this.token )
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

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['MustMatch']) {
        return
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  navigateToLogin() {
    // Redirect the user to the login page after a successful password reset
    this.router.navigate(['/login']);
  }

}
