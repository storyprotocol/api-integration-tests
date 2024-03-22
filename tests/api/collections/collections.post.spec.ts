import { test, expect } from "@playwright/test";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/collections";

test.describe("List Collections @Collections", async () => {
  test("Should return default Collections list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].assetCount).toBe("string");
    expect(typeof data[0].licensesCount).toBe("string");
    expect(typeof data[0].raisedDisputeCount).toBe("string");
    expect(typeof data[0].judgedDisputeCount).toBe("string");
    expect(typeof data[0].resolvedDisputeCount).toBe("string");
    expect(typeof data[0].cancelledDisputeCount).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 0, limit: 1 } },
    { pagination: { offset: 2, limit: 20 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return Collections list with pagination ${JSON.stringify(
      pagination
    )}`, async ({ request }) => {
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

  const orderParams1 = [
    { orderBy: "id", orderDirection: "desc" },
    { orderBy: "id", orderDirection: "asc" },
    { orderBy: "blockNumber", orderDirection: "desc" },
    { orderBy: "blockNumber", orderDirection: "asc" },
    { orderBy: "blockTimestamp", orderDirection: "desc" },
    { orderBy: "blockTimestamp", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams1) {
    test(`Should return IPAssets list ordered by ${orderBy} ${orderDirection}`, async ({
      request,
    }) => {
      const payload = {
        options: { orderBy: orderBy, orderDirection: orderDirection },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeGreaterThan(0);
      for (let i = 0; i < data.length - 1; i++) {
        const item = data[i][orderBy].trim() || "\uFFFF";
        const nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
        if (orderDirection === "asc") {
          expect(item <= nextItem).toBeTruthy();
        } else {
          expect(item >= nextItem).toBeTruthy();
        }
      }
    });
  }

  const orderParams2 = [
    { orderBy: "assetCount", orderDirection: "desc" },
    { orderBy: "assetCount", orderDirection: "asc" },
    { orderBy: "licensesCount", orderDirection: "desc" },
    { orderBy: "licensesCount", orderDirection: "asc" },
    { orderBy: "raisedDisputeCount", orderDirection: "desc" },
    { orderBy: "raisedDisputeCount", orderDirection: "asc" },
    { orderBy: "judgedDisputeCount", orderDirection: "desc" },
    { orderBy: "judgedDisputeCount", orderDirection: "asc" },
    { orderBy: "resolvedDisputeCount", orderDirection: "desc" },
    { orderBy: "resolvedDisputeCount", orderDirection: "asc" },
    { orderBy: "cancelledDisputeCount", orderDirection: "desc" },
    { orderBy: "cancelledDisputeCount", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams2) {
    test(`Should return IPAssets list ordered by count ${orderBy} ${orderDirection}`, async ({
      request,
    }) => {
      const payload = {
        options: { orderBy: orderBy, orderDirection: orderDirection },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeGreaterThan(0);
      for (let i = 0; i < data.length - 1; i++) {
        const item = parseInt(data[i][orderBy]);
        const nextItem = parseInt(data[i + 1][orderBy]);
        if (orderDirection === "asc") {
          expect(item).toBeLessThanOrEqual(nextItem);
        } else {
          expect(item).toBeGreaterThanOrEqual(nextItem);
        }
      }
    });
  }

  const pageAndOrderParams = [
    {
      pagination: { offset: 0, limit: 5 },
      orderBy: "assetCount",
      orderDirection: "asc",
    },
    {
      pagination: { offset: 0, limit: 15 },
      orderBy: "licensesCount",
      orderDirection: "desc",
    },
  ];
  for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
    test(`Should return IPAssets list with offset pagination ${JSON.stringify(
      pagination
    )} , orderBy ${orderBy} and orderDirection ${orderDirection}`, async ({
      request,
    }) => {
      const payload = {
        options: {
          pagination: pagination,
          orderBy: orderBy,
          orderDirection: orderDirection,
        },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data.length).toBeLessThanOrEqual(pagination.limit);
      for (let i = 0; i < data.length - 1; i++) {
        const item = parseInt(data[i][orderBy]);
        const nextItem = parseInt(data[i + 1][orderBy]);
        if (orderDirection === "asc") {
          expect(item).toBeLessThanOrEqual(nextItem);
        } else {
          expect(item).toBeGreaterThanOrEqual(nextItem);
        }
      }
    });
  }
});
