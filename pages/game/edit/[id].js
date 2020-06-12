import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { DateTime } from 'luxon'
import styled from '@emotion/styled'
import Layout from '../../../components/layout'
import Loader from '../../../components/loader'
import Button from '../../../components/button'

const Table = styled.table`
  width: 100%;
  margin-bottom: 3rem;
  th {
    font-weight: bold;
    background: #eee;
  }
  th,
  td {
    padding: 0.5rem;
  }
`

const AddHop = ({ game, players, updateHops, hopNumber }) => {
  const [playerHop, setPlayerHop] = useState({})
  const [magic, setMagic] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/magic')
      .then((response) => response.json())
      .then((result) => {
        setMagic(result)
      })
  })
  return (
    <form id="add-hop-form">
      <Table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
            <th>Magic</th>
            <th>Beeltejuice</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr>
              <td>{player.name}</td>
              <td>
                <input
                  type="number"
                  onChange={(event) => {
                    if (typeof playerHop[player.id] === 'undefined') {
                      playerHop[player.id] = {
                        score: 0,
                        magic: null,
                        juiced: null,
                      }
                    }
                    playerHop[player.id].score = event.target.value
                    setPlayerHop(playerHop)
                  }}
                />
              </td>
              <td>
                <select
                  onChange={(event) => {
                    if (typeof playerHop[player.id] === 'undefined') {
                      playerHop[player.id] = {
                        score: 0,
                        magic: null,
                        juiced: null,
                      }
                    }
                    playerHop[player.id].magic = event.target.value
                    setPlayerHop(playerHop)
                  }}
                >
                  <option>-- none --</option>
                  {magic.map((spell) => (
                    <option value={spell.id}>{spell.name}</option>
                  ))}
                </select>
              </td>
              <td>
                {typeof playerHop[player.id] !== 'undefined' &&
                  magic.find((spell) => spell.name === 'Beetlejuice').id ===
                    playerHop[player.id].magic && (
                    <select
                      onChange={(event) => {
                        playerHop[player.id].juiced = event.target.value
                        setPlayerHop(playerHop)
                      }}
                    >
                      {players.map((juiced) => (
                        <option value={juiced.id}>{juiced.name}</option>
                      ))}
                    </select>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {isLoading && <p>Saving hop...</p>}
      {success && <p>Hop saved.</p>}
      <Button
        onClick={(event) => {
          setIsLoading(true)
          event.preventDefault()
          fetch(`/api/game/hop/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              hopNumber: hopNumber + 1,
              game,
              playerHop,
            }),
          })
            .then((response) => response.json())
            .then((result) => {
              setIsLoading(false)
              setSuccess(true)
              document.getElementById('add-hop-form').reset()
              setTimeout(() => setSuccess(false), 2000)
              updateHops()
            })
        }}
        disabled={isLoading}
      >
        Add Hop
      </Button>
    </form>
  )
}

const Hops = ({ hops, players }) => (
  <>
    {Object.keys(hops).map((hopNumber) => (
      <>
        <h4>Hop {hopNumber}</h4>
        <Table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Score</th>
              <th>Magic</th>
              <th>Juiced</th>
            </tr>
          </thead>
          <tbody>
            {hops[hopNumber].map((hop) => (
              <tr>
                <td>
                  {players.find((player) => player.id === hop.player).name}
                </td>
                <td>{hop.score}</td>
                <td>{hop.magic}</td>
                <td>
                  {hop.juiced &&
                    players.find((player) => player.id === hop.juiced).name}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    ))}
  </>
)

const FinishButton = styled.button`
  background: yellow;
  color: block;
  margin-top: 15px;
  border: 0;
  font-size: 2rem;
  font-weight: bold;
`

const FinishGame = ({ game }) => {
  const router = useRouter()
  return (
    <FinishButton
      onClick={(event) => {
        event.preventDefault()
        fetch(`/api/game/finish?game=${game}`)
          .then((response) => response.json())
          .then((result) => {
            router.push(`/game/${game}`)
          })
      }}
    >
      Finish game
    </FinishButton>
  )
}

export default function NewGame() {
  const [players, setPlayers] = useState(false)
  const [hops, setHops] = useState({})
  const router = useRouter()
  const { id } = router.query

  const updateHops = () => {
    fetch(`/api/game/hops?game=${id}`)
      .then((response) => response.json())
      .then((hopData) => {
        setHops(hopData)
      })
  }

  useEffect(() => {
    if (!id) {
      return
    }
    fetch(`/api/game/players?game=${id}`)
      .then((response) => response.json())
      .then((players) => {
        setPlayers(players)
        updateHops()
      })
  }, [id])

  return (
    <Layout>
      <h1>Game</h1>
      {players ? (
        <>
          <h2>Bash bish order</h2>
          <Table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Games</th>
                <th>Lifetime score</th>
                <th>Index</th>
                <th>Magic points</th>
              </tr>
            </thead>
            <tbody>
              {players
                .sort((a, b) =>
                  a.score / a.games > b.score / b.games ? -1 : 1
                )
                .map((player, index) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.games}</td>
                    <td>{player.score}</td>
                    <td>
                      {Math.round((player.score / player.games) * 100) / 100}
                    </td>
                    <td>
                      {index === 0 ? 1 : index === players.length - 1 ? 3 : 2}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <h2>Hops</h2>
          {hops ? <Hops hops={hops} players={players} /> : <p>Loading hops</p>}
          <h2>Add hop</h2>
          <AddHop
            players={players}
            game={id}
            updateHops={updateHops}
            hopNumber={Object.keys(hops).length}
          />
          <FinishGame game={id} />
        </>
      ) : (
        <Loader />
      )}
    </Layout>
  )
}
