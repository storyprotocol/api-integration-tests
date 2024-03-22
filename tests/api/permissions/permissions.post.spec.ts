import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/permissions";

test.describe("List Permissions @Permissions", async () => {
  test("Should return default Permissions list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].permission).toBe("string");
    expect(typeof data[0].signer).toBe("string");
    expect(typeof data[0].to).toBe("string");
    expect(typeof data[0].func).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 4 } },
    { pagination: { offset: 2, limit: 3 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return Permissions list with pagination ${JSON.stringify(
      pagination
    )} @bug`, async ({ request }) => {
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

  const orderParams = [
    { orderBy: "id", orderDirection: "desc" },
    { orderBy: "id", orderDirection: "asc" },
    { orderBy: "permission", orderDirection: "desc" },
    { orderBy: "permission", orderDirection: "asc" },
    { orderBy: "signer", orderDirection: "desc" },
    { orderBy: "signer", orderDirection: "asc" },
    { orderBy: "to", orderDirection: "desc" },
    { orderBy: "to", orderDirection: "asc" },
    { orderBy: "func", orderDirection: "desc" },
    { orderBy: "func", orderDirection: "asc" },
    { orderBy: "blockNumber", orderDirection: "desc" },
    { orderBy: "blockNumber", orderDirection: "asc" },
    { orderBy: "blockTimestamp", orderDirection: "desc" },
    { orderBy: "blockTimestamp", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams) {
    test(`Should return Permissions list with order by ${orderBy} ${orderDirection} @bug`, async ({
      request,
    }) => {
      const payload = {
        options: { orderBy, orderDirection },
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

  const pageAndOrderParams = [
    {
      pagination: { offset: 0, limit: 5 },
      orderBy: "id",
      orderDirection: "asc",
    },
    {
      pagination: { offset: 1, limit: 3 },
      orderBy: "to",
      orderDirection: "desc",
    },
  ];
  for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
    test(`Should return Permissions list with pagination ${JSON.stringify(
      pagination
    )} and order by ${orderBy} ${orderDirection} @bug`, async ({ request }) => {
      const payload = {
        options: { pagination, orderBy, orderDirection },
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

  test("Should return Permissions list with filter", async ({
    request,
    permissionsList,
  }) => {
    const whereParams = [
      { where: { signer: permissionsList[1].signer }, exists: true },
      {
        where: { signer: "0xc7fffc7ba56026b471ae5f792a012e5a29c37999" },
        exists: false,
      },
      { where: { to: permissionsList[0].to }, exists: true },
      {
        where: { to: "0xc7fffc7ba56026b471ae5f792a012e5a29c37999" },
        exists: false,
      },
      {
        where: { signer: permissionsList[1].signer, to: permissionsList[1].to },
        exists: true,
      },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`Query with where ${JSON.stringify(where)}`, async () => {
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
          for (const item of data) {
            expect(item).toMatchObject(where);
          }
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return Permissions list with filter, order and pagination @bug", async ({
    request,
    permissionsList,
  }) => {
    const params = [
      {
        where: { signer: permissionsList[1].signer },
        orderBy: "to",
        orderDirection: "desc",
        pagination: { offset: 0, limit: 5 },
      },
      {
        where: { signer: permissionsList[0].signer, to: permissionsList[0].to },
        orderBy: "id",
        orderDirection: "asc",
        pagination: { offset: 0, limit: 3 },
      },
    ];
    for (const p of params) {
      await test.step(`Query with filter ${JSON.stringify(p.where)}, order by ${
        p.orderBy
      } and order direction ${
        p.orderDirection
      }, and pagination ${JSON.stringify(p.pagination)}`, async () => {
        const payload = {
          options: { ...p },
        };
        const response = await request.post(endpoint, {
          data: payload,
        });
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        expect(data.length).toBeGreaterThan(0);
        expect(data.length).toBeLessThanOrEqual(p.pagination.limit);
        for (let i = 0; i < data.length - 1; i++) {
          const item = data[i][p.orderBy].trim() || "\uFFFF";
          const nextItem = data[i + 1][p.orderBy].trim() || "\uFFFF";
          if (p.orderDirection === "asc") {
            expect(item <= nextItem).toBeTruthy();
          } else {
            expect(item >= nextItem).toBeTruthy();
          }
        }
        data.forEach((item: object) => {
          expect(item).toMatchObject(p.where);
        });
      });
    }
  });
});
