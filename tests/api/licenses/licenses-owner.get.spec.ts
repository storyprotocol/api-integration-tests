import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/owners";

test.describe("Get a License Owner @Licenses Owners", async () => {
  test("Should return License Owner detail", async ({
    request,
    licensesOwners,
  }) => {
    const params = [
      { licenseOwnerId: licensesOwners[1].id, exists: true },
      { licenseOwnerId: "0x78b3264eaf8030999", exists: false },
    ];
    for (const { licenseOwnerId, exists } of params) {
      await test.step(`Query with licenseOwnerId ${licenseOwnerId}`, async () => {
        const response = await request.get(endpoint + `/${licenseOwnerId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(licenseOwnerId);
          expect(typeof data.owner).toBe("string");
          expect(typeof data.policyId).toBe("string");
          expect(typeof data.amount).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return null for no licenseOwnerId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(200);
    const { data } = await response.json();
    expect(data).toBeNull();
  });
});
