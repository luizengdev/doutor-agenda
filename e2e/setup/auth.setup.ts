import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('Autenticação inicial do sistema', async ({ page }) => {
  setup.setTimeout(90000);

  // 1. Aguarda a página carregar completamente (networkidle garante que requisições iniciais terminaram)
  await page.goto('/authentication', { waitUntil: 'networkidle' });

  const emailInput = page.getByPlaceholder('Digite seu email');
  await expect(emailInput).toBeVisible({ timeout: 20000 });

  await emailInput.fill('qateste@gmail.com');
  await page.getByPlaceholder('Digite sua senha').fill('12345678');
  
  const submitButton = page.getByRole('button', { name: 'Entrar', exact: true });
  
  // Garante que o botão de entrar não está desativado (carregando) antes de clicar
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // 2. Em vez de esperar só a URL, espera um elemento exclusivo da Dashboard aparecer!
  // Isso força o Playwright a aguardar o carregamento da próxima página real.
  // Substitua 'Menu' ou 'Sair' por algum texto/botão que só exista dentro do seu Dashboard.
  await expect(page.getByRole('button', { name: 'Sair' }).or(page.getByText('Dashboard'))).toBeVisible({ timeout: 30000 });

  // 3. Validação dupla da URL por segurança
  await expect(page).toHaveURL(/dashboard/);
  
  // 4. Salva o estado da sessão
  await page.context().storageState({ path: authFile });
});
