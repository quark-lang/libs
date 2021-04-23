import { QuarkModule} from '../api/api';
import { QuarkTypes } from '../api/typings/types';
import { QuarkType, setValue } from '../api/quarkifier';
import { Function } from '../src/core/interpreter';
import {
  Types,
  StringType,
  FunctionType,
} from '../src/typings/types';
import { getQuarkFolder, parseConfiguration } from '../src/main';
import * as Path from 'path';
import { File } from '../src/utils/file';

async function getRelease(): Promise<string> {
  const github = await fetch('https://api.github.com/repos/quark-lang/quark/releases');
  const json = await github.json();
  const path: string = Path.join(await getQuarkFolder(), '.quarkrc');
  const config = await parseConfiguration(await File.read(path));

  if (json.message && json.message.includes('API rate limit')) return config['version'];
  return json[0].tag_name || config['version'];
}

QuarkModule.declare('quark', QuarkTypes.QuarkFunction, {
  name: 'release',
  body: async function() {
    return setValue(await getRelease());
  }
});

QuarkModule.declare('config', QuarkTypes.QuarkFunction, {
  name: 'parse',
  body: async function(file: StringType) {
    const content = await File.read(file.value);
    return QuarkType.object(parseConfiguration(content));
  }
})

QuarkModule.declare('on', QuarkTypes.QuarkFunction, {
  name: 'exit',
  body: async function(cb: FunctionType) {
    window.addEventListener('unload', function() {
      Function.call(<any>cb, []);
    });
  }
});