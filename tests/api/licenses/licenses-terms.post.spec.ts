import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/terms";

test.describe("List LicenseTerms @Licenses", () => {
  test("query with default", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].json).toBe("string");
    expect(typeof data[0].license_template).toBe("string");
    expect(typeof data[0].block_time).toBe("string");
    expect(data[0].id).toBeTruthy();
    expect(data[0].json).toBeTruthy();
    expect(data[0].license_template).toBeTruthy();
    expect(data[0].block_time).toBeTruthy();
    for (let i = 0; i < data.length - 1; i++) {
      const item = parseInt(data[i].block_time);
      const nextItem = parseInt(data[i + 1].block_time);
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
        data: { options: { pagination: { limit: 30 } } },
      });
      const offsetJson = await offsetResponse.json();
      const firstItem = offsetJson.data[pagination.offset];

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeLessThanOrEqual(pagination.limit);
      expect(data[0]).toMatchObject(firstItem);
    });
  }
});
