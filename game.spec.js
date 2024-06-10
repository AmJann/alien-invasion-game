import { test, expect } from "@playwright/test";





const localhost = 'http://localhost:8080/TestIndex.html'


// expecting some url
// set up some leaky global object with which to test via playwright
// write tests against the leaky object in all browsers
// may need to modify game to make it easier to test (fewer and perhaps immobile sprites)

test('launch test environment', async ({ page }) => {
    
    
    
    await page.goto(localhost)
    await expect(page).toHaveTitle('Alien Invasion Test')
})



