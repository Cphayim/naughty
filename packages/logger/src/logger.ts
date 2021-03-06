/*
 * @Author: Cphayim
 * @Date: 2021-06-18 00:52:24
 * @Description: 日志
 */
import readline from 'readline'
import chalk from 'chalk'
import ora from 'ora'
import stripAnsi from 'strip-ansi'

type LevelKey = 'verbose' | 'info' | 'notice' | 'warn' | 'error' | 'silent'
type LevelValue = number

export const levelMap: Record<LevelKey, LevelValue> = {
  verbose: 1,
  info: 10,
  notice: 100,
  warn: 1_000,
  error: 10_000,
  silent: 100_000,
}

const DEFAULT_LEVEL: LevelKey = 'info'

let levelValue: LevelValue
setLevel(DEFAULT_LEVEL)

const chalkTag = (msg: string) => (!msg ? '' : chalk.bgBlackBright.white.dim(` ${msg} `))

export function setLevel(level: LevelKey): void {
  levelValue = normalizeLevelValue(level)
}

function normalizeLevelValue(level: LevelKey) {
  return levelMap[level] ? levelMap[level] : levelMap['info']
}

function format(label: string, msg: string) {
  return msg
    .split('\n')
    .map((line, i) => {
      // return `${label} ${line}`
      return i === 0 ? `${label} ${line}` : line.padStart(stripAnsi(label).length + line.length + 1)
    })
    .join('\n')
}

function log(level: LevelKey, message: string) {
  // 低于 levelValue 级别的日志将不会打印
  if (normalizeLevelValue(level) < levelValue) return
  console.log(message)
}

export function verbose(message: string, tag = ''): void {
  const label = chalk.bgWhite.black(' VER ') + chalkTag(tag)
  log('verbose', format(label, message))
}

export function debug(message: string, tag = ''): void {
  const label = chalk.bgCyan.black(' DEBUG ') + chalkTag(tag)
  log('verbose', format(label, message))
}

export function info(message: string, tag = ''): void {
  const label = chalk.bgBlue.black(' INFO ') + chalkTag(tag)
  log('info', format(label, message))
}

export function done(message: string, tag = '', plain = false): void {
  const label = chalk.bgGreen.black(' DONE ') + chalkTag(tag)
  message = plain ? message : chalk.green(message)
  log('notice', format(label, message))
}

export function warn(message: string, tag = '', plain = false): void {
  const label = chalk.bgYellow.black(' WARN ') + chalkTag(tag)
  message = plain ? message : chalk.yellow(message)
  log('warn', format(label, message))
}

export function error(message: string, tag = '', plain = false): void {
  const label = chalk.bgRed.black(' ERR ') + chalkTag(tag)
  message = plain ? message : chalk.red(message)
  log('error', format(label, message))
}

let spinner: ora.Ora | null = null
export function loadding(options: string | ora.Options): ora.Ora {
  clearLoadding()
  spinner = ora(options).start()
  return spinner
}

export function clearLoadding(): void {
  if (spinner) {
    spinner.stop()
  }
}

export function clearConsole(title = ''): void {
  // 仅在 tty 终端下清屏 (macOS/linux)
  if (!process.stdout.isTTY) return
  const blank = '\n'.repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
  if (title) console.log(title)
}
