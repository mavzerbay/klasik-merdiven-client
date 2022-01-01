import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { StringFormatPipe } from './pipes/string-format.pipe';
//PrimeNg Modules
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TopMenuComponent,
    FooterComponent,
    BreadcrumbComponent,
    StringFormatPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    //PrimeNg Modules
    ButtonModule,
    BreadcrumbModule,
    DropdownModule,
  ],
  exports: [
    TopMenuComponent,
    FooterComponent,
    BreadcrumbComponent,
    StringFormatPipe,
    //PrimeNg Modules
    ButtonModule,
    DropdownModule,
  ]
})
export class SharedModule { }
