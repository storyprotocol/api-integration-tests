import { test, expect } from "../fixtures/base";

const endpoint = "./assets";

test.describe("Get an IPAsset @IPAssets", () => {
  test("Should return the IPAsset detail", async ({ request, assets }) => {
    const assetId = assets[1].id;
    const response = await request.get(endpoint + `/${assetId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(assetId);
    expect.soft(Array.isArray(data.parentIpIds ?? [])).toBeTruthy();
    expect.soft(Array.isArray(data.childIpIds ?? [])).toBeTruthy();
    expect.soft(Array.isArray(data.rootIpIds ?? [])).toBeTruthy();
    expect.soft(typeof data.nftMetadata.name).toBe("string");
    expect.soft(typeof data.nftMetadata.chainId).toBe("string");
    expect.soft(typeof data.nftMetadata.tokenId).toBe("string");
    expect.soft(typeof data.nftMetadata.tokenUri).toBe("string");
    expect.soft(typeof data.nftMetadata.imageUrl).toBe("string");
    expect.soft(typeof data.nftMetadata.tokenContract).toBe("string");
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTimestamp).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.nftMetadata.name).toBeTruthy();
    expect.soft(data.nftMetadata.chainId).toBeTruthy();
    expect.soft(data.nftMetadata.tokenId).toBeTruthy();
    expect.soft(data.nftMetadata.tokenContract).toBeTruthy();
    expect.soft(data.blockNumber).toBeTruthy();
    expect.soft(data.blockTimestamp).toBeTruthy();
  });

  test("Should return 404 for non-exist assetId", async ({ request }) => {
    const response = await request.get(
      endpoint + "/0xac05ed0d029e2441067df38da387ea5b5e6d9999"
    );
    expect(response.status()).toBe(404);
  });

  test("Should return 404 for no assetId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
