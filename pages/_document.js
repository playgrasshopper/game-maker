import Document, { Html, Head, Main, NextScript } from 'next/document'
import { TypographyStyle, GoogleFont } from 'react-typography'
import Typography from 'typography'
import theme from 'typography-theme-fairy-gates'

theme.baseFontSize = '22px'

const typography = new Typography(theme)

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <TypographyStyle typography={typography} />
          <GoogleFont typography={typography} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
