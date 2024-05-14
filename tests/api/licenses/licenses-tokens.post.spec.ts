import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/tokens";

test.describe("List LicenseTokens @Licenses", () => {
  test("query with default", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].licensorIpId).toBe("string");
    expect(typeof data[0].licenseTemplate).toBe("string");
    expect(typeof data[0].licenseTermsId).toBe("string");
    expect(typeof data[0].transferable).toBe("string");
    expect(typeof data[0].owner).toBe("string");
    expect(typeof data[0].mintedAt).toBe("string");
    expect(typeof data[0].expiresAt).toBe("string");
    expect(typeof data[0].burntAt).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTime).toBe("string");
    expect(data[0].id).toBeTruthy();
    expect(data[0].licensorIpId).toBeTruthy();
    expect(data[0].licenseTemplate).toBeTruthy();
    expect(data[0].licenseTermsId).toBeTruthy();
    expect(data[0].transferable).toBeTruthy();
    expect(data[0].owner).toBeTruthy();
    expect(data[0].mintedAt).toBeTruthy();
    expect(data[0].expiresAt).toBeTruthy();
    expect(data[0].burntAt).toBeTruthy();
    expect(data[0].blockNumber).toBeTruthy();
    expect(data[0].blockTime).toBeTruthy();
    for (let i = 0; i < data.length - 1; i++) {
      const item = parseInt(data[i].blockTime);
      const nextItem = parseInt(data[i + 1].blockTime);
      expect(item).toBeGreaterThanOrEqual(nextItem);
    }
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 4 } },
  ];
  for (const { pagination } of pageParams) {
    test(`query with pagination ${JSON.stringify(pagination)}`, async ({
      request,
    }) => {
      const payload = {
        options: { pagination: pagination },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const offsetResponse = await request.post(endpoint, {
        data: { options: { pagination: { limit: 5 } } },
      });
      const offsetJson = await offsetResponse.json();
      const firstItem = offsetJson.data[pagination.offset];

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeLessThanOrEqual(pagination.limit);
      expect(data[0]).toMatchObject(firstItem);
    });
  }

  test("query with filter", async ({ request, licensesTokens }) => {
    const whereParams = [
      { where: { licensorIpId: licensesTokens[1].licensorIpId }, exists: true },
      {
        where: { licensorIpId: "0x5FCeDadBbDF710Ac3C528F6Aac9D1bD9ac189999" },
        exists: false,
      },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`query with where ${JSON.stringify(where)}`, async () => {
        const payload = {
          options: { where },
        };
        const response = await request.post(endpoint, {
          data: payload,
        });
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.length).toBeGreaterThan(0);
          expect(data[0].licensorIpId).toBe(licensesTokens[1].licensorIpId);
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });
});
