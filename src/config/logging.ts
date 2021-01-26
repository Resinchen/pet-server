import colors from 'colors'

const getTimeStamp = (): string => {
  return new Date().toISOString()
}

const printMessage = (
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
  namespace: string,
  colorFunc: (text: string) => string,
  message: string,
  object?: any
) => {
  if (object) {
    console.log(
      colorFunc(`[${getTimeStamp()}] [${level}] [${namespace}] ${message}`),
      object
    )
  } else {
    console.log(
      colorFunc(`[${getTimeStamp()}] [${level}] [${namespace}] ${message}`)
    )
  }
}

const info = (namespace: string, message: string, object?: any) =>
  printMessage('INFO', namespace, colors.white, message, object)

const warn = (namespace: string, message: string, object?: any) =>
  printMessage('WARN', namespace, colors.yellow, message, object)

const error = (namespace: string, message: string, object?: any) =>
  printMessage('ERROR', namespace, colors.red, message, object)

const debug = (namespace: string, message: string, object?: any) =>
  printMessage('DEBUG', namespace, colors.cyan, message, object)

export default (namespace: string) => {
  const infoBind = info.bind(null, namespace)
  const warnBind = warn.bind(null, namespace)
  const errorBind = error.bind(null, namespace)
  const debugBind = debug.bind(null, namespace)

  return { info: infoBind, warn: warnBind, error: errorBind, debug: debugBind }
}
