# Revisão inicial de segurança

Esta é uma avaliação inicial do protótipo, não uma auditoria completa nem uma aprovação para publicação.

## Estado atual

- O consumo, preço e histórico são salvos localmente com AsyncStorage, que não criptografa os dados. O aplicativo não tem login, servidor ou sincronização implementados. A ausência de sincronização não garante proteção contra alguém que tenha acesso ao aparelho ou aos seus backups.
- O botão de exclusão remove os dados armazenados pelo aplicativo no dispositivo atual. Não é uma garantia de remoção de eventuais backups do sistema.
- A entrada de números é validada e dados salvos em formato inválido não são carregados. A proteção contra alterações no dispositivo não foi verificada.
- Arquivos `.env` e chaves comuns estão no `.gitignore`. Isso não remove segredos que já tenham sido versionados; cada alteração deve ser revisada antes de ser enviada.

## Pendências antes do lançamento

1. Definir os dados necessários e a proteção do histórico de consumo em repouso, incluindo migração sem perda dos registros existentes e comportamento ao desinstalar ou trocar de aparelho.
2. Para o login, escolher um provedor de autenticação confiável; não armazenar senhas no app. Proteger sessões, recuperação de conta, comunicação e acesso aos dados de cada usuário. Estudar um caminho de migração dos dados locais.
3. Revisar o acesso a dados, permissões Android, backups, política de privacidade e exclusão de conta e dados conforme as funcionalidades finais.
4. Investigar e corrigir ou justificar cada alerta de dependências, distinguindo ferramentas de desenvolvimento do código distribuído. Não executar atualizações forçadas sem avaliar compatibilidade e testar novamente.
5. Testar o aplicativo em Android, incluindo falhas de armazenamento, perda de conectividade, troca de aparelho e o pacote de lançamento.

## Referências

- [Expo: armazenamento de dados](https://docs.expo.dev/develop/user-interface/store-data/)
- [Expo: autenticação e armazenamento seguro de sessão](https://docs.expo.dev/guides/authentication/)
