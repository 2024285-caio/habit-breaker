# Habit Breaker 🚭

Protótipo de aplicativo para ajudar pessoas a entender os gastos associados a hábitos que desejam reduzir. Este é um projeto em desenvolvimento, criado como parte de uma jornada de aprendizado em desenvolvimento de aplicativos.

## O que já existe

- Configuração do consumo inicial, quantidade de cigarros por maço e preço do maço.
- Registro e correção do consumo diário, com histórico dos últimos sete dias registrados.
- Comparação com o consumo inicial, saldo diário e estimativa do gasto mensal com base nos cigarros registrados.
- Dados salvos localmente no dispositivo.

## Situação atual

O aplicativo é um protótipo inicial. O saldo diário compara o consumo registrado com a referência inicial e pode ser negativo. O gasto mensal é calculado apenas pelos cigarros registrados no mês, usando o preço atual configurado; dias sem registro não entram no total. Alterações na configuração recalculam as estimativas com os novos valores.

O fluxo original foi aberto no navegador, mas a versão Android ainda precisa ser testada em um aparelho.

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

- Revisar as dependências e corrigir os problemas identificados.
- Criar metas de redução e ampliar o acompanhamento do histórico.
- Substituir as telas de exemplo e testar o aplicativo no Android.

As funcionalidades planejadas ainda não estão disponíveis. Este projeto não substitui orientação profissional de saúde.
