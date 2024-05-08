import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/ip/terms";

test.describe("Get LicenseIpTerm @Licenses", () => {
  test("query with id param", async ({ request, licensesIpTerms }) => {
    const licenseIpTermId = licensesIpTerms[1].id;
    const response = await request.get(endpoint + `/${licenseIpTermId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(licenseIpTermId);
    expect.soft(typeof data.ipId).toBe("string");
    expect.soft(typeof data.licenseTemplate).toBe("string");
    expect.soft(typeof data.licenseTermsId).toBe("string");
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTime).toBe("string");
    expect.soft(data.ipId).toBeTruthy();
    expect.soft(data.licenseTemplate).toBeTruthy();
    expect.soft(data.licenseTermsId).toBeTruthy();
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
