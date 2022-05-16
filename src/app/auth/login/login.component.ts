import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public hide = true;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private _JwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
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
        (res) => {
          console.log(res);
          window.location.reload();
          this.loading = false;
        },
        (err) => {
          alert(err.error.non_field_errors);
          this.loading = false;
        }
      );
  }
}
