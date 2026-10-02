import{test,expect} from "@playwright/test"

import { SignUpPage } from "./pages/SignupPage"
import { LoginPage } from "./pages/LoginPage"
import { HomePage } from "./pages/HomePage"
import { CartPage } from "./pages/CartPage"

test.describe("Demoblaze test",()=>{
    const baseUrl = "https://www.demoblaze.com/index.html"
    const testProduct = ["Nexus 6","Samsung galaxy s6","Sony vaio i5"]
    const testPassword = "Test@1234"
    let signedUpuser : {username: string;password: string;} | undefined;


    test.beforeEach(async({page}) =>{
        await page.goto(baseUrl)
    })


    test("sign up", async ({ page }) => {
        const signUpPage = new SignUpPage(page)
        
       signedUpuser ={
        username: `paven_${Date.now()}`,password:testPassword
       }

    const alertMessage = await signUpPage.signUp(signedUpuser.username,signedUpuser.password)

    expect(alertMessage).toContain("Sign up successful")

    })

    test("User login, add a product to cart and verify it",async({page}) =>{
        expect(signedUpuser).toBeDefined()

        const loginPage = new LoginPage(page)
        const homePage = new HomePage(page)
        const cartPage = new CartPage(page)

        await loginPage.navigateToLogin()
        await loginPage.login(signedUpuser!.username,signedUpuser!.password)

        for(const product of testProduct){

         await homePage.addProductToCart(product)
         await page.waitForTimeout(2000)
         await page.goto(baseUrl)
        }
        
        await page.goto(baseUrl)

        await homePage.navigateToCart()

        await cartPage.waitForCartToLoad()
        
        await cartPage.getProductNames()

        await cartPage.getProductPrices()

       
    })

});


