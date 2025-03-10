import dotenv from 'dotenv';
dotenv.config();

import { SecretVaultWrapper } from 'secretvaults';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './orgConfig.js';

const SCHEMA_ID = process.env.COLLECTION_SCHEMA_ID;

const signalData = [
    {
        created_at: '2025-03-10T12:30:38.720+00:00',
        signal_text: { '%allot': "SELL YAKI 25.00% with a Confidence Score of 8.79." },
        events: { '%allot': '💰 YAKI was worth 0.0127$ on 2025-03-09\n\n💰 YAKI was worth 0.0127$ on 2025-03-09' }
    }
]

async function main() {
    try {
      const collection = new SecretVaultWrapper(
        orgConfig.nodes,
        orgConfig.orgCredentials,
        SCHEMA_ID
      );
      await collection.init();
  
    //   const dataWritten = await collection.writeToNodes(signalData);
    //   console.log('dataWritten', dataWritten);
  
    //   const newIds = [
    //     ...new Set(dataWritten.map((item) => item.data.created).flat()),
    //   ];
    //   console.log('created ids:', newIds);
  
      const dataRead = await collection.readFromNodes({});
      console.log('📚 total records:', dataRead.length);
      console.log(
        '📚 Read new records:',
        dataRead.slice(0, signalData.length)
      );
    } catch (error) {
      console.error('❌ Failed to use SecretVaultWrapper:', error.message);
      process.exit(1);
    }
  }
  
  main();