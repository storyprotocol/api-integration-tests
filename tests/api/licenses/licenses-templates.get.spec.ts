import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/templates";

test.describe("Get LicenseTemplate @Licenses", () => {
  test("query with id param", async ({ request, licensesTemplates }) => {
    const params = [
      { licenseTemplateId: licensesTemplates[0].id, exists: true },
      { licenseTemplateId: "1", exists: false },
    ];
    for (const { licenseTemplateId, exists } of params) {
      await test.step(`Query with licenseTemplateId ${licenseTemplateId}`, async () => {
        const response = await request.get(endpoint + `/${licenseTemplateId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(licenseTemplateId);
          expect.soft(typeof data.name).toBe("string");
          expect.soft(typeof data.metadataUri).toBe("string");
          expect.soft(typeof data.blockNumber).toBe("string");
          expect.soft(typeof data.blockTime).toBe("string");
          expect.soft(data.id).toBeTruthy();
          expect.soft(data.name).toBeTruthy();
          expect.soft(data.metadataUri).toBeTruthy();
          expect.soft(data.blockNumber).toBeTruthy();
          expect.soft(data.blockTime).toBeTruthy();
        } else {
          expect(data).toMatchObject({
            id: "",
            name: "",
            metadataUri: "",
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
