# Mongoose Batch Write

This package provides a utility function to perform bulk write operations in chunks using Mongoose.

## Installation

```bash
npm install @dmxdev/mongoose-batch-write
```

## Usage

```typescript
import bulkWriteInChunks from '@dmxdev/mongoose-batch-write';
import { Model } from 'mongoose';

const model: Model<any> = // initialize your Mongoose model
const documents = [
  {
    updateOne: {
      filter: { username: doc.username },  // You can filter based on any field
      update: { $set: doc }, // Update with the entire document
      upsert: true, // Ensure upsert operation
    },
  },
  // more bulk write operations
];
const chunkSize = 100; // specify the chunk size
const options = { ordered: false }; // specify bulk write options

bulkWriteInChunks(model, documents, chunkSize, options)
  .then(results => {
    console.log('Bulk write results:', results);
  })
  .catch(error => {
    console.error('Bulk write error:', error);
  });
```

## License

MIT
