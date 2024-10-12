import { convert } from 'html-to-text'

export const convertHtmlToText = (html: string) => {
  return convert(html, {
    limits: {
      maxInputLength: 140
    }
  })
}
