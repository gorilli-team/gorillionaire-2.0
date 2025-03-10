import dotenv from 'dotenv';
dotenv.config();

import { SecretVaultWrapper } from 'secretvaults';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './orgConfig.js';

const SCHEMA_ID = process.env.COLLECTION_SCHEMA_ID;

export async function pushNewSignalsToSecretVault(signalsToBePushed) {
    try {
      const collection = new SecretVaultWrapper(
        orgConfig.nodes,
        orgConfig.orgCredentials,
        SCHEMA_ID
      );
      await collection.init();
  
      const dataWritten = await collection.writeToNodes(signalsToBePushed);
      console.log('dataWritten', dataWritten);
  
      const newIds = [
        ...new Set(dataWritten.map((item) => item.data.created).flat()),
      ];
      console.log('created ids:', newIds);
  
      const dataRead = await collection.readFromNodes({});
      console.log('📚 total records:', dataRead.length);
      console.log(
        '📚 Read new records:',
        dataRead.slice(0, signalsToBePushed.length)
      );
    } catch (error) {
      console.error('❌ Failed to use SecretVaultWrapper:', error.message);
      process.exit(1);
    }
  }