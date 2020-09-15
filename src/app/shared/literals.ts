import { PoTableLiterals } from '@po-ui/ng-components';

export class CustomLiterals {
  public static forTable(): PoTableLiterals {
    return {
      loadMoreData: $localize`:Texto do botão "Carregar mais dados" das tabelas do sistema:Mostrar mais`,
      loadingData: $localize`:Texto da mensagem de que os dados de uma tabela estão sendo carregados:Carregando`,
      noData: $localize`:Texto da mensagem que aparece nas tabelas do sistema quando não há dados para exibir:Nenhum dado encontrado`,

      columnsManager: $localize`:Título do gerenciador de colunas das tabelas do sistema:Gerenciador de colunas`,
      noVisibleColumn: $localize`:Texto da mensagem que aparece na tabela quando nenhuma coluna está visível:Nenhuma coluna visível`,
      noColumns: $localize`:Texto da mensagem que aparece no gerenciador de colunas de uma tabela quando não há colunas para selecionar:Sem colunas`,

      seeCompleteSubtitle: $localize`:Texto do botão para exibir toda a legenda em tabelas do sistema:Mostrar legenda completa`,
      completeSubtitle: $localize`:Título da janela que exibe a legenda completa de uma tabela:Legenda completa`,
    };
  }
}
