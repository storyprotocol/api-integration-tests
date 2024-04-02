import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/transactions";

test.describe("List Transactions @Transactions", async () => {
  test("Should return default Transactions list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].initiator).toBe("string");
    expect(typeof data[0].ipId).toBe("string");
    expect(typeof data[0].resourceId).toBe("string");
    expect(typeof data[0].resourceType).toBe("string");
    expect(typeof data[0].actionType).toBe("string");
    expect(typeof data[0].createdAt).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 4 } },
    { pagination: { offset: 2, limit: 3 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return Transactions list with pagination ${JSON.stringify(
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

  const orderParams = [
    { orderBy: "id", orderDirection: "desc" },
    { orderBy: "id", orderDirection: "asc" },
    { orderBy: "initiator", orderDirection: "desc" },
    { orderBy: "initiator", orderDirection: "asc" },
    { orderBy: "ipId", orderDirection: "desc" },
    { orderBy: "ipId", orderDirection: "asc" },
    { orderBy: "resourceId", orderDirection: "desc" },
    { orderBy: "resourceId", orderDirection: "asc" },
    { orderBy: "resourceType", orderDirection: "desc" },
    { orderBy: "resourceType", orderDirection: "asc" },
    { orderBy: "actionType", orderDirection: "desc" },
    { orderBy: "actionType", orderDirection: "asc" },
    { orderBy: "createdAt", orderDirection: "desc" },
    { orderBy: "createdAt", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams) {
    test(`Should return Transactions list with order by ${orderBy} and order direction ${orderDirection} @bug`, async ({
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
      orderBy: "ipId",
      orderDirection: "desc",
    },
  ];
  for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
    test(`Should return Transactions list with pagination ${JSON.stringify(
      pagination
    )} and order by ${orderBy} ${orderDirection}`, async ({ request }) => {
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

  test("Should return Transactions list with filter", async ({
    request,
    transactions,
  }) => {
    const filterEmptyData = transactions.filter((t) => t.ipId);
    const whereParams = [
      {
        where: {
          ipId: filterEmptyData
            ? filterEmptyData[0].ipId
            : transactions[0].ipId,
        },
        exists: true,
      },
      {
        where: { ipId: "0x6465a15fc665329d7b129987f1fc4f824c579999" },
        exists: false,
      },
      { where: { resourceId: transactions[0].resourceId }, exists: true },
      {
        where: { resourceId: "0x292639452a975630802c17c9267169d93bd59999" },
        exists: false,
      },
      { where: { actionType: transactions[1].actionType }, exists: true },
      {
        where: {
          ipId: filterEmptyData
            ? filterEmptyData[0].ipId
            : transactions[0].ipId,
          actionType: filterEmptyData
            ? filterEmptyData[0].actionType
            : transactions[0].actionType,
        },
        exists: true,
      },
      {
        where: {
          resourceId: transactions[0].resourceId,
          actionType: transactions[0].actionType,
        },
        exists: true,
      },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`Query with ${JSON.stringify(where)}`, async () => {
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
          if (where.ipId?.trim() !== "") {
            for (const item of data) {
              expect(item).toMatchObject(where);
            }
          }
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return Transactions list with filter, order and pagination", async ({
    request,
    transactions,
  }) => {
    const params = [
      {
        where: { actionType: transactions[1].actionType },
        orderBy: "id",
        orderDirection: "asc",
        pagination: { offset: 1, limit: 5 },
      },
      {
        where: {
          actionType: transactions[0].actionType,
          resourceId: transactions[0].resourceId,
        },
        orderBy: "ipId",
        orderDirection: "desc",
        pagination: { offset: 0, limit: 4 },
      },
    ];
    for (const p of params) {
      await test.step(`Query with ${JSON.stringify(p)}`, async () => {
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
      });
    }
  });
});
