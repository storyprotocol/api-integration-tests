import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/terms";

test.describe("Get LicenseTerm @Licenses", () => {
  test("query with id param", async ({ request, licensesTerms }) => {
    const licenseTermId = licensesTerms[1].id;
    const response = await request.get(endpoint + `/${licenseTermId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(licenseTermId);
    expect.soft(Array.isArray(data.licenseTerms)).toBeTruthy();
    expect.soft(typeof data.licenseTemplate).toBe("string");
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTime).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.licenseTerms).toBeTruthy();
    expect.soft(data.licenseTemplate).toBeTruthy();
    expect.soft(data.blockNumber).toBeTruthy();
    expect.soft(data.blockTime).toBeTruthy();
  });

  test("query with non-exist id param", async ({ request }) => {
    const response = await request.get(endpoint + "/0");
    expect(response.status()).toBe(404);
  });

  test("query with no param", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
