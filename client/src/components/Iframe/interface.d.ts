export interface Props {
  src: string
  onLoad: (event: React.SyntheticEvent<HTMLIFrameElement, Event>) => void
  getRef: (v: any) => void
  onKeydown: (e: KeyboardEvent) => void
}
