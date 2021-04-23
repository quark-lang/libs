module.exports.welcome = function(username) {
  console.log('Welcome', username);
}

module.exports.test = 'bruh';

module.exports.string = function(value) {
  return value.toString();
}

module.exports.env = function(variable) {
  return process.env[variable];
}

/*export async function run(command: string, cwd?: string) {
  const res = await Deno.run({
    cmd: command.split(' '),
    cwd,
    stdout: 'piped',
  });
  const output = await res.output();
  return new TextDecoder().decode(output);
}*/

module.exports.trim = function(str) {
  return str.trim();
}

module.exports.callback = async function (cb) {
  await cb(['test', 25], 'bruh');
}

module.exports.json_parse = JSON.parse