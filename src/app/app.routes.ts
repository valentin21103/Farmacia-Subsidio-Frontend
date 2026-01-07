import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListaMedicamentosComponent } from './components/lista-medicamentos/lista-medicamentos.component';
import { RegistroComponent } from './components/registro/registro.component';

export const routes: Routes = [

        {path : '', component:LoginComponent},

        {path : 'login', component: LoginComponent},

      // 3. Ruta para ver los medicamentos (a donde iremos después de entrar)
        { path: 'inicio', component: ListaMedicamentosComponent },

        {path : 'registro', component: RegistroComponent},
  
         // (Opcional) Si escriben cualquier cosa rara, mandar al Login
         { path: '**', redirectTo: '', pathMatch: 'full' }
];
