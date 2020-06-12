import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'
import css from '@emotion/css'

const override = css`
  display: block;
  padding-top: 200px;
  margin: 0 auto;
  border-color: red;
`

export default () => (
  <ClimbingBoxLoader css={override} size={50} color={'red'} />
)
