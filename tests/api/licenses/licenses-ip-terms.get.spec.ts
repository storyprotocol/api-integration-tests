import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/ip/terms";

test.describe("Get LicenseIpTerm @Licenses", () => {
  test("query with id param", async ({ request, licensesIpTerms }) => {
    const params = [
      { licenseIpTermId: licensesIpTerms[1].id, exists: true },
      { licenseIpTermId: "0", exists: false },
    ];
    for (const { licenseIpTermId, exists } of params) {
      await test.step(`Query with licenseIpTermId ${licenseIpTermId}`, async () => {
        const response = await request.get(endpoint + `/${licenseIpTermId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
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
        } else {
          expect(data).toMatchObject({
            id: "",
            ipId: "",
            licenseTemplate: "",
            licenseTermsId: "",
            blockNumber: "",
            blockTime: "",
          });
        }
      });
    }
  });

  test("query with no param", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});