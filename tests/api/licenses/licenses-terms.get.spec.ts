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
          expect(typeof data.json).toBe("string");
          expect(typeof data.license_template).toBe("string");
          expect(typeof data.block_time).toBe("string");
          expect(data.id).toBeTruthy();
          expect(data.json).toBeTruthy();
          expect(data.license_template).toBeTruthy();
          expect(data.block_time).toBeTruthy();
        } else {
          expect(data).toMatchObject({
            id: "",
            json: "",
            license_template: "",
            block_time: "",
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