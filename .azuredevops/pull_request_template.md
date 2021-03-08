**1. O que foi feito?**

Descrição das funcionalidades/correções implementadas.

- [ ] Eu criei o roteiro de testes.
- [ ] Eu realizei o _check_ em dupla.
- [ ] Rodei o sonar e fiz as correções necessárias.
- [ ] O código foi revisado.
- [ ] Eu executei os testes do Postman.
- [ ] O Pipeline executou com sucesso após as novas migrations serem executadas.

**2. Observação**
Caso o pipeline apresente problemas após a execução das novas migrations (STEP: Migrate db), executar o seguinte comando:
`yarn typeorm migration:revert`. 
*P.S.: Garantir que as váriaveis do .env estejam apontando para o banco correto*.