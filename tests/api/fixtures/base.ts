import { test as base } from "@playwright/test";
import { ApiPrefix } from "../../constants";

type TestOptions = {
  assets: Array<{
    id: string;
    chainId: string;
    tokenId: string;
    metadataResolverAddress: string;
    tokenContract: string;
  }>;
  disputes: Array<{
    id: string;
    targetIpId: string;
    targetTag: string;
    currentTag: string;
    initiator: string;
  }>;
  collections: Array<{
    id: string;
  }>;
  ipapolicies: Array<{
    id: string;
    ipId: string;
    policyId: string;
    active: boolean;
    inherited: boolean;
  }>;
  licenses: Array<{
    id: string;
    policyId: string;
    licensorIpId: string;
    transferable: boolean;
  }>;
  licensesMintingfees: Array<{
    id: string;
    token: string;
    payer: string;
    receiverIpId: string;
  }>;
  licensesOwners: Array<{
    id: string;
    owner: string;
    policyId: string;
  }>;
  modules: Array<{
    id: string;
    name: string;
  }>;
  permissionsList: Array<{
    id: string;
    signer: string;
    to: string;
  }>;
  policies: Array<{
    id: string;
    mintingFeeToken: string;
    policyFrameworkManager: string;
    royaltyPolicy: boolean;
  }>;
  policiesFrameworks: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  transactions: Array<{
    id: string;
    ipId: string;
    resourceId: string;
    actionType: string;
  }>;
  royaltiesPayments: Array<{
    id: string;
    payerIpId: string;
    receiverIpId: string;
    sender: string;
    token: string;
  }>;
  royaltiesPolicies: Array<{
    id: string;
    splitClone: string;
  }>;
};

export const test = base.extend<TestOptions>({
  assets: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/assets");
    const { data } = await response.json();
    await use(data);
  },
  disputes: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/disputes");
    const { data } = await response.json();
    await use(data);
  },
  collections: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/collections");
    const { data } = await response.json();
    await use(data);
  },
  ipapolicies: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/ipapolicies");
    const { data } = await response.json();
    await use(data);
  },
  licenses: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/licenses");
    const { data } = await response.json();
    await use(data);
  },
  licensesMintingfees: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/licenses/mintingfees");
    const { data } = await response.json();
    await use(data);
  },
  licensesOwners: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/licenses/owners");
    const { data } = await response.json();
    await use(data);
  },
  modules: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/modules");
    const { data } = await response.json();
    await use(data);
  },
  permissionsList: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/permissions");
    const { data } = await response.json();
    await use(data);
  },
  policies: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/policies");
    const { data } = await response.json();
    await use(data);
  },
  policiesFrameworks: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/policies/frameworks");
    const { data } = await response.json();
    await use(data);
  },
  transactions: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/transactions");
    const { data } = await response.json();
    await use(data);
  },
  royaltiesPayments: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/royalties/payments");
    const { data } = await response.json();
    await use(data);
  },
  royaltiesPolicies: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/royalties/policies");
    const { data } = await response.json();
    await use(data);
  },
});
export { expect } from "@playwright/test";
