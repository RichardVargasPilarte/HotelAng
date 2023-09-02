import { Component, OnInit } from '@angular/core';
import { ReestablecerPasswordService } from '../../services/reestablecer-password.service';

@Component({
  selector: 'app-reestablecer-password',
  templateUrl: './reestablecer-password.component.html',
  styleUrls: ['./reestablecer-password.component.scss']
})
export class ReestablecerPasswordComponent implements OnInit {

  email!: string;
  
  constructor(private passwordService: ReestablecerPasswordService) { }

  ngOnInit(): void {
  }

}
