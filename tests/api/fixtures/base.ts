import { test as base } from "@playwright/test";

type TestOptions = {
  assets: Array<{
    id: string;
    chainId: string;
    tokenId: string;
    metadataResolverAddress: string;
    tokenContract: string;
    metadata: {
      registrant: string;
    }
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
    licenseTermsId: string;
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
    const response = await request.post("./assets");
    const { data } = await response.json();
    await use(data);
  },
  disputes: async ({ request }, use) => {
    const response = await request.post("./disputes");
    const { data } = await response.json();
    await use(data);
  },
  collections: async ({ request }, use) => {
    const response = await request.post("./collections");
    const { data } = await response.json();
    await use(data);
  },
  ipapolicies: async ({ request }, use) => {
    const response = await request.post("./ipapolicies");
    const { data } = await response.json();
    await use(data);
  },
  licenses: async ({ request }, use) => {
    const response = await request.post("./licenses");
    const { data } = await response.json();
    await use(data);
  },
  licensesMintingfees: async ({ request }, use) => {
    const response = await request.post("./licenses/mintingfees");
    const { data } = await response.json();
    await use(data);
  },
  licensesOwners: async ({ request }, use) => {
    const response = await request.post("./licenses/owners");
    const { data } = await response.json();
    await use(data);
  },
  modules: async ({ request }, use) => {
    const response = await request.post("./modules");
    const { data } = await response.json();
    await use(data);
  },
  permissionsList: async ({ request }, use) => {
    const response = await request.post("./permissions");
    const { data } = await response.json();
    await use(data);
  },
  policies: async ({ request }, use) => {
    const response = await request.post("./policies");
    const { data } = await response.json();
    await use(data);
  },
  policiesFrameworks: async ({ request }, use) => {
    const response = await request.post("./policies/frameworks");
    const { data } = await response.json();
    await use(data);
  },
  transactions: async ({ request }, use) => {
    const response = await request.post("./transactions");
    const { data } = await response.json();
    await use(data);
  },
  royaltiesPayments: async ({ request }, use) => {
    const response = await request.post("./royalties/payments");
    const { data } = await response.json();
    await use(data);
  },
  royaltiesPolicies: async ({ request }, use) => {
    const response = await request.post("./royalties/policies");
    const { data } = await response.json();
    await use(data);
  },
});
export { expect } from "@playwright/test";
