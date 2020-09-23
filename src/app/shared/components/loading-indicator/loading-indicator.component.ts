import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.css'],
})
export class LoadingIndicatorComponent {
  constructor() {}

  @Input()
  loading = true;

  @Input()
  text = $localize`:Texto padrão "Processando..." que aparece no indicador de atividade, que indica que alguma informação está sendo carregada ou processada:Processando...`;
}
