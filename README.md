# Habit Breaker 🚭

Protótipo de aplicativo para ajudar pessoas a entender os gastos associados a hábitos que desejam reduzir. Este é um projeto em desenvolvimento, criado como parte de uma jornada de aprendizado em desenvolvimento de aplicativos.

## O que já existe

- Tela de boas-vindas e seleção de um hábito, incluindo cigarro.
- Formulário para informar consumo diário e preço por unidade.
- Estimativa de gastos diários, semanais, mensais e anuais, apresentada em um alerta.

## Situação atual

O aplicativo é um protótipo inicial: os dados não são salvos e o acompanhamento de progresso ainda não foi implementado. Os exemplos do formulário precisam ser ajustados para distinguir corretamente o preço de um maço do preço de cada cigarro. A navegação ainda inclui telas de exemplo do Expo.

A verificação de tipos identificou erros em componentes de navegação e ícones. O fluxo foi aberto no navegador, mas a versão Android ainda precisa ser testada em um aparelho.

## Tecnologias

- React Native e React
- Expo e Expo Router
- TypeScript

## Como executar

É necessário ter o Node.js e o npm instalados. Na pasta do projeto, execute:

```bash
npm install
npm run web
```

Abra no navegador o endereço mostrado no terminal. Para iniciar o Expo e ver as opções para dispositivos móveis, execute `npm start`. A execução no Android depende de um dispositivo ou emulador configurado e de uma versão compatível do ambiente Expo.

## Próximos passos

- Corrigir os erros de tipos e revisar as dependências.
- Ajustar os cálculos de acordo com a unidade de consumo e o preço do maço.
- Salvar os dados no aparelho e permitir que sejam editados.
- Criar acompanhamento de consumo, metas de redução e economia estimada.
- Substituir as telas de exemplo e testar o aplicativo no Android.

As funcionalidades planejadas ainda não estão disponíveis. Este projeto não substitui orientação profissional de saúde.
