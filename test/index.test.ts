import { Model } from 'mongoose';
import bulkWriteInChunks from '../src/index';

describe('bulkWriteInChunks', () => {
  let model: Model<any>;
  let documents: any[];
  let chunkSize: number;
  let options: any;

  beforeEach(() => {
    model = {
      bulkWrite: jest.fn(),
    } as unknown as Model<any>;
    documents = [
      {
        updateOne: {
          filter: { _id: 1 },
          update: { $set: { name: 'doc1' } },
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: { _id: 2 },
          update: { $set: { name: 'doc2' } },
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: { _id: 3 },
          update: { $set: { name: 'doc3' } },
          upsert: true,
        },
      },
    ];
    chunkSize = 2;
    options = { ordered: false };
  });

  it('should split documents into chunks and perform bulk write', async () => {
    (model.bulkWrite as jest.Mock)
      .mockResolvedValueOnce('result1')
      .mockResolvedValueOnce('result2');

    const results = await bulkWriteInChunks(
      model,
      documents,
      chunkSize,
      options,
    );

    expect(model.bulkWrite).toHaveBeenCalledTimes(2);
    expect(model.bulkWrite).toHaveBeenCalledWith(
      documents.slice(0, 2),
      options,
    );
    expect(model.bulkWrite).toHaveBeenCalledWith(
      documents.slice(2, 3),
      options,
    );
    expect(results).toEqual(['result1', 'result2']);
  });
});
