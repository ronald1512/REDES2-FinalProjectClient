import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {path:'', redirectTo:"reportes", pathMatch:'full'},
  {path:"reportes", component:ReportsComponent},
  {path:'asistencia',component:AsistenciaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
