import { test, expect } from "@playwright/test";

const endpoint = "/api/v1/assets";

test.describe("Get an IPAsset @IPAssets", () => {
  const params = [
    { assetId: "0x5843de906c68c55f0870a7ee6391eee81723dc17", exists: true },
    { assetId: "0xac05ed0d029e2441067df38da387ea5b5e6d6999", exists: false },
  ];
  for (const { assetId, exists } of params) {
    test(`Should return the IPAsset detail with assetId ${assetId}`, async ({
      request,
    }) => {
      const response = await request.get(endpoint + `/${assetId}`);
      expect(response.ok()).toBeTruthy();

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      console.log(data);
      if (exists) {
        expect(data.id).toBe(assetId);
        expect(typeof data.tokenId).toBe("string");
        expect(typeof data.chainId).toBe("string");
        expect(Array.isArray(data.parentIpIds)).toBeTruthy();
        expect(Array.isArray(data.childIpIds)).toBeTruthy();
        expect(Array.isArray(data.rootIpIds)).toBeTruthy();
        expect(typeof data.metadataResolverAddress).toBe("string");
        expect(typeof data.metadata.name).toBe("string");
        expect(typeof data.metadata.hash).toBe("string");
        expect(typeof data.metadata.uri).toBe("string");
        expect(typeof data.metadata.registrant).toBe("string");
        expect(typeof data.metadata.registrationDate).toBe("string");
        expect(typeof data.blockNumber).toBe("string");
        expect(typeof data.blockTimestamp).toBe("string");
      } else {
        expect(data).toBeNull();
      }
    });
  }

  test("Should return 403 for no assetId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(403);
  });

  test("Should return 500 for invalid assetId", async ({ request }) => {
    const response = await request.get(endpoint + `/invalid-asset-id`);
    expect(response.status()).toBe(500);
  });
});
