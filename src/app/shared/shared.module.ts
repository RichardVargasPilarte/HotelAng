import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';

import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';

import { Error404Component } from './error404/error404.component';
import { MenuComponent } from './menu/menu.component';

import { NgSelectModule } from '@ng-select/ng-select';

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
  declarations: [DashboardComponent, Error404Component, MenuComponent],
  imports: [CommonModule, MaterialComponents, RouterModule, NgSelectModule],
  exports: [MaterialComponents, DashboardComponent, Error404Component, NgSelectModule],
})
export class SharedModule {}
