import { test, expect } from "../fixtures/base";

const endpoint =  "./licenses/mintingfees";

test.describe("Get a Minting Fee @Licenses Minting Fees", async () => {
  test("Should return Licenses Minting Fees detail", async ({
    request,
    licensesMintingfees,
  }) => {
    const params = [
      { licenseMintingFeeId: licensesMintingfees[1].id, exists: true },
      { licenseMintingFeeId: "0x78b3264eaf8030999", exists: false },
    ];
    for (const { licenseMintingFeeId, exists } of params) {
      await test.step(`Query with licenseMintingFeeId ${licenseMintingFeeId}`, async () => {
        const response = await request.get(
          endpoint + `/${licenseMintingFeeId}`
        );
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(licenseMintingFeeId);
          expect(typeof data.token).toBe("string");
          expect(typeof data.payer).toBe("string");
          expect(typeof data.amount).toBe("string");
          expect(typeof data.receiverIpId).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return null for no licenseMintingFeeId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(200);
    const { data } = await response.json();
    expect(data).toBeNull();
  });
});
