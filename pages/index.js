import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import NavList from '../components/nav-list'
import Link from 'next/link'

export default function Home() {
  const [leagues, setLeagues] = useState(false)
  useEffect(() => {
    fetch('/api/leagues')
      .then((response) => response.json())
      .then((result) => setLeagues(result))
  }, [])
  return (
    <Layout>
      <h1>Select a league</h1>
      {leagues && (
        <NavList>
          {leagues.map(({ id, name, slug }) => (
            <li key={id}>
              <Link href={`/game/${slug}`}>{name}</Link>
            </li>
          ))}
        </NavList>
      )}
    </Layout>
  )
}
