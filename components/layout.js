import styled from '@emotion/styled'
import Head from 'next/head'

const Container = styled.main`
  margin: 2rem auto;
  max-width: 900px;
`

export default ({ children }) => (
  <>
    <Head>
      <title>Grasshopper</title>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <meta name="description" content="Grasshopper" />

      <link rel="manifest" href="/manifest.json" />
      <link
        href="/favicon-16x16.png"
        rel="icon"
        type="image/png"
        sizes="16x16"
      />
      <link
        href="/favicon-32x32.png"
        rel="icon"
        type="image/png"
        sizes="32x32"
      />
      <link rel="apple-touch-icon" href="/apple-icon.png"></link>
    </Head>
    <main>
      <Container>{children}</Container>
    </main>
  </>
)
