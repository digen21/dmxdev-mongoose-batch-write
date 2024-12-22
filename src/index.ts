import { Model } from 'mongoose';
import { createLogger, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
});

export interface UpsertDocument<T> {
  updateOne: {
    filter: Record<string, any>; // Allow any filter condition
    update: {
      $set: T; // The document that needs to be updated
    };
    upsert: boolean; // The flag to perform an upsert operation
  };
}

export interface UpsertDocuments<T> {
  documents: UpsertDocument<T>[]; // Array of upsert operations
}

/**
 * Performs bulk write operations on a model in chunks.
 *
 * @template T - The type of the documents to be written.
 * @param {any} model - The model on which the bulk write operations will be performed.
 * @param {T[]} documents - The array of documents to be written.
 * @param {number} chunkSize - The size of each chunk.
 * @param {any} [options={ ordered: false }] - The options for the bulk write operation.
 * @returns {Promise<any[]>} A promise that resolves to an array of results from the bulk write operations.
 *
 * @throws Will log an error if a chunk fails to be processed.
 */
/**
 * Performs bulk write operations on a Mongoose model in chunks.
 *
 * @template T - The type of the documents.
 * @param {Model<T>} model - The Mongoose model to perform the bulk write on.
 * @param {T[]} documents - The array of documents to be written.
 * @param {number} chunkSize - The size of each chunk to split the documents into.
 * @param {any} [options={ ordered: false }] - The options to pass to the bulkWrite method.
 * @returns {Promise<any[]>} A promise that resolves to an array of results from the bulk write operations.
 */
const bulkWriteInChunks = async <T>(
  model: Model<T>,
  documents: any[],
  chunkSize: number,
  options: any = { ordered: false },
): Promise<any[]> => {
  const chunks = [];

  //slicing the the document in chunks
  for (let i = 0; i < documents.length; i += chunkSize) {
    chunks.push(documents.slice(i, i + chunkSize));
  }

  const results = [];

  for (const chunk of chunks) {
    try {
      const result = await model.bulkWrite(chunk, options); //mongoose method  for bulk write
      results.push(result);
    } catch (error) {
      logger.warn(error);
    }
  }

  return results;
};

export default bulkWriteInChunks;
