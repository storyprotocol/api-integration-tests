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
    expect(Array.isArray(data[0].parentIpIds ?? [])).toBeTruthy();
    expect(Array.isArray(data[0].childIpIds ?? [])).toBeTruthy();
    expect(Array.isArray(data[0].rootIpIds ?? [])).toBeTruthy();
    expect(typeof data[0].nftMetadata.name).toBe("string");
    expect(typeof data[0].nftMetadata.chainId).toBe("string");
    expect(typeof data[0].nftMetadata.tokenId).toBe("string");
    expect(typeof data[0].nftMetadata.tokenUri).toBe("string");
    expect(typeof data[0].nftMetadata.imageUrl).toBe("string");
    expect(typeof data[0].nftMetadata.tokenContract).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
    expect(data[0].id).toBeTruthy();
    expect(data[0].nftMetadata.name).toBeTruthy();
    expect(data[0].nftMetadata.chainId).toBeTruthy();
    expect(data[0].nftMetadata.tokenId).toBeTruthy();
    expect(data[0].nftMetadata.tokenUri).toBeTruthy();
    expect(data[0].nftMetadata.tokenContract).toBeTruthy();
    expect(data[0].blockNumber).toBeTruthy();
    expect(data[0].blockTimestamp).toBeTruthy();
    for (let i = 0; i < data.length - 1; i++) {
      const item = parseInt(data[i].blockTimestamp);
      const nextItem = parseInt(data[i + 1].blockTimestamp);
      expect(item).toBeGreaterThanOrEqual(nextItem);
    }
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 2 } },
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
      expect(data.length).toBeLessThanOrEqual(pagination.limit);
      expect(data[0]).toMatchObject(firstItem);
    });
  }

  // const orderParams = [
  //   { orderBy: "id", orderDirection: "desc" },
  //   { orderBy: "id", orderDirection: "asc" },
  //   { orderBy: "blockNumber", orderDirection: "desc" },
  //   { orderBy: "blockNumber", orderDirection: "asc" },
  //   { orderBy: "blockTimestamp", orderDirection: "desc" },
  //   { orderBy: "blockTimestamp", orderDirection: "asc" },
  // ];
  // for (const { orderBy, orderDirection } of orderParams) {
  //   test(`Should return IPAssets list ordered by ${orderBy} ${orderDirection}`, async ({
  //     request,
  //   }) => {
  //     const payload = {
  //       options: { orderBy: orderBy, orderDirection: orderDirection },
  //     };
  //     const response = await request.post(endpoint, {
  //       data: payload,
  //     });
  //     expect(response.status()).toBe(200);

  //     const { errors, data } = await response.json();
  //     expect(errors).toBeUndefined();
  //     expect(data.length).toBeGreaterThan(0);
  //     for (let i = 0; i < data.length - 1; i++) {
  //       let item = data[i][orderBy].trim() || "\uFFFF";
  //       let nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
  //       if(orderBy === "tokenId"){
  //         item = parseInt(data[i][orderBy]);
  //         nextItem = parseInt(data[i + 1][orderBy]);
  //       }
  //       if (orderDirection === "asc") {
  //         expect(item <= nextItem).toBeTruthy();
  //       } else {
  //         expect(item >= nextItem).toBeTruthy();
  //       }
  //     }
  //   });
  // }

  test("Should return IPAssets list with filter", async ({
    request,
    assets,
  }) => {
    const whereParams = [
      { where: { chainId: assets[1].nftMetadata.chainId }, exists: true },
      { where: { chainId: "11100111" }, exists: false },
      { where: { tokenId: assets[2].nftMetadata.tokenId }, exists: true },
      { where: { tokenId: "99999999" }, exists: false },
      {
        where: { tokenContract: assets[2].nftMetadata.tokenContract },
        exists: true,
      },
      {
        where: { tokenContract: "0xc06189455340139e0edce0744d715ae43176c999" },
        exists: false,
      },
      {
        where: {
          chainId: assets[1].nftMetadata.chainId,
          tokenContract: assets[1].nftMetadata.tokenContract,
        },
        exists: true,
      },
      {
        where: {
          tokenId: "99999999",
          tokenContract: "0x3809f4128b0b33afb17576edafd7d4f4e2abe933",
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
            if (where.chainId) {
              expect(item["nftMetadata"]["chainId"]).toBe(where.chainId);
            }
            if (where.tokenId) {
              expect(item["nftMetadata"]["tokenId"]).toBe(where.tokenId);
            }
            if (where.tokenContract) {
              expect(item["nftMetadata"]["tokenContract"]).toBe(where.tokenContract);
            }
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
        orderBy: "id",
        orderDirection: "asc",
        where: {
          chainId: assets[0].nftMetadata.chainId,
          tokenContract: assets[0].nftMetadata.tokenContract,
        },
      },
      {
        pagination: { offset: 2, limit: 15 },
        orderBy: "id",
        orderDirection: "desc",
        where: {
          chainId: assets[1].nftMetadata.chainId,
          tokenContract: assets[1].nftMetadata.tokenContract,
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
        // for (let i = 0; i < data.length - 1; i++) {
        //   const item = parseInt(data[i][p.orderBy]);
        //   const nextItem = parseInt(data[i + 1][p.orderBy]);
        //   if (p.orderDirection === "asc") {
        //     expect(item).toBeLessThanOrEqual(nextItem);
        //   } else {
        //     expect(item).toBeGreaterThanOrEqual(nextItem);
        //   }
        // }
        data.forEach((item: object) => {
          if (p.where.chainId) {
            expect(item["nftMetadata"]["chainId"]).toBe(p.where.chainId);
          }
          if (p.where.tokenContract) {
            expect(item["nftMetadata"]["tokenContract"]).toBe(p.where.tokenContract);
          }
        });
      });
    }
  });
});

// npx playwright test tests/api/ipassets/assets.post.spec.ts
