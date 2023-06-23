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

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;

  constructor() {
    this.lista = menu;
    // console.log(this.lista);
  }

  ngOnInit(): void {
  }

}
