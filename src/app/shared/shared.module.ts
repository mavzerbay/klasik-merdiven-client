import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { FooterComponent } from './components/footer/footer.component';



@NgModule({
  declarations: [
    TopMenuComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TopMenuComponent,
    FooterComponent,
  ]
})
export class SharedModule { }
