import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [leagues, setLeagues] = useState(false)
  useEffect(() => {
    fetch('/api/leagues')
      .then((response) => response.json())
      .then((result) => setLeagues(result))
  }, [])
  return (
    <div className="container">
      <Head>
        <title>Grasshopper</title>
      </Head>
      {leagues && (
        <ul>
          {leagues.map(({ id, name, slug }) => (
            <li key={id}>
              <Link href={`/game/${slug}`}>{name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
