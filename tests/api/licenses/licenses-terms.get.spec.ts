import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/terms";

test.describe("Get LicenseTerm @Licenses", () => {
  test("query with id param", async ({ request, licensesTerms }) => {
    const params = [
      { licenseTermId: licensesTerms[1].id, exists: true },
      { licenseTermId: "0", exists: false },
    ];
    for (const { licenseTermId, exists } of params) {
      await test.step(`Query with licenseTermId ${licenseTermId}`, async () => {
        const response = await request.get(endpoint + `/${licenseTermId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
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
        } else {
          expect(data).toMatchObject({
            id: "",
            licenseTerms: [],
            licenseTemplate: "",
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