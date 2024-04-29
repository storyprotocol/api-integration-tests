import { test, expect } from "../fixtures/base";

const endpoint =  "./assets";

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
          expect(Array.isArray(data.parentIpIds ?? [])).toBeTruthy();
          expect(Array.isArray(data.childIpIds ?? [])).toBeTruthy();
          expect(Array.isArray(data.rootIpIds ?? [])).toBeTruthy();
          expect(typeof data.nftMetadata.name).toBe("string");
          expect(typeof data.nftMetadata.chainId).toBe("string");
          expect(typeof data.nftMetadata.tokenId).toBe("string");
          expect(typeof data.nftMetadata.tokenUri).toBe("string");
          expect(typeof data.nftMetadata.imageUrl).toBe("string");
          expect(typeof data.nftMetadata.tokenContract).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
          expect(data.id).toBeTruthy();
          expect(data.nftMetadata.name).toBeTruthy();
          expect(data.nftMetadata.chainId).toBeTruthy();
          expect(data.nftMetadata.tokenId).toBeTruthy();
          expect(data.nftMetadata.tokenUri).toBeTruthy();
          expect(data.nftMetadata.tokenContract).toBeTruthy();
          expect(data.blockNumber).toBeTruthy();
          expect(data.blockTimestamp).toBeTruthy();
        } else {
          expect(data.id).toBeFalsy();
        }
      });
    }
  });

  test("Should return 404 for no assetId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
