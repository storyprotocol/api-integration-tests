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
          expect(typeof data.ip_id).toBe("string");
          expect(typeof data.license_template).toBe("string");
          expect(typeof data.license_terms_id).toBe("string");
          expect(typeof data.block_number).toBe("string");
          expect(typeof data.block_time).toBe("string");
          expect(data.id).toBeTruthy();
          expect(data.ip_id).toBeTruthy();
          expect(data.license_template).toBeTruthy();
          expect(data.license_terms_id).toBeTruthy();
          expect(data.block_number).toBeTruthy();
          expect(data.block_time).toBeTruthy();
        } else {
          expect(data).toMatchObject({
            id: "",
            ip_id: "",
            license_template: "",
            license_terms_id: "",
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