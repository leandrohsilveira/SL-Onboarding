import { Component } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly menus: PoMenuItem[] = [
    {
      label: $localize`:Texto da opção "Home" do menu lateral:Home`,
      link: '/',
    },
    {
      label: $localize`:Texto da opção "Alunos" do menu lateral:Alunos`,
      link: '/alunos',
    },
    {
      label: $localize`:Texto da opção "Professores" no menu lateral:Professores`,
      link: '/professores',
    },
  ];
}
