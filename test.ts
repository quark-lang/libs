export function welcome(username: string): void {
  console.log('Welcome', username);
}

export const test = 'bruh';

export function string(value: any): string {
  return value.toString();
}

export function env(variable: string): string | undefined {
  return Deno.env.get(variable);
}

export async function run(command: string, cwd?: string) {
  const res = await Deno.run({
    cmd: command.split(' '),
    cwd,
    stdout: 'piped',
  });
  const output = await res.output();
  return new TextDecoder().decode(output);
}

export function trim(str: string): string {
  return str.trim();
}

export async function callback(cb: any) {
  await cb(['test', 25], 'bruh');
}

export const json_parse = JSON.parse