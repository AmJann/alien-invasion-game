import { test, expect } from "@playwright/test";

const localhost = 'http://localhost:8080/'

test('something', async ({ page }) => {
    await page.goto(localhost)
    const gameCanvas = await page.locator('canvas')
    page.on('console', () => {
        
    })
    expect(gameCanvas).to
    
    //gameCanvas.evaluate(
})

