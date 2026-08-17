import { browser } from "k6/browser";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    ui: {
      executor: "constant-vus",
      vus: 2,
      duration: "30s",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  thresholds: {
    browser_http_req_duration: ["p(95)<4000"],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    // 1. Cargar AgroTrace
    await page.goto("https://arielretamales1593.github.io/SIMULADOR-QA-/");

    // 2. Ir a Historial
    const navHistorialBtn = page.locator('button[data-page="historial"]');
    await navHistorialBtn.click();

    // 3. Seleccionar animal
    const animalSelect = page.locator('#historyForm select[name="animalId"]');
    await animalSelect.waitFor({ state: "attached" });
    await animalSelect.selectOption({ index: 1 });

    // 4. Click en "Consultar historial"
    const submitBtn = page.locator("#historyForm button.primary");
    const startTime = Date.now();
    await submitBtn.click();

    // 5. Esperar resultado
    const historyResult = page.locator("#historyResult");
    await historyResult.waitFor({ state: "visible" });

    const duration = Date.now() - startTime;

    // Obtenemos el valor booleano de forma asíncrona ANTES del check
    const isVisible = await historyResult.isVisible();

    // 6. Aserciones sin funciones async
    check(page, {
      "El historial se renderizo correctamente": () => isVisible,
      "Renderizado en menos de 4 segundos": () => duration < 4000,
    });

    sleep(1);
  } finally {
    await page.close();
  }
}
