import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/templates";

test.describe("List LicenseTemplates @Licenses", () => {
  test("query with default", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].name).toBe("string");
    expect(typeof data[0].metadataUri).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTime).toBe("string");
    expect(data[0].id).toBeTruthy();
    expect(data[0].name).toBeTruthy();
    expect(data[0].metadataUri).toBeTruthy();
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
      request, licensesTemplates
    }) => {
      const payload = {
        options: { pagination: pagination },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const offsetResponse = await request.post(endpoint, {
        data: { options: { pagination: { limit: 30 } } },
      });
      const offsetJson = await offsetResponse.json();
      const firstItem = offsetJson.data[pagination.offset];

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeLessThanOrEqual(pagination.limit);
      if (pagination.offset < licensesTemplates.length) {
        expect(data[0]).toMatchObject(firstItem);
      }
    });
  }
});
