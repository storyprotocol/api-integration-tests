import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/licenses/mintingfees";

test.describe("List Minting Fees @Licenses Minting Fees", async () => {
  test("Should return default Minting Fees list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].token).toBe("string");
    expect(typeof data[0].payer).toBe("string");
    expect(typeof data[0].amount).toBe("string");
    expect(typeof data[0].receiverIpId).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 4 } },
    { pagination: { offset: 2, limit: 3 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return Minting Fees list with pagination ${JSON.stringify(
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
    { orderBy: "token", orderDirection: "desc" },
    { orderBy: "token", orderDirection: "asc" },
    { orderBy: "payer", orderDirection: "desc" },
    { orderBy: "payer", orderDirection: "asc" },
    { orderBy: "amount", orderDirection: "desc" },
    { orderBy: "amount", orderDirection: "asc" },
    { orderBy: "receiverIpId", orderDirection: "desc" },
    { orderBy: "receiverIpId", orderDirection: "asc" },
    { orderBy: "blockNumber", orderDirection: "desc" },
    { orderBy: "blockNumber", orderDirection: "asc" },
    { orderBy: "blockTimestamp", orderDirection: "desc" },
    { orderBy: "blockTimestamp", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams) {
    test(`Should return Minting Fees list with order by ${orderBy} and order direction ${orderDirection}`, async ({
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
      pagination: { offset: 2, limit: 3 },
      orderBy: "token",
      orderDirection: "desc",
    },
    {
      pagination: { offset: 1, limit: 4 },
      orderBy: "id",
      orderDirection: "asc",
    },
  ];
  for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
    test(`Should return Minting Fees list with pagination ${JSON.stringify(
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

  test("Should return Licenses Minting Fees list with filter ", async ({
    request,
    licensesMintingfees,
  }) => {
    const whereParams = [
      { where: { token: licensesMintingfees[1].token }, exists: true },
      {
        where: { token: "0x885f92EDED0a4662166e32347879101E40C51999" },
        exists: false,
      },
      { where: { payer: licensesMintingfees[0].payer }, exists: true },
      {
        where: { payer: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21999" },
        exists: false,
      },
      {
        where: { receiverIpId: licensesMintingfees[1].receiverIpId },
        exists: true,
      },
      {
        where: { receiverIpId: "0x26EDcB1090cdf352CF06dC5c6e083b6141519999" },
        exists: false,
      },
      {
        where: {
          token: licensesMintingfees[1].token,
          payer: licensesMintingfees[1].payer,
        },
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
          data.forEach((item: object) => {
            expect(item).toMatchObject(where);
          });
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return Licenses Minting Fees list with filter, order and pagination", async ({
    request,
    licensesMintingfees,
  }) => {
    const params = [
      {
        pagination: { offset: 0, limit: 3 },
        orderBy: "token",
        orderDirection: "desc",
        where: {
          token: licensesMintingfees[0].token,
          payer: licensesMintingfees[0].payer,
        },
      },
      {
        pagination: { offset: 0, limit: 4 },
        orderBy: "id",
        orderDirection: "asc",
        where: {
          token: licensesMintingfees[1].token,
          receiverIpId: licensesMintingfees[1].receiverIpId,
        },
      },
    ];
    for (const p of params) {
      await test.step(`Query with pagination ${JSON.stringify(
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
