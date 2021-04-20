import { QuarkModule } from '../../../api/api.ts';
import { QuarkTypes } from '../../../api/typings/types.ts';
import { Atom, getValue, Interpreter, stringify, Frame } from '../../../src/core/interpreter.ts';
import { Parser } from '../../../src/core/parser.ts';
import { BooleanType, IntegerType, NoneType, StringType, Types, ValueElement } from '../../../src/typings/types.ts';
import { isContainer } from '../../../src/utils/runner.ts';
import { Block, Element } from '../../../src/typings/block.ts';
import { setValue } from '../../../api/quarkifier.ts';

// std:out
QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'out',
  body: async function(text: ValueElement) {
    if ('value' in text) {
      const encodedText: Uint8Array = (new TextEncoder).encode(String(text.value));
      await Deno.stdout.write(encodedText);
    }
  }
});

// std:copy
QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'copy',
  body: function (element: any) {
    return {
      ...element
    };
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'negate',
  args: [{ type: 'Word', value: 'val1' }, { type: 'Word', value: 'val2' }],
  body: function(lhs: IntegerType, rhs: IntegerType): IntegerType {
    return setValue(getValue([lhs]) - getValue([rhs])) as IntegerType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'multiplicate',
  body: function(lhs: IntegerType, rhs: IntegerType): IntegerType {
    return setValue(getValue([lhs]) * getValue([rhs])) as IntegerType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'pow',
  body: function(lhs: IntegerType, rhs: IntegerType): IntegerType {
    return setValue(getValue([lhs]) ** getValue([rhs])) as IntegerType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'mod',
  body: function(lhs: IntegerType, rhs: IntegerType): IntegerType {
    return setValue(getValue([lhs]) % getValue([rhs])) as IntegerType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'ceil',
  body: function(lhs: IntegerType): IntegerType {
    return setValue(Math.ceil(getValue([lhs]))) as IntegerType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'divide',
  body: function(lhs: IntegerType, rhs: IntegerType): IntegerType {
    return setValue(getValue([lhs]) / getValue([rhs])) as IntegerType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'concat',
  body: function(lhs: StringType, rhs: StringType): StringType{
    return setValue(getValue([lhs])[0].concat(getValue([rhs])[0])) as StringType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'greater',
  args: [{ type: 'Word', value: 'val1' }, { type: 'Word', value: 'val2' }],
  body: function(lhs: IntegerType, rhs: IntegerType): BooleanType {
    return setValue(getValue([lhs])[0] > getValue([rhs])[0]) as BooleanType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'less',
  args: [{ type: 'Word', value: 'val1' }, { type: 'Word', value: 'val2' }],
  body: function(lhs: IntegerType, rhs: IntegerType): BooleanType {
    return setValue(getValue([lhs]) < getValue([rhs])) as BooleanType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'equals',
  args: [{ type: 'Word', value: 'val1' }, { type: 'Word', value: 'val2' }],
  body: function(lhs: ValueElement, rhs: ValueElement): BooleanType {
    return setValue(getValue([lhs])[0] == getValue([rhs])[0]) as BooleanType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'length',
  body: function(el: ValueElement): IntegerType {
    return setValue(getValue([el])[0].length) as IntegerType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'not',
  args: [],
  body: function(el: ValueElement): BooleanType {
    return setValue(!getValue([el])[0]) as BooleanType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'and',
  args: [],
  body: function(el: ValueElement, el2: ValueElement): BooleanType {
    return setValue(getValue([el])[0] && getValue([el2])[0]) as BooleanType;
  }
});

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'or',
  args: [],
  body: function(el: ValueElement, el2: ValueElement): BooleanType {
    return setValue(getValue([el])[0] || getValue([el2])[0]) as BooleanType;
  }
});

function nodeify(el: ValueElement, result: Atom = []): Atom | NoneType {
  if (!('value' in el)) return { type: Types.None, value: undefined };
  if (Array.isArray(el.value)) {
    (<Block>result).push([]);
    for (const item of el.value) {
      nodeify(item, (<Block>result).slice(-1)[0]);
    }
  } else {
    (<Block>result).push(<Element>el);
  }
  return result;
}

// print
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'print',
  body: (...args: ValueElement[]) => {
    const items = [];
    for (const arg of args) {
      if ('variable' in arg) items.push(stringify(<any>{ type: 'None', value: undefined }));
      else items.push(stringify(arg))
    }
    console.log(...items);
  },
});

// time:now
QuarkModule.declare('time', QuarkTypes.QuarkFunction, {
  name: 'now',
  body: function(): IntegerType {
    return {
      type: Types.Integer,
      value: Date.now(),
    };
  }
});

// time:sleep
QuarkModule.declare('time', QuarkTypes.QuarkFunction, {
  name: 'sleep',
  body: function(time: IntegerType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time.value);
    });
  }
})

QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'del',
  body: function(variable: any) {
    if (variable.name === undefined) throw `You can only delete variable`;
    const found = Frame.variables().get(variable.name);
    found.type = 'None';
    found.value = undefined;
    found.name = undefined;
  }
})

// replace
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'replace',
  body: function(el: StringType, elToRepl: StringType, repl: StringType) {
    return {
      type: Types.String,
      value: el.value.replace(elToRepl.value, repl.value),
    }
  }
})

// std:args
QuarkModule.declare('std', QuarkTypes.QuarkVariable, {
  name: 'args',
  value: {
    type: Types.List,
    value: Deno.args.map((acc) => ({ type: Types.String, value: acc })),
  },
});

// type
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'type',
  body: function(variable: any): ValueElement {
    return {
      type: Types.Integer,
      value: <number><unknown>(variable.type === 'List' ? 'list' : typeof variable.value),
    };
  }
});

// input
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'input',
  body: async function(question: StringType): Promise<StringType> {
    const buf = new Uint8Array(1024);
    await Deno.stdout.write(new TextEncoder().encode(question.value));

    const input = await Deno.stdin.read(buf);
    const answer = new TextDecoder().decode(buf.subarray(0, input as number | undefined));
    return {
      type: Types.String,
      value: answer.trim(),
    };
  }
});

QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'stack',
  body: function() {
    return setValue(Frame.frame);
  }
});

// std:exec
QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'exec',
  body: async function(code: any, stack: any): Promise<any> {
    let ast = code.type === 'Block'
      ? code.value
      : Parser.parse(code.value, '');
    if (!Array.isArray(ast)) ast = [ast]; 
    if (stack.type === 'None') 
      Frame.pushLocalFrame();
    else {
      Frame.pushLocalFrame(stack.value);
    }
    if (isContainer(ast) && ast.length === 1) {
      const res = { 
        type: 'List', 
        value: [
          setValue(await Interpreter.process(ast[0])),
          { 
            type: 'Object', 
            value: Frame.local, 
          }
        ] 
      };
      Frame.popLocalFrame();
      return res;
    }
    const res = setValue([
      setValue(await Interpreter.process(ast)),
      Frame.local
    ]);
    Frame.popLocalFrame();
    return res;
  }
});

// throw
QuarkModule.declare(null, QuarkTypes.QuarkFunction, {
  name: 'throw',
  body: function(...message: ValueElement[]) {
    if (message.length === 0) return Deno.exit(1);
    console.log(message.map((arg) => 'value' in arg ? arg.value : arg).join(' '));
    return Deno.exit(1);
  }
});

// std:run
QuarkModule.declare('std', QuarkTypes.QuarkFunction, {
  name: 'run',
  body: async function(code: StringType, path: StringType) {
    await Interpreter.run(code.value, path.value);
  }
});