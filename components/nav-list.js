import styled from '@emotion/styled'

const NavList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  li {
    padding: 0;
    margin: 0;
    border-top: 1px solid #aeaeae;
    &:last-child {
      border-bottom: 1px solid #aeaeae;
    }
    a,
    a:visited,
    label {
      text-shadow: none;
      background-image: none;
      padding: 1rem;
      color: black;
      display: block;
      text-decoration: none;
      font-weight: 700;
      cursor: pointer;
    }
    a:hover {
      background: #aaa;
    }
    input[type='checkbox'] {
      display: inline-block;
      margin-right: 1rem;
    }
  }
`

export default NavList
