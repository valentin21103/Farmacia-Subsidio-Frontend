import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListaMedicamentosComponent } from './components/lista-medicamentos/lista-medicamentos.component';
import { RegistroComponent } from './components/registro/registro.component';
import { BibliotecaMedicamentosComponent } from './components/biblioteca-medicamentos/biblioteca-medicamentos.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { BibliotecaUsuariosComponent } from './components/biblioteca-usuarios/biblioteca-usuarios.component';
import { authGuard } from './Guard/auth.guard';

export const routes: Routes = [

        {path : '', component:LoginComponent},

        {path : 'login', component: LoginComponent},

      // 3. Ruta para ver los medicamentos (a donde iremos después de entrar)
        { path: 'inicio', component: ListaMedicamentosComponent , canActivate: [authGuard]},

        {path:  "inicioAdmin", component: AdminDashboardComponent ,canActivate: [authGuard]},

        {path : 'registro', component: RegistroComponent},
  
        {path: "bibliotecaMedi", component: BibliotecaMedicamentosComponent, canActivate: [authGuard]},

        {path: "bibliotecaUsuario", component: BibliotecaUsuariosComponent, canActivate: [authGuard]},
  
         // (Opcional) Si escriben cualquier cosa rara, mandar al Login

         // AGUJERO NEGROOOOOOOO
         { path: '**', redirectTo: '', pathMatch: 'full' }


];
