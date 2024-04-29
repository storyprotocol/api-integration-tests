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
    expect(typeof data[0].licensor_ip_id).toBe("string");
    expect(typeof data[0].license_template).toBe("string");
    expect(typeof data[0].license_terms_id).toBe("string");
    expect(typeof data[0].transferable).toBe("string");
    expect(typeof data[0].owner).toBe("string");
    expect(typeof data[0].minted_at).toBe("string");
    expect(typeof data[0].expires_at).toBe("string");
    expect(typeof data[0].burnt_at).toBe("string");
    expect(typeof data[0].block_number).toBe("string");
    expect(typeof data[0].block_time).toBe("string");
    expect(data[0].id).toBeTruthy();
    expect(data[0].licensor_ip_id).toBeTruthy();
    expect(data[0].license_template).toBeTruthy();
    expect(data[0].license_terms_id).toBeTruthy();
    expect(data[0].transferable).toBeTruthy();
    expect(data[0].owner).toBeTruthy();
    expect(data[0].minted_at).toBeTruthy();
    expect(data[0].expires_at).toBeTruthy();
    expect(data[0].burnt_at).toBeTruthy();
    expect(data[0].block_number).toBeTruthy();
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
});