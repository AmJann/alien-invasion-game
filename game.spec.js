import { test, expect } from "@playwright/test";

const localhost = 'http://localhost:8080/'

test('something', async ({ page }) => {
    await page.goto(localhost)
    const gameCanvas = await page.locator('canvas')
    page.on('console', () => {
        
    })
    
    
    //gameCanvas.evaluate(
})


// expecting some url
// set up some leaky global object with which to test via playwright
// write tests against the leaky object in all browsers
// may need to modify game to make it easier to test (fewer and perhaps immobile sprites)