declare module "secretvaults" {
  export class SecretVaultWrapper {
    constructor(
      nodes: Array<{ url: string; did: string }>,
      credentials: { secretKey: string; orgDid: string },
      schemaId: string
    );
    init(): Promise<void>;
    readFromNodes(query: Record<string, any>): Promise<any>;
  }
}
