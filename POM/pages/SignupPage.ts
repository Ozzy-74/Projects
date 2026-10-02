import{Locator, Page} from "@playwright/test"

export class SignUpPage{

    //define properties
    private readonly page : Page;
    private readonly signUpLink: Locator;
    private readonly userNameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signupButton: Locator;

    //Initialize page context and elements
    constructor(page: Page){
        this.page = page;
        this.signUpLink = this.page.locator('#signin2')
        this.userNameInput = this.page.locator("#sign-username")
        this.passwordInput = this.page.locator("#sign-password")
        this.signupButton = this.page.locator("div.modal-footer button:has-text('Sign up')");
    }

    async navigateToSignUp(){
        await this.signUpLink.click()
    }

    async fillUserName(username:string){
        await this.userNameInput.clear()
        await this.userNameInput.fill(username)
    }
    async fillPassword(password: string) {
        await this.passwordInput.clear();
        await this.passwordInput.fill(password);
    }

    async submitSignUp() {
        await this.signupButton.click();
    }

    async signUp(username: string, password: string): Promise<string> {
        await this.navigateToSignUp();
        await this.fillUserName(username);
        await this.fillPassword(password);

        //register the signup dialog box event
        const dialogPromise = this.page.waitForEvent('dialog');
        await this.submitSignUp();

        const dialog = await dialogPromise;
        const message = dialog.message();
        await dialog.accept();

        return message;
    }
    
}
