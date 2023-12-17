import { Component } from '@angular/core';
import { Menu } from '../../models/menu.models';
import { menu } from '../data/menu.data';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  lista: Menu[] = [];

  constructor() {
    this.lista = menu;
  }

}
