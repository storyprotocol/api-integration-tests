import { test, expect } from "../fixtures/base";

const endpoint = "./licenses";

test.describe("List Licenses @Licenses", async () => {
  test("Should return default Licenses list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].licenseTermsId).toBe("string");
    expect(typeof data[0].licensorIpId).toBe("string");
    expect(typeof data[0].licenseTemplate).toBe("string");
    expect(typeof data[0].transferable).toBe("boolean");
    expect(typeof data[0].owner).toBe("string");
    expect(typeof data[0].mintedAt).toBe("string");
    expect(typeof data[0].expiresAt).toBe("string");
    expect(typeof data[0].burntAt).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTime).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 4 } },
    { pagination: { offset: 2, limit: 3 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return Licenses list with pagination ${JSON.stringify(
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
    { orderBy: "licenseTermsId", orderDirection: "desc" },
    { orderBy: "licenseTermsId", orderDirection: "asc" },
    { orderBy: "licensorIpId", orderDirection: "desc" },
    { orderBy: "licensorIpId", orderDirection: "asc" },
    { orderBy: "amount", orderDirection: "desc" },
    { orderBy: "amount", orderDirection: "asc" },
    { orderBy: "transferable", orderDirection: "desc" },
    { orderBy: "transferable", orderDirection: "asc" },
    { orderBy: "blockNumber", orderDirection: "desc" },
    { orderBy: "blockNumber", orderDirection: "asc" },
    { orderBy: "blockTime", orderDirection: "desc" },
    { orderBy: "blockTime", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams) {
    test(`Should return Licenses list ordered by ${orderBy} ${orderDirection}`, async ({
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
        } else if (orderBy === "transferable") {
          item = data[i][orderBy];
          nextItem = data[i + 1][orderBy];
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
      pagination: { offset: 0, limit: 5 },
      orderBy: "licenseTermsId",
      orderDirection: "desc",
    },
    {
      pagination: { offset: 1, limit: 3 },
      orderBy: "id",
      orderDirection: "asc",
    },
  ];
  for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
    test(`Should return Licenses list with pagination ${JSON.stringify(
      pagination
    )} , orderBy ${orderBy} and orderDirection ${orderDirection}`, async ({
      request,
    }) => {
      const payload = {
        options: {
          pagination,
          orderBy,
          orderDirection,
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

  test("Should return Licenses list with filter @bug", async ({
    request,
    licenses,
  }) => {
    const whereParams = [
      { where: { licensorIpId: licenses[1].licensorIpId }, exists: true },
      {
        where: { licensorIpId: "0x4f4eda51d35f19a8372bf3894fdc2dbeff73d999" },
        exists: false,
      },
      { where: { licenseTermsId: licenses[2].licenseTermsId }, exists: true },
      { where: { licenseTermsId: "0" }, exists: false },
      { where: { transferable: true }, exists: true },
      { where: { transferable: false }, exists: true },
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
          data.forEach((item: object) => {
            expect(item).toMatchObject(where);
          });
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return Licenses list with filter, order and pagination", async ({
    request,
    licenses,
  }) => {
    const params = [
      {
        pagination: { offset: 0, limit: 4 },
        orderBy: "licenseTermsId",
        orderDirection: "asc",
        where: { licenseTermsId: licenses[0].licenseTermsId, transferable: true },
      },
      {
        pagination: { offset: 0, limit: 3 },
        orderBy: "licensorIpId",
        orderDirection: "desc",
        where: {
          licensorIpId: licenses[1].licensorIpId,
          licenseTermsId: licenses[1].licenseTermsId,
        },
      },
    ];
    for (const p of params) {
      await test.step(`Query with pagination ${JSON.stringify(
        p.pagination
      )}, order by ${p.orderBy} and order direction ${
        p.orderDirection
      }, and filter ${JSON.stringify(p.where)}`, async () => {
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
