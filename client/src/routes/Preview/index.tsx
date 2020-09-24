import queryString from 'query-string'

export default function PagePreview(props: any): null {
  const { history } = props
  const { route, draftId } = queryString.parse(window.location.search)

  const url = `${route}?draftId=${draftId}`

  history.replace(url)
  return null
}
