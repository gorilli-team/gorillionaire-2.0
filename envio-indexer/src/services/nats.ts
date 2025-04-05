// Create a new NATS client Service
import { connect, headers } from 'nats';

const NATS_NEWPAIR_SUBJECT = `${process.env.NATS_ENVIO_SUBJECT_PREFIX}.newpair`;
// Subscribe to the NATS subject
const publish = async (subject: string, message: Uint8Array | string) => {
  const natsUrl = process.env.NATS_URL;
  try { 
    const nc = await connect({ servers: natsUrl });
    const h = headers();
    h.set('Origin', 'envio-indexer');
    h.set('Timestamp', new Date().toISOString());
    nc.publish(subject, message, { headers: h });
    await nc.drain();
    // await nc.flush();
    // await nc.close();
  } catch (error) {
    console.error("Error publishing message", error);
  }
};

export { NATS_NEWPAIR_SUBJECT, publish };

