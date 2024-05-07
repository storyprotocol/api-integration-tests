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
          expect.soft(typeof data.licensorIpId).toBe("string");
          expect.soft(typeof data.licenseTemplate).toBe("string");
          expect.soft(typeof data.licenseTermsId).toBe("string");
          expect.soft(typeof data.transferable).toBe("string");
          expect.soft(typeof data.owner).toBe("string");
          expect.soft(typeof data.mintedAt).toBe("string");
          expect.soft(typeof data.expiresAt).toBe("string");
          expect.soft(typeof data.burntAt).toBe("string");
          expect.soft(typeof data.blockNumber).toBe("string");
          expect.soft(typeof data.blockTime).toBe("string");
          expect.soft(data.id).toBeTruthy();
          expect.soft(data.licensorIpId).toBeTruthy();
          expect.soft(data.licenseTemplate).toBeTruthy();
          expect.soft(data.licenseTermsId).toBeTruthy();
          expect.soft(data.transferable).toBeTruthy();
          expect.soft(data.owner).toBeTruthy();
          expect.soft(data.mintedAt).toBeTruthy();
          expect.soft(data.expiresAt).toBeTruthy();
          expect.soft(data.burntAt).toBeTruthy();
          expect.soft(data.blockNumber).toBeTruthy();
          expect.soft(data.blockTime).toBeTruthy();
        } else {
          expect(data).toMatchObject({
            id: "",
            licensorIpId: "",
            licenseTemplate: "",
            licenseTermsId: "",
            transferable: "",
            owner: "",
            mintedAt: "",
            expiresAt: "",
            burntAt: "",
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
