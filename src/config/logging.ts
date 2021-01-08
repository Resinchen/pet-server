const getTimeStamp = (): string => {
  return new Date().toISOString()
}

const printMessage = (
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
  namespace: string,
  message: string,
  object?: any
) => {
  if (object) {
    console.log(
      `[${getTimeStamp()}] [${level}] [${namespace}] ${message}`,
      object
    )
  } else {
    console.log(`[${getTimeStamp()}] [${level}] [${namespace}] ${message}`)
  }
}

const info = (namespace: string, message: string, object?: any) =>
  printMessage('INFO', namespace, message, object)

const warn = (namespace: string, message: string, object?: any) =>
  printMessage('WARN', namespace, message, object)

const error = (namespace: string, message: string, object?: any) =>
  printMessage('ERROR', namespace, message, object)

const debug = (namespace: string, message: string, object?: any) =>
  printMessage('DEBUG', namespace, message, object)

export default (namespace: string) => {
  const infoBind = info.bind(null, namespace)
  const warnBind = warn.bind(null, namespace)
  const errorBind = error.bind(null, namespace)
  const debugBind = debug.bind(null, namespace)

  return { info: infoBind, warn: warnBind, error: errorBind, debug: debugBind }
}
