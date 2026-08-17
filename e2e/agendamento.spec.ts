import { test, expect } from '@playwright/test';

test.describe('Fluxo de Agendamento de Consultas Médicas', () => {

  // Antes de cada teste, acessamos a URL base (localhost ou produção)
  test.beforeEach(async ({ page }) => {
    await page.goto('/agendamentos'); // Altere para a rota correta da sua listagem
    
    // NOTA: Se o seu sistema exigir login em staging/localhost, 
    // a estratégia de autenticação prévia seria injetada aqui.
  });

  test('CT-01: Criar agendamento completo com preenchimento válido (Fluxo Feliz)', async ({ page }) => {
    // 1. Clicar no botão para abrir o modal de agendamento
    await page.getByRole('button', { name: 'Adicionar Agendamento' }).click();

    // Validar se o modal "Novo agendamento" abriu corretamente na tela
    await expect(page.getByRole('heading', { name: 'Novo agendamento' })).toBeVisible();

    // 2. Selecionar o Paciente na lista suspensa (baseado no componente Radix/Shadcn UI)
    await page.getByLabel('Paciente').click();
    await page.getByRole('option', { name: 'Arthur Silva' }).click();

    // 3. Selecionar o Médico na lista suspensa
    await page.getByLabel('Médico').click();
    await page.getByRole('option', { name: 'Dr. Carlos Eduardo' }).click();

    // 4. Verificação de Regra de Negócio: O preço deve carregar automaticamente via useEffect
    // Buscamos o input de valor da consulta para garantir que ele foi preenchido e não está zerado
    const priceInput = page.getByLabel('Valor da consulta');
    await expect(priceInput).not.toHaveValue('R$ 0,00');

    // 5. Selecionar a Data no Popover de Calendário
    await page.getByLabel('Data').click();
    // Seleciona um dia específico disponível. O Playwright buscará o botão numérico dentro do calendário
    // Dica: ajuste o "25" para um dia futuro que esteja dentro da escala do seu médico de teste
    await page.getByRole('gridcell', { name: '25', exact: true }).click();

    // 6. Selecionar o Horário gerado dinamicamente pelo TanStack Query
    await page.getByLabel('Horário').click();
    await page.getByRole('option', { name: '14:00' }).click();

    // 7. Confirmar o envio do formulário
    await page.getByRole('button', { name: 'Confirmar Agendamento' }).click();

    // 8. Validação dos Critérios de Aceite: Toast de sucesso e persistência
    const toastSucesso = page.locator('text=Agendamento criado com sucesso.');
    await expect(toastSucesso).toBeVisible();

    // Garante que o modal sumiu da tela após a finalização
    await expect(page.getByRole('heading', { name: 'Novo agendamento' })).not.toBeVisible();
  });

  test('CT-04: Impedir envio com campos vazios e validar mensagens de erro do Zod', async ({ page }) => {
    // 1. Abrir o formulário de inserção
    await page.getByRole('button', { name: 'Adicionar Agendamento' }).click();

    // 2. Forçar o clique em enviar sem preencher nenhuma informação obrigatória
    await page.getByRole('button', { name: 'Confirmar Agendamento' }).click();

    // 3. Validação das mensagens reais do seu formulário geradas pelo schema do Zod
    await expect(page.locator('text=Paciente é obrigatório.')).toBeVisible();
    await expect(page.locator('text=Médico é obrigatório.')).toBeVisible();
    await expect(page.locator('text=Data é obrigatória.')).toBeVisible();
    
    // Nota: Como o campo 'Horário' só é habilitado ou ganha foco após escolher médico e data,
    // a validação dele pode ser coberta em um passo separado de interação.
  });
});
