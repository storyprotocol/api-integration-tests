# Test info

- Name: List LicenseTerms @Licenses >> query with pagination {"offset":0,"limit":5}
- Location: /home/runner/work/api-integration-tests/api-integration-tests/tests/api/licenses/licenses-terms.post.spec.ts:36:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 530
    at /home/runner/work/api-integration-tests/api-integration-tests/tests/api/licenses/licenses-terms.post.spec.ts:45:33
```

# Test source

```ts
   1 | import { test, expect } from "../fixtures/base";
   2 |
   3 | const endpoint = "./licenses/terms";
   4 |
   5 | test.describe("List LicenseTerms @Licenses", () => {
   6 |   test("query with default", async ({ request }) => {
   7 |     const response = await request.post(endpoint);
   8 |     expect(response.status()).toBe(200);
   9 |
  10 |     const { errors, data } = await response.json();
  11 |     expect(errors).toBeUndefined();
  12 |     expect(Array.isArray(data)).toBeTruthy();
  13 |     expect(data.length).toBeGreaterThan(0);
  14 |     expect(typeof data[0].id).toBe("string");
  15 |     expect(Array.isArray(data[0].licenseTerms)).toBeTruthy();
  16 |     expect(typeof data[0].licenseTemplate).toBe("string");
  17 |     expect(typeof data[0].blockNumber).toBe("string");
  18 |     expect(typeof data[0].blockTime).toBe("string");
  19 |     expect(data[0].id).toBeTruthy();
  20 |     expect(data[0].licenseTerms).toBeTruthy();
  21 |     expect(data[0].licenseTemplate).toBeTruthy();
  22 |     expect(data[0].blockNumber).toBeTruthy();
  23 |     expect(data[0].blockTime).toBeTruthy();
  24 |     for (let i = 0; i < data.length - 1; i++) {
  25 |       const item = parseInt(data[i].blockTime);
  26 |       const nextItem = parseInt(data[i + 1].blockTime);
  27 |       expect(item).toBeGreaterThanOrEqual(nextItem);
  28 |     }
  29 |   });
  30 |
  31 |   const pageParams = [
  32 |     { pagination: { offset: 0, limit: 5 } },
  33 |     { pagination: { offset: 1, limit: 4 } },
  34 |   ];
  35 |   for (const { pagination } of pageParams) {
  36 |     test(`query with pagination ${JSON.stringify(pagination)}`, async ({
  37 |       request,
  38 |     }) => {
  39 |       const payload = {
  40 |         options: { pagination: pagination },
  41 |       };
  42 |       const response = await request.post(endpoint, {
  43 |         data: payload,
  44 |       });
> 45 |       expect(response.status()).toBe(200);
     |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  46 |
  47 |       const offsetResponse = await request.post(endpoint, {
  48 |         data: { options: { pagination: { limit: 5 } } },
  49 |       });
  50 |       const offsetJson = await offsetResponse.json();
  51 |       const firstItem = offsetJson.data[pagination.offset];
  52 |
  53 |       const { errors, data } = await response.json();
  54 |       expect(errors).toBeUndefined();
  55 |       expect(data.length).toBeLessThanOrEqual(pagination.limit);
  56 |       expect(data[0]).toMatchObject(firstItem);
  57 |     });
  58 |   }
  59 | });
  60 |
```