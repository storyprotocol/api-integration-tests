import { request, test, expect, APIRequestContext } from "@playwright/test";
import { ApiPrefix } from "../constants";
import crypto from "crypto";

test.describe("Should return 401 for invalid api key @API-KEY", () => {
  let context: APIRequestContext;
  test.beforeAll(async () => {
    context = await request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        accept: "application/json",
        "content-type": "application/json",
        "X-API-KEY": crypto.randomBytes(24).toString("base64url"),
      },
    });
  });

  test("Post /assets", async () => {
    const response = await context.post(ApiPrefix + "/assets");
    expect(response.status()).toBe(401);
  });

  test("Get /assets/{assetId}", async () => {
    const response = await context.get(ApiPrefix + "/assets/1");
    expect(response.status()).toBe(401);
  });

  test("Post /collections", async () => {
    const response = await context.post(ApiPrefix + "/collections");
    expect(response.status()).toBe(401);
  });

  test("Get /collections/{collectionId}", async () => {
    const response = await context.get(ApiPrefix + "/collections/1");
    expect(response.status()).toBe(401);
  });

  test("Post /disputes", async () => {
    const response = await context.post(ApiPrefix + "/disputes");
    expect(response.status()).toBe(401);
  });

  test("Get /disputes/{disputeId}", async () => {
    const response = await context.get(ApiPrefix + "/disputes/1");
    expect(response.status()).toBe(401);
  });

  test("Post /ipapolicies", async () => {
    const response = await context.post(ApiPrefix + "/ipapolicies");
    expect(response.status()).toBe(401);
  });

  test("Get /ipapolicies/{ipapolicyId}", async () => {
    const response = await context.get(ApiPrefix + "/ipapolicies/1");
    expect(response.status()).toBe(401);
  });

  test("Post /licenses", async () => {
    const response = await context.post(ApiPrefix + "/licenses");
    expect(response.status()).toBe(401);
  });

  test("Get /licenses/{licenseId}", async () => {
    const response = await context.get(ApiPrefix + "/licenses/1");
    expect(response.status()).toBe(401);
  });

  test("Post /licenses/mintingfees", async () => {
    const response = await context.post(ApiPrefix + "/licenses/mintingfees");
    expect(response.status()).toBe(401);
  });

  test("Get /licenses/mintingfees/{mintingfeeId}", async () => {
    const response = await context.get(ApiPrefix + "/licenses/mintingfees/1");
    expect(response.status()).toBe(401);
  });

  test("Post /licenses/owners", async () => {
    const response = await context.post(ApiPrefix + "/licenses/owners");
    expect(response.status()).toBe(401);
  });

  test("Get /licenses/owners/{ownerId}", async () => {
    const response = await context.get(ApiPrefix + "/licenses/owners/1");
    expect(response.status()).toBe(401);
  });

  test("Post /modules", async () => {
    const response = await context.post(ApiPrefix + "/modules");
    expect(response.status()).toBe(401);
  });

  test("Get /modules/{moduleId}", async () => {
    const response = await context.get(ApiPrefix + "/modules/1");
    expect(response.status()).toBe(401);
  });

  test("Post /permissions", async () => {
    const response = await context.post(ApiPrefix + "/permissions");
    expect(response.status()).toBe(401);
  });

  test("Get /permissions/{permissionId}", async () => {
    const response = await context.get(ApiPrefix + "/permissions/1");
    expect(response.status()).toBe(401);
  });

  test("Post /policies", async () => {
    const response = await context.post(ApiPrefix + "/policies");
    expect(response.status()).toBe(401);
  });

  test("Get /policies/{policyId}", async () => {
    const response = await context.get(ApiPrefix + "/policies/1");
    expect(response.status()).toBe(401);
  });

  test("Post /policies/frameworks", async () => {
    const response = await context.post(ApiPrefix + "/policies/frameworks");
    expect(response.status()).toBe(401);
  });

  test("Get /policies/frameworks/{frameworkId}", async () => {
    const response = await context.get(ApiPrefix + "/policies/frameworks/1");
    expect(response.status()).toBe(401);
  });

  test("Post /royalties/payments", async () => {
    const response = await context.post(ApiPrefix + "/royalties/payments");
    expect(response.status()).toBe(401);
  });

  test("Get /royalties/payments/{paymentId}", async () => {
    const response = await context.get(ApiPrefix + "/royalties/payments/1");
    expect(response.status()).toBe(401);
  });

  test("Post /royalties/policies", async () => {
    const response = await context.post(ApiPrefix + "/royalties/policies");
    expect(response.status()).toBe(401);
  });

  test("Get /royalties/policies/{policyId}", async () => {
    const response = await context.get(ApiPrefix + "/royalties/policies/1");
    expect(response.status()).toBe(401);
  });

  test("Get /royalties/splits/{splitId}", async () => {
    const response = await context.get(ApiPrefix + "/royalties/splits/1");
    expect(response.status()).toBe(401);
  });

  test("Post /transactions", async () => {
    const response = await context.post(ApiPrefix + "/transactions");
    expect(response.status()).toBe(401);
  });

  test("Get /transactions/{transactionId}", async () => {
    const response = await context.get(ApiPrefix + "/transactions/1");
    expect(response.status()).toBe(401);
  });
});
