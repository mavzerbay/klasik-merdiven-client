import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { PageComponent } from './components/page/page.component';

const routes: Routes = [
  { path: ':slug', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'c/:slug', component: ContactComponent, data: { breadcrumb: 'Contact.ControllerTitle' } },
  { path: 'p/:slug', component: PageComponent, data: { breadcrumb: 'Contact.ControllerTitle' } },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
