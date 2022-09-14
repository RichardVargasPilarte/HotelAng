import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: UntypedFormGroup;
  public hide = true;
  public loading = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private _JwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
    });
    if (this._JwtService.isAuthenticated()) {
      this.router.navigate(['/Alojamientos/Listado']);
    }
  }

  get Form() {
    return this.loginForm.controls;
  }

  login() {
    this.loading = true;
    this._JwtService
      .login(this.Form['username'].value, this.Form['password'].value)
      .subscribe(
        // (res) => {
        //   console.log(res);
        //   window.location.reload();
        //   this.loading = false;
        // },
        // (err) => {
        //   alert(err.error.non_field_errors);
        //   this.loading = false;
        // }

        {
          next: (res) => {
            console.log(res);
            window.location.reload();
            this.loading = false;
          },
          error: (error) => {
            alert(error.error.non_field_errors);
            this.loading = false;
          }
        }
      );
  }
}
