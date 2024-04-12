import { test, expect } from "../fixtures/base";

const endpoint = "./licenses";

test.describe("Get a License @Licenses", async () => {
  test("Should return Licenses detail", async ({ request, licenses }) => {
    const params = [
      { licenseId: licenses[1].id, exists: true },
      { licenseId: "-1", exists: false },
    ];
    for (const { licenseId, exists } of params) {
      await test.step(`Query with licenseId ${licenseId}`, async () => {
        const response = await request.get(endpoint + `/${licenseId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(licenseId);
          expect(typeof data.licenseTermsId).toBe("string");
          expect(typeof data.licensorIpId).toBe("string");
          expect(typeof data.licenseTemplate).toBe("string");
          expect(typeof data.transferable).toBe("boolean");
          expect(typeof data.owner).toBe("string");
          expect(typeof data.mintedAt).toBe("string");
          expect(typeof data.expiresAt).toBe("string");
          expect(typeof data.burntAt).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTime).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no licenseId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
