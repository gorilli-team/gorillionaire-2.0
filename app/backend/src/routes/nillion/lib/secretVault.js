// secretVault.js
let SecretVaultWrapper;

// Dynamic import
(async () => {
  const module = await import("secretvaults");
  SecretVaultWrapper = module.SecretVaultWrapper;
})();

const orgConfig = {
  orgCredentials: {
    secretKey: process.env.ORG_SECRET_KEY,
    orgDid: process.env.ORG_DID,
  },
  nodes: [
    {
      url: "https://nildb-nx8v.nillion.network",
      did: "did:nil:testnet:nillion1qfrl8nje3nvwh6cryj63mz2y6gsdptvn07nx8v",
    },
    {
      url: "https://nildb-p3mx.nillion.network",
      did: "did:nil:testnet:nillion1uak7fgsp69kzfhdd6lfqv69fnzh3lprg2mp3mx",
    },
    {
      url: "https://nildb-rugk.nillion.network",
      did: "did:nil:testnet:nillion1kfremrp2mryxrynx66etjl8s7wazxc3rssrugk",
    },
  ],
};

let svWrapper = null;

async function getCollection(schemaId) {
  if (!SecretVaultWrapper) {
    throw new Error("SecretVaultWrapper is not loaded yet");
  }
  if (!svWrapper) {
    svWrapper = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      schemaId
    );
    await svWrapper.init();
  }
  return svWrapper;
}

async function readSignalsData(schemaId, query = {}) {
  const collection = await getCollection(schemaId);
  return collection.readFromNodes(query);
}

module.exports = {
  getCollection,
  readSignalsData,
};
