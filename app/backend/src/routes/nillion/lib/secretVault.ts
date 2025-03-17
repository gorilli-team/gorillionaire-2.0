import { env } from "../../../services/Env";

interface Node {
  url: string;
  did: string;
}

interface OrgCredentials {
  secretKey: string;
  orgDid: string;
}

interface OrgConfig {
  orgCredentials: OrgCredentials;
  nodes: Node[];
}

let svWrapper: any = null;

const orgConfig: OrgConfig = {
  orgCredentials: {
    secretKey: env.nillion.orgSecretKey,
    orgDid: env.nillion.orgDid,
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

async function getCollection(schemaId: string): Promise<any> {
  if (!svWrapper) {
    const { SecretVaultWrapper } = await import("secretvaults");
    svWrapper = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      schemaId
    );
    await svWrapper.init();
  }
  return svWrapper;
}

async function readSignalsData(
  schemaId: string,
  query: Record<string, any> = {}
): Promise<any> {
  const collection = await getCollection(schemaId);
  return collection.readFromNodes(query);
}

export { getCollection, readSignalsData };
