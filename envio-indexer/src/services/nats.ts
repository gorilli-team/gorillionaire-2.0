// Create a new NATS client Service
import { connect, headers } from 'nats';

const NATS_NEWPAIR_SUBJECT = `${process.env.NATS_ENVIO_SUBJECT_PREFIX}.newpair`;
const NATS_URL = process.env.NATS_URL;
// Subscribe to the NATS subject
const publish = async (subject: string, message: Uint8Array | string) => {
  try { 
    const nc = await connect({ servers: NATS_URL });
    const js = nc.jetstream();
    const h = headers();
    h.set('Origin', 'envio-indexer');
    h.set('Timestamp', new Date().toISOString());
    const pa = await js.publish(subject, message, { headers: h, timeout: 1000 * 60 });
    console.log(`Published to stream ${pa.stream}, sequence: ${pa.seq}`);
    await nc.drain();
    // await nc.flush();
    // await nc.close();
  } catch (error) {
    console.error("Error publishing message", error);
  }
};

export { NATS_NEWPAIR_SUBJECT, publish };

