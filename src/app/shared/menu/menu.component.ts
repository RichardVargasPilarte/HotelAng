import { Component, OnInit } from '@angular/core';
import { Menu } from '../../models/menu.models';
import { menu } from '../data/menu.data';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  lista: Menu[] = [];

  constructor() {
    this.lista = menu;
    // console.log(this.lista);
  }

  ngOnInit(): void {
  }

}
