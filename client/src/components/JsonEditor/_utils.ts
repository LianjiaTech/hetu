const publicPath = window.$$PUBLIC_URL

function getWorkerUrl(workerId: string, label: string) {
  switch (label) {
    case 'json':
      return publicPath + 'json.worker.js'
    case 'css':
    case 'less':
    case 'scss':
      return publicPath + 'css.worker.js'
    case 'html':
    case 'handlebars':
    case 'razor':
      return publicPath + 'html.worker.js'
    case 'javascript':
    case 'typescript':
      return publicPath + 'typescript.worker.js'
    default:
      return publicPath + 'editor.worker.js'
  }
}

if (process.env.NODE_ENV === 'production') {
  ;(window as any).MonacoEnvironment = {
    getWorkerUrl: function (workerId: string, label: string) {
      const url = getWorkerUrl(workerId, label)
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`                        
                      self.MonacoEnvironment = {
                        baseUrl: '${publicPath}'
                      };
                      importScripts('${url}');`)}`
    },
  }
}
