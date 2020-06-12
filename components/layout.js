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
    </Head>
    <main>
      <Container>{children}</Container>
    </main>
  </>
)
