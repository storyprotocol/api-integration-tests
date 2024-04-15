import { test, expect } from "../fixtures/base";

const endpoint = "./assets";

test.describe("List IPAssets @IPAssets", async () => {
  test("Should return default IPAssets list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].tokenId).toBe("string");
    expect(typeof data[0].chainId).toBe("string");
    expect(Array.isArray(data[0].parentIpIds)).toBeTruthy();
    expect(Array.isArray(data[0].childIpIds)).toBeTruthy();
    expect(Array.isArray(data[0].rootIpIds)).toBeTruthy();
    expect(typeof data[0].metadataResolverAddress).toBe("string");
    expect(typeof data[0].metadata.name).toBe("string");
    expect(typeof data[0].metadata.hash).toBe("string");
    expect(typeof data[0].metadata.uri).toBe("string");
    expect(typeof data[0].metadata.registrant).toBe("string");
    expect(typeof data[0].metadata.registrationDate).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 2 } },
    { pagination: { offset: 3, limit: 2 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return IPAssets list with pagination ${JSON.stringify(
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
      expect(data.length).toBe(pagination.limit);
      expect(data[0]).toMatchObject(firstItem);
    });
  }

  const orderParams = [
    { orderBy: "id", orderDirection: "desc" },
    { orderBy: "id", orderDirection: "asc" },
    { orderBy: "chainId", orderDirection: "desc" },
    { orderBy: "chainId", orderDirection: "asc" },
    { orderBy: "tokenContract", orderDirection: "desc" },
    { orderBy: "tokenContract", orderDirection: "asc" },
    { orderBy: "tokenId", orderDirection: "desc" },
    { orderBy: "tokenId", orderDirection: "asc" },
    { orderBy: "metadataResolverAddress", orderDirection: "desc" },
    { orderBy: "metadataResolverAddress", orderDirection: "asc" },
    { orderBy: "blockNumber", orderDirection: "desc" },
    { orderBy: "blockNumber", orderDirection: "asc" },
    { orderBy: "blockTimestamp", orderDirection: "desc" },
    { orderBy: "blockTimestamp", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams) {
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
        let item = data[i][orderBy].trim() || "\uFFFF";
        let nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
        if(orderBy === "tokenId"){
          item = parseInt(data[i][orderBy]);
          nextItem = parseInt(data[i + 1][orderBy]);
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
      orderBy: "blockTimestamp",
      orderDirection: "asc",
    },
    {
      pagination: { offset: 2, limit: 2 },
      orderBy: "tokenId",
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
      expect(data.length).toBe(pagination.limit);
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

  test("Should return IPAssets list with filter", async ({
    request,
    assets,
  }) => {
    const whereParams = [
      { where: { chainId: assets[1].chainId }, exists: true },
      { where: { chainId: "11100111" }, exists: false },
      { where: { tokenId: assets[2].tokenId }, exists: true },
      { where: { tokenId: "99999999" }, exists: false },
      {
        where: {
          metadataResolverAddress: assets[1].metadataResolverAddress,
        },
        exists: true,
      },
      {
        where: {
          metadataResolverAddress: "0x3809f4128b0b33afb17576edafd7d4f4e2abe999",
        },
        exists: false,
      },
      {
        where: { tokenContract: assets[2].tokenContract },
        exists: true,
      },
      {
        where: { tokenContract: "0xc06189455340139e0edce0744d715ae43176c999" },
        exists: false,
      },
      {
        where: {
          chainId: assets[1].chainId,
          tokenContract: assets[1].tokenContract,
        },
        exists: true,
      },
      {
        where: {
          tokenId: "99999999",
          metadataResolverAddress: "0x3809f4128b0b33afb17576edafd7d4f4e2abe933",
        },
        exists: false,
      },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`Should return IPAssets list with filter ${JSON.stringify(
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

  test("Should return IPAssets list with pagination, orderBy, orderDirection and filter", async ({
    request,
    assets,
  }) => {
    const params = [
      {
        pagination: { offset: 0, limit: 5 },
        orderBy: "tokenId",
        orderDirection: "asc",
        where: {
          chainId: assets[0].chainId,
          tokenContract: assets[0].tokenContract,
        },
      },
      {
        pagination: { offset: 2, limit: 15 },
        orderBy: "tokenId",
        orderDirection: "desc",
        where: {
          chainId: assets[1].chainId,
          tokenContract: assets[1].tokenContract,
        },
      },
    ];
    for (const p of params) {
      await test.step(`Should return IPAssets list with pagination ${JSON.stringify(
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
          const item = parseInt(data[i][p.orderBy]);
          const nextItem = parseInt(data[i + 1][p.orderBy]);
          if (p.orderDirection === "asc") {
            expect(item).toBeLessThanOrEqual(nextItem);
          } else {
            expect(item).toBeGreaterThanOrEqual(nextItem);
          }
        }
        data.forEach((item: object) => {
          expect(item).toMatchObject(p.where);
        });
      });
    }
  });
});

// npx playwright test tests/api/ipassets/assets.post.spec.ts
