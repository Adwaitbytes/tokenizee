
/**
 * Arweave integration utility for storing and retrieving content
 * This is a simplified implementation that would need to be extended with actual Arweave SDK integration
 */

import Arweave from 'arweave';

const arweave = Arweave.init({
  host: 'localhost', // Hostname of your Arlocal instance
  port: 1984,          // Port of your Arlocal instance
  protocol: 'http',       // Protocol of your Arlocal instance
  timeout: 60000,
  logging: true,
});

import keyfile from '../../arweave-keyfile.json';

// AO Process ID for NewsWeave
export const AO_PROCESS_ID = "tp_A0t4l9HefNG5hxHxsaiADPRwdsnF2kre1GChxbrQ";

// Function to store content on Arweave or Arlocal
export async function storeOnArweave(content: any): Promise<{ txId: string, timestamp: string }> {
  try {
    // Add AO process ID to the transaction tags
    const transaction = await arweave.createTransaction({
      data: arweave.utils.stringToBuffer(JSON.stringify(content))
    }, keyfile);

    // Add AO process ID as a tag
    transaction.addTag('App-Name', 'NewsWeave');
    transaction.addTag('AO-Process-ID', AO_PROCESS_ID);
    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('Type', 'Article');
    transaction.addTag('Version', '1.0');

    console.log("Transaction:", transaction);
    console.log("Keyfile:", keyfile);

    // Sign the transaction
    await arweave.transactions.sign(transaction, keyfile); // Use the keyfile to sign the transaction

    // Post the transaction
    const response = await arweave.transactions.post(transaction);

    if (response.status === 200) {
      console.log("Transaction ID:", transaction.id);
      const timestamp = new Date().toISOString();
      return { txId: transaction.id, timestamp: timestamp };
    } else {
      console.error("Error storing on Arweave:", response.status, response.data);
      throw new Error(`Failed to store on Arweave: ${response.status} ${response.data}`);
    }
  } catch (error) {
    console.error("Error storing on Arweave:", error);
    throw new Error(`Failed to store on Arweave: ${error}`);
  }
}

// Function to retrieve content from Arweave or Arlocal
export async function getFromArweave(txId: string): Promise<any> {
  try {
    const transactionData = await arweave.transactions.getData(txId, { decode: true, string: true });
    const content = JSON.parse(transactionData as string);

    return {
      content: content,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error retrieving from Arweave:", error);
    throw new Error(`Failed to retrieve from Arweave: ${error}`);
  }
}

// Function to get articles by AO process ID
export async function getArticlesByAOProcess(): Promise<any[]> {
  try {
    // Query for transactions with our AO process ID tag
    const query = {
      op: 'and',
      expr1: {
        op: 'equals',
        expr1: 'AO-Process-ID',
        expr2: AO_PROCESS_ID
      },
      expr2: {
        op: 'equals',
        expr1: 'Type',
        expr2: 'Article'
      }
    };

    // Execute GraphQL query
    const results = await arweave.api.post('graphql', {
      query: `
        query {
          transactions(
            tags: [
              { name: "AO-Process-ID", values: ["${AO_PROCESS_ID}"] },
              { name: "Type", values: ["Article"] }
            ]
          ) {
            edges {
              node {
                id
                owner {
                  address
                }
                tags {
                  name
                  value
                }
                block {
                  timestamp
                }
              }
            }
          }
        }
      `
    });

    // Process results
    const articles = [];
    if (results.data && results.data.data && results.data.data.transactions) {
      for (const edge of results.data.data.transactions.edges) {
        const tx = edge.node;
        const data = await getFromArweave(tx.id);
        articles.push({
          ...data.content,
          id: tx.id,
          author: tx.owner.address,
          timestamp: tx.block ? new Date(tx.block.timestamp * 1000).toISOString() : new Date().toISOString()
        });
      }
    }

    return articles;
  } catch (error) {
    console.error("Error querying Arweave for articles:", error);
    return [];
  }
}

// Function to get a user's wallet address
export function getUserAddress(): string {
  // In a real implementation, this would get the address from ArConnect or other wallet
  return "ar1examplewalletaddress";
}
