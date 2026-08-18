import { test, expect } from '@playwright/test';

test.describe('Fluxo de Agendamento de Consultas Médicas', () => {

  // Antes de cada teste, o robô vai direto para a tela de agendamentos já logado
  test.beforeEach(async ({ page }) => {
     test.setTimeout(60000); 
    await page.goto('/appointments', { waitUntil: 'networkidle' });
  });

  test('CT-01: Criar agendamento completo com preenchimento válido (Fluxo Feliz)', async ({ page }) => {
    // 1. Clicar no botão para abrir o modal de agendamento
    const openModalButton = page.getByRole('button', { name: 'Adicionar Agendamento' });
    await expect(openModalButton).toBeEnabled();
    await openModalButton.click();

    // Validar se o modal "Novo agendamento" abriu corretamente na tela
    await expect(page.getByRole('heading', { name: 'Novo agendamento' })).toBeVisible({timeout: 10000});

    // 2. Selecionar o Paciente
    await page.getByLabel('Paciente').click();
    await page.getByRole('option', { name: 'Alice Santos' }).click();

    // 3. Selecionar o Médico
    await page.getByLabel('Médico').click();
    await page.getByRole('option', { name: 'Carlos Souza' }).click();

    // 4. Verificação de Regra de Negócio: O preço deve carregar automaticamente
    const priceInput = page.locator('div:has-text("Valor da consulta")').getByRole('textbox');
    // Garante que o campo ficou visível e que o valor mudou (não é mais R$ 0,00 ou vazio)
    await expect(priceInput).toBeAttached();
    await expect(priceInput).not.toHaveValue('R$ 0,00');
    await expect(priceInput).not.toHaveValue('');

    // 5. Selecionar a Data
    await page.getByLabel('Data').click();
   // "procure um botão que tenha o número 25 em qualquer parte do texto"
    await page.getByRole('button', { name: /.*25.*/ }).click();
    // 6. Selecionar o Horário
    await page.getByLabel('Horário').click();
      // Encontra apenas as opções de horário que NÃO estão desativadas
    const horarioDisponivel = page.getByRole('option')
      .filter({ hasNot: page.locator('[aria-disabled="true"], [data-disabled]') })
      .first();   
    // Clica no primeiro horário livre encontrado
    await horarioDisponivel.click();

    // 7. Confirmar o agendamento
    await page.getByRole('button', { name: 'Criar agendamento' }).click();

    // 8. Validações finais de sucesso
    await expect(page.getByText('Agendamento criado com sucesso.')).toBeVisible();

    // Garante que o modal foi fechado
    await expect(page.getByRole('heading', { name: 'Novo agendamento' })).not.toBeVisible();
  });

  test('CT-02: Ocultação de horários que acabaram de ser agendados (Concorrência)', async ({ page }) => {
    // ---- PASSO 1: Fazer um agendamento fixo para o dia 26 às 10:00 ----
    await page.getByRole('button', { name: 'Adicionar Agendamento' }).click();
    
    await page.getByLabel('Paciente').click();
    await page.getByRole('option', { name: 'Alice Santos' }).click();
    
    await page.getByLabel('Médico').click();
    await page.getByRole('option', { name: 'Carlos Souza' }).click();
    
    await page.getByLabel('Data').click();
    await page.getByRole('button', { name: /.*26 de agosto.*/i }).click(); 
    
    await page.getByLabel('Horário').click();
    await page.getByRole('option', { name: '10:00' }).click();
    
    await page.getByRole('button', { name: 'Criar agendamento' }).click();
    await expect(page.getByText('Agendamento criado com sucesso.')).toBeVisible();

    // Garante que o agendamento foi renderizado na tabela antes de prosseguir
    // Isso força o React Query / revalidatePath a terminar de atualizar a tela de fundo
    await expect(page.locator('table, div').getByText('26/08/2026 às 10:00')).toBeVisible({ timeout: 10000 });

    // ---- PASSO 2: Validar se o horário das 10:00 sumiu/desativou para o mesmo médico no dia 26 ----
    await page.getByRole('button', { name: 'Adicionar Agendamento' }).click();
    
    await page.getByLabel('Paciente').click();
    await page.getByRole('option', { name: 'Alice Santos' }).click();
    
    await page.getByLabel('Médico').click();
    await page.getByRole('option', { name: 'Carlos Souza' }).click();
    
    await page.getByLabel('Data').click();
    await page.getByRole('button', { name: /.*26 de agosto.*/i }).click();
    
    await page.getByLabel('Horário').click();
    
  // Captura a opção de 10:00 que sabemos que continua visível na tela
    const horarioDezHoras = page.getByRole('option', { name: '10:00' });
    
    // Garante que o elemento está visível, mas DESATIVADO (disabled)
    await expect(horarioDezHoras).toBeVisible();
    await expect(horarioDezHoras).toHaveAttribute('aria-disabled', 'true');
  });

  test('CT-03: Validação de indisponibilidade de datas sem escala ativa do médico', async ({ page }) => {
    // 1. Abrir o modal e selecionar o médico com restrição (escala Seg-Sex)
    await page.getByRole('button', { name: 'Adicionar Agendamento' }).click();
    // 2. Selecionar o paciente e o médico
    await page.getByLabel('Paciente').click();
    await page.getByRole('option', { name: 'Alice Santos' }).click();
    await page.getByLabel('Médico').click();
    await page.getByRole('option', { name: 'Carlos Souza' }).click();

    // 3. Abrir o Popover de calendário
    await page.getByLabel('Data').click();

    // 4. Tentar clicar em um domingo futuro (Exemplo: dia 23)
    // No Shadcn UI, dias desativados possuem o atributo 'disabled' ou 'aria-disabled="true"'
    const domingoButton = page.getByRole('button', { name: /.*23.*/ });
    
    // Garante que o botão do domingo está desativado no calendário
    await expect(domingoButton).toBeDisabled();
  });

  test('CT-04: Impedir envio com campos vazios e validar mensagens de erro do Zod', async ({ page }) => {
    // 1. Abrir o modal
    await page.getByRole('button', { name: 'Adicionar Agendamento' }).click();

    // 2. Forçar o clique em enviar sem preencher nada
    await page.getByRole('button', { name: 'Criar agendamento' }).click();

    // 3. Validação das mensagens Zod
    await expect(page.getByText('Paciente é obrigatório.')).toBeVisible();
    await expect(page.getByText('Médico é obrigatório.')).toBeVisible();
    await expect(page.getByText('Data é obrigatória.')).toBeVisible();
  });
});
