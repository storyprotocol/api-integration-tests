import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/mintingfees";

test.describe("Get a Minting Fee @Licenses Minting Fees", async () => {
  test("Should return Licenses Minting Fees detail", async ({
    request,
    licensesMintingfees,
  }) => {
    const licenseMintingFeeId = licensesMintingfees[1].id;
    const response = await request.get(endpoint + `/${licenseMintingFeeId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(licenseMintingFeeId);
    expect.soft(typeof data.token).toBe("string");
    expect.soft(typeof data.payer).toBe("string");
    expect.soft(typeof data.amount).toBe("string");
    expect.soft(typeof data.receiverIpId).toBe("string");
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTimestamp).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.token).toBeTruthy();
    expect.soft(data.payer).toBeTruthy();
    expect.soft(data.amount).toBeTruthy();
    expect.soft(data.receiverIpId).toBeTruthy();
    expect.soft(data.blockNumber).toBeTruthy();
    expect.soft(data.blockTimestamp).toBeTruthy();
  });

  test("Should return 404 for non-exist licenseMintingFeeId", async ({
    request,
  }) => {
    const response = await request.get(endpoint + "/0x78b3264eaf8030999");
    expect(response.status()).toBe(404);
  });

  test("Should return null for no licenseMintingFeeId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
