import { File } from '../../src/utils/file';
import { QuarkModule } from '../../api/api';
import { QuarkTypes } from '../../api/typings/types';
import { existsSync } from 'fs';
import {
  Types,
  StringType,
  NoneType,
} from '../../src/typings/types';
import * as path from 'path';
import { getQuarkFolder } from '../../src/main';

// fs:read
QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'read',
  body: async function(path: StringType): Promise<StringType | NoneType> {
    if (!existsSync(path.value)) return {
      type: Types.None,
      value: undefined,
    }
    return {
      type: Types.String,
      value: await File.read(path.value),
    }
  }
});

// fs:cwd
QuarkModule.declare('fs', QuarkTypes.QuarkVariable, {
  name: 'cwd',
  value: {
    type: Types.String,
    value: process.cwd(),
  },
});

// fs:root
QuarkModule.declare('fs', QuarkTypes.QuarkVariable, {
  name: 'root',
  value: {
    type: Types.String,
    value: getQuarkFolder(),
  },
});

// fs:join
QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'join',
  body: function(...paths: StringType[]): StringType {
    return {
      type: Types.String,
      value: path.join(...paths.map((x) => x.value)),
    };
  }
});

// fs:dirname
QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'dirname',
  body: function(src: StringType): StringType {
    return {
      type: Types.String,
      value: path.dirname(src.value),
    }
  }
});

QuarkModule.declare('fs', QuarkTypes.QuarkFunction, {
  name: 'basename',
  body: function(src: StringType): StringType {
    return {
      type: Types.String,
      value: path.basename(src.value),
    }
  }
});
