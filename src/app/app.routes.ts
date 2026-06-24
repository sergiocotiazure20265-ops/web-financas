import { Routes } from '@angular/router';
import { AutenticarUsuario } from './autenticar-usuario/autenticar-usuario';
import { CriarUsuario } from './criar-usuario/criar-usuario';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path: 'pages/autenticar', //rota de navegação
        component: AutenticarUsuario //componente renderizado
    },
    {
        path: 'pages/criar-usuario', //rota de navegação
        component: CriarUsuario //componente renderizado
    },
    {
        path: 'app/dashboard', //rota de navegação
        component: Dashboard //componente renderizado
    },
    {
        path: '', pathMatch: 'full', //rota raiz
        redirectTo: '/pages/autenticar' //redurecionamento
    }
];
