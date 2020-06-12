import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { DateTime } from 'luxon'
import Layout from '../../components/layout'
import NavList from '../../components/nav-list'
import Button from '../../components/button'
import Loader from '../../components/loader'

export default function NewGame() {
  const [players, setPlayers] = useState(false)
  const [date] = useState(DateTime.fromObject({}).toFormat('yyyy-LL-dd'))
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const router = useRouter()
  const { leagueName } = router.query
  useEffect(() => {
    if (!leagueName) {
      return
    }
    fetch(`/api/players?league=${leagueName}`)
      .then((response) => response.json())
      .then((result) => {
        setPlayers(result)
      })
  }, [leagueName])
  return (
    <Layout>
      <h1>Select players</h1>
      {players ? (
        <>
          <NavList>
            {players.map((player) => (
              <li key={player.id}>
                <label>
                  <input
                    type="checkbox"
                    onChange={({ target }) => {
                      if (target.checked) {
                        if (selectedPlayers.indexOf(player.id) === -1) {
                          selectedPlayers.push(player.id)
                          setSelectedPlayers(selectedPlayers)
                        }
                      } else {
                        if (selectedPlayers.indexOf(player.id) > -1) {
                          setSelectedPlayers(
                            selectedPlayers.filter((item) => item !== player.id)
                          )
                        }
                      }
                    }}
                  />{' '}
                  {player.name}
                </label>
              </li>
            ))}
          </NavList>
          <Button
            onClick={(event) => {
              event.preventDefault()
              fetch('/api/game/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  date,
                  leagueName,
                  selectedPlayers,
                }),
              })
                .then((response) => response.json())
                .then((result) => {
                  router.push(`/game/edit/${result.game}`)
                })
            }}
          >
            Start game
          </Button>
        </>
      ) : (
        <Loader />
      )}
    </Layout>
  )
}
