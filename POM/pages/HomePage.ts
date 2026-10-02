import { Page, Locator } from "@playwright/test";

export class HomePage {
  private readonly page: Page;
  private readonly productLinks: Locator;
  private readonly addToCartButton: Locator;
  private readonly cartLink: Locator;
  private readonly categoryLinks: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productLinks = page.locator('.hrefch');

    this.addToCartButton = page.getByRole('link',{name:"Add to cart",exact:true});

    this.cartLink = page.locator("#cartur");

    this.categoryLinks = page.locator(".list-group-item a");
  }

  // Navigation methods
  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  

  async selectProductByName(productName: string): Promise<void> {
    await this.page.locator('div#tbodyid div.card').first().waitFor({ state: "visible" })
   
    const productElements = await this.productLinks.all();
    
    console.log(await this.productLinks.allTextContents());


    for (const product of productElements) {
      const name = (await product.textContent())?.trim();

      if (name === productName) {
        await product.click();
        return;
      }
    }

    throw new Error(
      `Product "${productName}" not found on the page`
    );
  }

  // Product actions
  async addProductToCart(productName: string): Promise<void> {

    // Click on the product to view its details
    await this.selectProductByName(productName);

    // Handle the dialog that appears after adding to cart
    this.page.once("dialog", async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);

      if (dialog.message().includes("added")) {
        await dialog.accept();
      }
    });

    // Click the "Add to cart" button
    this.page.waitForTimeout(1000)
    await this.addToCartButton.click();
  }

  // Category filtering
  async selectCategory(categoryName: string): Promise<void> {
    const categories = await this.categoryLinks.all();

    for (const category of categories) {
      const name = await category.textContent();

      if (name?.trim().toLowerCase() === categoryName.trim().toLowerCase()) {
        await category.click();

        // Wait for products to be displayed
        await this.page.waitForSelector('div#tbodyid div.card',{ state: "visible" });
        return;
      }
    }

    throw new Error(
      `Category "${categoryName}" not found`
    );
  }

  // Verification methods
  async isProductVisible(productName: string): Promise<boolean> {
    const products = await this.productLinks.all();

    for (const product of products) {
      const name = await product.textContent();

      if (name?.trim() === productName) {
        return true;
      }
    }

    return false;
  }

  // Wait methods
  async waitForProductsToLoad(): Promise<void> {
    await this.page.waitForSelector(
      'div#tbodyid div.card',
      { state: "visible" }
    );
  }
}