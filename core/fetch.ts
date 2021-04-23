import { QuarkModule } from '../../api/api';
import { QuarkTypes } from '../../api/typings/types';
import {
  Types,
  StringType,
} from '../../src/typings/types';
import { writeFile } from 'fs/promises';

// fetch
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'fetch',
  body: async function(path: StringType): Promise<StringType> {
    try {
      const res = await fetch(path.value);
      return {
        type: Types.String,
        value: await res.text(),
      }
    } catch (exception) {
      throw exception;
    }
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'download',
  body: async (url: StringType, filename: StringType) => {
    const data = (await fetch(url.value)).arrayBuffer();
    await writeFile(filename.value, new Uint8Array(await data));
    return filename;
  }
});