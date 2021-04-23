import { QuarkModule } from '../../api/api';
import { QuarkTypes } from '../../api/typings/types';
import { StringType } from '../../src/typings/types';
import { bold, green, red, yellow, white, gray } from 'colors';
import { quarkify } from '../../api/quarkifier';

// green
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'green',
  body: (message: StringType) => quarkify(green, message),
});

// gray
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'gray',
  body: (message: StringType) => quarkify(gray, message),
});

// yellow
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'yellow',
  body: (message: StringType) => quarkify(yellow, message),
});

// white
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'white',
  body: (message: StringType) => quarkify(white, message),
});

// red
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'red',
  body: (message: StringType) => quarkify(red, message),
});

// bold
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'bold',
  body: (message: StringType) => quarkify(bold, message),
});