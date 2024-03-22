import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/ipapolicies";

test.describe("List IPAPolicies @IPAPolicies", async () => {
  test("Should return default IPAPolicies list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].ipId).toBe("string");
    expect(typeof data[0].policyId).toBe("string");
    expect(typeof data[0].index).toBe("string");
    expect(typeof data[0].active).toBe("boolean");
    expect(typeof data[0].inherited).toBe("boolean");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 3 } },
    { pagination: { offset: 2, limit: 2 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return IPAPolicies list with pagination ${JSON.stringify(
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
      expect(data.length).toBe(pagination.limit);
      expect(data[0]).toMatchObject(firstItem);
    });
  }

  const orderParams = [
    { orderBy: "id", orderDirection: "desc" },
    { orderBy: "id", orderDirection: "asc" },
    { orderBy: "ipId", orderDirection: "desc" },
    { orderBy: "ipId", orderDirection: "asc" },
    { orderBy: "policyId", orderDirection: "desc" },
    { orderBy: "policyId", orderDirection: "asc" },
    { orderBy: "index", orderDirection: "desc" },
    { orderBy: "index", orderDirection: "asc" },
    { orderBy: "active", orderDirection: "desc" },
    { orderBy: "active", orderDirection: "asc" },
    { orderBy: "inherited", orderDirection: "desc" },
    { orderBy: "inherited", orderDirection: "asc" },
    { orderBy: "blockNumber", orderDirection: "desc" },
    { orderBy: "blockNumber", orderDirection: "asc" },
    { orderBy: "blockTimestamp", orderDirection: "desc" },
    { orderBy: "blockTimestamp", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams) {
    test(`Should return IPAPolicies list ordered by ${orderBy} ${orderDirection} @bug`, async ({
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

  const pageAndOrderParams = [
    {
      pagination: { offset: 1, limit: 3 },
      orderBy: "ipId",
      orderDirection: "asc",
    },
    {
      pagination: { offset: 2, limit: 2 },
      orderBy: "policyId",
      orderDirection: "desc",
    },
  ];
  for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
    test(`Should return IPAPolicies list with pagination ${JSON.stringify(
      pagination
    )} and ordered by ${orderBy} ${orderDirection} @bug`, async ({
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

  test("Should return IPAPolicies list with where filters @bug", async ({
    request,
    ipapolicies,
  }) => {
    const whereParams = [
      {
        where: { ipId: ipapolicies[0].ipId },
        exists: true,
      },
      {
        where: { ipId: "0x33f7825b06580c6b96210af5b86d8ea088332999" },
        exists: false,
      },
      { where: { policyId: ipapolicies[1].policyId }, exists: true },
      { where: { policyId: "999999" }, exists: false },
      { where: { active: true }, exists: true },
      { where: { active: false }, exists: true },
      { where: { inherited: true }, exists: true },
      { where: { inherited: false }, exists: true },
      {
        where: {
          ipId: ipapolicies[0].ipId,
          policyId: ipapolicies[0].policyId,
        },
        exists: true,
      },
      {
        where: {
          ipId: ipapolicies[2].ipId,
          policyId: ipapolicies[2].policyId,
          active: true,
        },
        exists: true,
      },
      {
        where: {
          ipId: "00x570a6aff516d7e0ad1c430b1d92e379030429cdbx1",
          policyId: "1",
          active: true,
          inherited: true,
        },
        exists: false,
      },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`Should return IPAPolicies list with where ${JSON.stringify(
        where
      )}`, async () => {
        const payload = {
          options: { where: where },
        };
        const response = await request.post(endpoint, {
          data: payload,
        });
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.length).toBeGreaterThan(0);
          data.forEach((item: object) => {
            expect(item).toMatchObject(where);
          });
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return IPAPolicies list with pagination, orders and filters", async ({
    request,
    ipapolicies,
  }) => {
    const params = [
      {
        pagination: { offset: 1, limit: 3 },
        orderBy: "id",
        orderDirection: "asc",
        where: {
          policyId: ipapolicies[1].policyId,
          active: ipapolicies[1].active,
          inherited: ipapolicies[1].inherited,
        },
      },
      {
        pagination: { offset: 0, limit: 2 },
        orderBy: "policyId",
        orderDirection: "desc",
        where: {
          ipId: ipapolicies[0].ipId,
          policyId: ipapolicies[0].policyId,
          active: ipapolicies[0].active,
          inherited: ipapolicies[0].inherited,
        },
      },
    ];
    for (const p of params) {
      await test.step(`Should return IPAPolicies list with pagination ${JSON.stringify(
        p.pagination
      )}, order by ${p.orderBy} ${p.orderDirection} and where ${JSON.stringify(
        p.where
      )}`, async () => {
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
