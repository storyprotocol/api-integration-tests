import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/assets";

test.describe("Get an IPAsset @IPAssets", () => {
  test("Should return the IPAsset detail", async ({ request, assets }) => {
    const params = [
      { assetId: assets[1].id, exists: true },
      { assetId: "0xac05ed0d029e2441067df38da387ea5b5e6d6999", exists: false },
    ];
    for (const { assetId, exists } of params) {
      await test.step(`Should return the IPAsset detail with assetId ${assetId}`, async () => {
        const response = await request.get(endpoint + `/${assetId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
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
  });

  test("Should return 404 for no assetId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
