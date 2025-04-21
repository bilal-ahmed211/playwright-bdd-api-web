export const WebElements: any = {

    HomePage: {
        HomePageHeadingText: 'Home Page',
        CreateNewAccountLocator: "header[class='page-header'] li:nth-child(3) a:nth-child(1)",
        SignInLink: "div[class='panel header'] li[data-label='or'] a",
    },

    RegisterPage: {
        RegisterPageHeadingText: 'Create New Customer Account',
        FirstNameTxt: '#firstname',
        LastNameTxt: '#lastname',
        RegEmailTxt: '#email_address',
        RegPassword: '#password',
        RegConfirmPassword: '#password-confirmation',
        CreateAccountBtn: "button[title='Create an Account']",
        AccountCreationSuccessMessage: "div[data-bind='html: $parent.prepareMessageForHtml(message.text)']",
        ErrorMessageAlertBoxLocator: "div[data-bind='html: $parent.prepareMessageForHtml(message.text)']",
        PasswordMinLengthErrorMsgLocator: "#password-error",
        PasswordMismatchErrorMsgLocator: "#password-confirmation-error",
        FirstNameBlankErrorMsgLocator: "#firstname-error",
        EmailFieldErrorMsgLocator: "#email_address-error",
    },

    LoginPage: {
        LoginFormHeadingText: 'Customer Login',
        EmailTxtLocator: '#email',
        EmailTextbox: 'sign in with your email address.',
        EmailPlaceholder: 'email@example.com',
        PasswordLocator: "//fieldset[@class='fieldset login']//input[@id='pass']",
        PasswordTextbox: 'Password',
        SigninBtnText: 'Sign In',
        SigninBtnLocator: "//fieldset[@class='fieldset login']//span[contains(text(),'Sign In')]",
        WelcomeMessageOnHeaderLocator: "div[class='panel header'] span[class='logged-in']",
        EmailErrorMessageLocator: "#email-error",
        PasswordErrorMessageLocator: "#pass-error",
    },

    CustomerAccountPage: {
        ContactInformationLabel: 'Contact Information',
        CustomerEmailText: '',
        SignoutArrowLocator: "//div[@aria-hidden='false']//a[normalize-space()='Sign Out']",
    },

    ProductSearchPage: {
        NoResultMessageLocator: "div[class='message notice'] div",
    }
}