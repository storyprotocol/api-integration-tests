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
          expect(typeof data.name).toBe("string");
          expect(typeof data.metadata_uri).toBe("string");
          expect(typeof data.block_number).toBe("string");
          expect(typeof data.block_time).toBe("string");
          expect(data.id).toBeTruthy();
          expect(data.name).toBeTruthy();
          expect(data.metadata_uri).toBeTruthy();
          expect(data.block_number).toBeTruthy();
          expect(data.block_time).toBeTruthy();
        } else {
          expect(data).toMatchObject({
            id: "",
            name: "",
            metadata_uri: "",
            block_number: "",
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
