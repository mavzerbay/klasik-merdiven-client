import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'iletisim', component: ContactComponent, data: { breadcrumb: 'Contact.ControllerTitle' } },
  { path: 'contact', component: ContactComponent, data: { breadcrumb: 'Contact.ControllerTitle' } },
  { path: 'kontakt', component: ContactComponent, data: { breadcrumb: 'Contact.ControllerTitle' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
