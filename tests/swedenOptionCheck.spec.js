/* 
test cases included in this file:
- Verify Sweden is present and selectable in the dropdown
- Verify form submission with Sweden selected
- Verify dropdown functionality on mobile devices
- Verify focus state on the dropdown
*/

const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const { SignupPage } = require("../tests/pages/SignupPage");
const data = require("../tests/data/data.json");

test.describe("Country Dropdown Verification", () => {
  let signupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.navigate();
    await signupPage.handleConsent();
  });

  test("Verify Sweden is present and selectable in the dropdown", async () => {
    await signupPage.selectCountry(data.swedenOption);

    // Verify that Sweden is present and selected
    const selectedText = await signupPage.page.inputValue(
      signupPage.countryInputSelector
    );
    expect(selectedText).toBe(data.swedenOption);
  });

  test("Verify form submission with Sweden selected", async () => {
    await signupPage.selectCountry(data.swedenOption);

    // Generate random values using faker
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = `${faker.internet.userName()}@circula.com`;
    const password = faker.internet.password();
    const companyName = faker.company.name();
    const description = faker.lorem.sentence();

    // Fill out the rest of the form
    await signupPage.fillForm({
      firstName,
      lastName,
      email,
      password,
      companyName,
      description,
    });

    // Verify form submission
    await expect(signupPage.page).toHaveURL(data.successUrl);
    const isMessageVisible = await signupPage.page.isVisible(
      `text=${data.successMessage}`
    );
    expect(isMessageVisible).toBe(true);
  });

  test("Verify dropdown functionality on mobile devices", async ({
    browser,
  }) => {
    // Create a new browser context with a mobile viewport
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 }, // Mobile viewport size
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1", // Simulate a mobile user agent
    });

    const mobilePage = await context.newPage();
    const mobileSignupPage = new SignupPage(mobilePage);

    await mobileSignupPage.navigate();
    await mobileSignupPage.selectCountry(data.swedenOption);

    // Verify that "Sweden" is selected
    const selectedText = await mobilePage.inputValue(
      mobileSignupPage.countryInputSelector
    );
    expect(selectedText).toBe(data.swedenOption);

    // Close the context
    await context.close();
  });

  test("Verify focus state on the dropdown", async () => {
    await signupPage.page.click(signupPage.formSelector);

    const isCountryInputFocused = async () => {
      return await signupPage.page.evaluate(
        () => document.activeElement.id === "registration-country-input"
      );
    };

    let focused = false;
    while (!focused) {
      await signupPage.page.keyboard.press("Tab");
      focused = await isCountryInputFocused();
    }

    expect(await isCountryInputFocused()).toBe(true);
  });
});
