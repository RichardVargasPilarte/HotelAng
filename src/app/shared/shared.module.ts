import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';

import {MatListModule} from '@angular/material/list';

import { Error404Component } from './error404/error404.component';
import { MenuComponent } from './menu/menu.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerComponent } from './spinner/spinner.component';

const MaterialComponents = [
  MatSidenavModule,
  MatToolbarModule,
  MatDividerModule,
  MatButtonModule,
  MatIconModule,
  MatGridListModule,
  MatTooltipModule,
  MatDialogModule,
  MatCardModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatMenuModule,
  MatListModule
];

@NgModule({
  declarations: [DashboardComponent, Error404Component, MenuComponent, SpinnerComponent],
  imports: [CommonModule, MaterialComponents, RouterModule, NgSelectModule, ],
  exports: [MaterialComponents, DashboardComponent, Error404Component, NgSelectModule, SpinnerComponent],
})
export class SharedModule {}
