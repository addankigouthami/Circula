const { expect } = require("@playwright/test");

class SignupPage {
  constructor(page) {
    this.page = page;
    this.countryInputSelector = "#registration-country-input";
    this.swedenOptionSelector = "li#registration-country-item-11";
    this.formSelector = "#signup-form";
    this.consentsButtonSelector = "[data-testid='uc-accept-all-button']";
  }

  async navigate() {
    await this.page.goto("/users/sign_up");
  }

  async handleConsent() {
    const isConsentButtonVisible = await this.page.isVisible(
      this.consentsButtonSelector
    );
    if (isConsentButtonVisible) {
      await this.page.click(this.consentsButtonSelector);
    }
  }

  async selectCountry(country) {
    await this.page.click(this.countryInputSelector);
    await this.page.click(`text="${country}"`);
  }

  async fillForm({
    firstName,
    lastName,
    email,
    password,
    companyName,
    description,
  }) {
    await this.page.fill('input[name="firstname"]', firstName);
    await this.page.fill('input[name="lastname"]', lastName);
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.fill('input[name="organizationName"]', companyName);
    await this.page.fill('textarea[name="hdyhau"]', description);

    try {
      await this.page.check('input[name="acceptTos"]', { force: true });
    } catch (error) {
      await this.page.click("div.sc-bae72812-1.hOoKFb");
    }

    const isChecked = await this.page.isChecked('input[name="acceptTos"]');
    expect(isChecked).toBe(true);
    await this.page.click('button[type="submit"]');
  }
}

module.exports = { SignupPage };
