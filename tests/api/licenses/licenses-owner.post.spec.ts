import { test, expect } from "../fixtures/base";

const endpoint = "./licenses/owners";

test.describe("List License Owners @Licenses Owners", async () => {
  test("Should return default License Owners list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].owner).toBe("string");
    expect(typeof data[0].policyId).toBe("string");
    expect(typeof data[0].amount).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 4 } },
    { pagination: { offset: 2, limit: 3 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return License Owners list with pagination ${JSON.stringify(
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
      const firstItem = offsetJson.data[payload.options.pagination.offset];

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeLessThanOrEqual(payload.options.pagination.limit);
      expect(data[0]).toMatchObject(firstItem);
    });
  }

  const orderParams = [
    { orderBy: "id", orderDirection: "desc" },
    { orderBy: "id", orderDirection: "asc" },
    { orderBy: "owner", orderDirection: "desc" },
    { orderBy: "owner", orderDirection: "asc" },
    { orderBy: "policyId", orderDirection: "desc" },
    { orderBy: "policyId", orderDirection: "asc" },
    { orderBy: "amount", orderDirection: "desc" },
    { orderBy: "amount", orderDirection: "asc" },
    { orderBy: "blockNumber", orderDirection: "desc" },
    { orderBy: "blockNumber", orderDirection: "asc" },
    { orderBy: "blockTimestamp", orderDirection: "desc" },
    { orderBy: "blockTimestamp", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams) {
    test(`Should return License Owners list with order by ${orderBy} and order direction ${orderDirection}`, async ({
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
        let item: string | number;
        let nextItem: string | number;
        if (orderBy === "amount") {
          item = parseInt(data[i][orderBy]);
          nextItem = parseInt(data[i + 1][orderBy]);
        } else {
          item = data[i][orderBy].trim() || "\uFFFF";
          nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
        }
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
      pagination: { offset: 1, limit: 4 },
      orderBy: "owner",
      orderDirection: "asc",
    },
    {
      pagination: { offset: 2, limit: 3 },
      orderBy: "policyId",
      orderDirection: "desc",
    },
  ];
  for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
    test(`Should return License Owners list with pagination ${JSON.stringify(
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

  test("Should return License Owners list with filter", async ({
    request,
    licensesOwners,
  }) => {
    const whereParams = [
      { where: { owner: licensesOwners[1].owner }, exists: true },
      {
        where: { owner: "0x5efa65b48a5828778c0398baba8781317a0e4999" },
        exists: false,
      },
      { where: { policyId: licensesOwners[0].policyId }, exists: true },
      { where: { policyId: "0" }, exists: false },
      {
        where: {
          owner: licensesOwners[1].owner,
          policyId: licensesOwners[1].policyId,
        },
        exists: true,
      },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`Query with filter ${JSON.stringify(
        where
      )}`, async () => {
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
          data.forEach((item: object) => {
            expect(item).toMatchObject(where);
          });
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return Licenses Owners list with filter, order and pagination", async ({
    request,
    licensesOwners,
  }) => {
    const params = [
      {
        where: { policyId: licensesOwners[1].policyId },
        orderBy: "owner",
        orderDirection: "asc",
        pagination: { offset: 0, limit: 4 },
      },
      {
        where: {
          owner: licensesOwners[0].owner,
          policyId: licensesOwners[0].policyId,
        },
        orderBy: "policyId",
        orderDirection: "desc",
        pagination: { offset: 0, limit: 3 },
      },
    ];
    for (const p of params) {
      await test.step(`Query with filter ${JSON.stringify(p.where)}, order by ${
        p.orderBy
      } ${p.orderDirection} and pagination ${JSON.stringify(
        p.pagination
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
