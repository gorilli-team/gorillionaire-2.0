import dotenv from 'dotenv';
dotenv.config();

import { SecretVaultWrapper } from 'secretvaults';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './orgConfig.js';
import { fetchData } from './mongodb.js';

const SCHEMA_ID = process.env.COLLECTION_SCHEMA_ID;

const rawSignalData = await fetchData();

const formattedSignalData = rawSignalData.map((doc) => {

    let rawCreatedAt = new Date(doc.created_at);
    let formattedCreatedAt = rawCreatedAt.toISOString();

    return ({
        created_at: formattedCreatedAt,
        signal_text: {'%allot': doc.signal_text},
        events: { '%allot': doc.events}
    })
})

async function main() {
    try {
      const collection = new SecretVaultWrapper(
        orgConfig.nodes,
        orgConfig.orgCredentials,
        SCHEMA_ID
      );
      await collection.init();
  
    //   const dataWritten = await collection.writeToNodes(formattedSignalData);
    //   console.log('dataWritten', dataWritten);
  
    //   const newIds = [
    //     ...new Set(dataWritten.map((item) => item.data.created).flat()),
    //   ];
    //   console.log('created ids:', newIds);
  
      const dataRead = await collection.readFromNodes({});
      console.log('📚 total records:', dataRead.length);
      console.log(
        '📚 Read new records:',
        dataRead.slice(0, formattedSignalData.length)
      );
    } catch (error) {
      console.error('❌ Failed to use SecretVaultWrapper:', error.message);
      process.exit(1);
    }
  }
  
  main();