import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/tokens";

test.describe("Get LicenseToken @Licenses", () => {
  test("query with id param", async ({ request, licensesTokens }) => {
    const params = [
      { licenseTokenId: licensesTokens[1].id, exists: true },
      { licenseTokenId: "-1", exists: false },
    ];
    for (const { licenseTokenId, exists } of params) {
      await test.step(`Query with licenseTokenId ${licenseTokenId}`, async () => {
        const response = await request.get(endpoint + `/${licenseTokenId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(licenseTokenId);
          expect(typeof data.licensor_ip_id).toBe("string");
          expect(typeof data.license_template).toBe("string");
          expect(typeof data.license_terms_id).toBe("string");
          expect(typeof data.transferable).toBe("string");
          expect(typeof data.owner).toBe("string");
          expect(typeof data.minted_at).toBe("string");
          expect(typeof data.expires_at).toBe("string");
          expect(typeof data.burnt_at).toBe("string");
          expect(typeof data.block_number).toBe("string");
          expect(typeof data.block_time).toBe("string");
          expect(data.id).toBeTruthy();
          expect(data.licensor_ip_id).toBeTruthy();
          expect(data.license_template).toBeTruthy();
          expect(data.license_terms_id).toBeTruthy();
          expect(data.transferable).toBeTruthy();
          expect(data.owner).toBeTruthy();
          expect(data.minted_at).toBeTruthy();
          expect(data.expires_at).toBeTruthy();
          expect(data.burnt_at).toBeTruthy();
          expect(data.block_number).toBeTruthy();
          expect(data.block_time).toBeTruthy();
        } else {
          expect(data).toMatchObject({
            id: "",
            licensor_ip_id: "",
            license_template: "",
            license_terms_id: "",
            transferable: "",
            owner: "",
            minted_at: "",
            expires_at: "",
            burnt_at: "",
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
