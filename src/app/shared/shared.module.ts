import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
//PrimeNg Modules
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';



@NgModule({
  declarations: [
    TopMenuComponent,
    FooterComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    BreadcrumbModule,
  ],
  exports: [
    TopMenuComponent,
    FooterComponent,
    BreadcrumbComponent,
    //PrimeNg Modules
    ButtonModule,
  ]
})
export class SharedModule { }
