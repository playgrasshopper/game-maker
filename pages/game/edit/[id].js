import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { DateTime } from 'luxon'

const AddHop = ({ game, players }) => {
  const [playerHop, setPlayerHop] = useState({})
  const [magic, setMagic] = useState([])
  useEffect(() => {
    fetch('/api/magic')
      .then((response) => response.json())
      .then((result) => {
        setMagic(result)
      })
  })
  return (
    <form>
      {players.map((player) => (
        <div>
          {player.name} Score:
          <input
            type="number"
            onChange={(event) => {
              if (typeof playerHop[player.id] === 'undefined') {
                playerHop[player.id] = { score: 0, magic: null, juiced: null }
              }
              playerHop[player.id].score = event.target.value
              setPlayerHop(playerHop)
            }}
          />
          Magic:
          <select
            onChange={(event) => {
              if (typeof playerHop[player.id] === 'undefined') {
                playerHop[player.id] = { score: 0, magic: null, juiced: null }
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
          {typeof playerHop[player.id] !== 'undefined' &&
            playerHop[player.id].magic === 'Beetlejuice' && (
              <span>
                Juiced:
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
              </span>
            )}
        </div>
      ))}
      <button
        onClick={(event) => {
          event.preventDefault()
          fetch(`/api/game/hop/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              game,
              playerHop,
            }),
          })
        }}
      >
        Add Hop
      </button>
    </form>
  )
}

export default function NewGame() {
  const [players, setPlayers] = useState(false)
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    if (!id) {
      return
    }
    fetch(`/api/game/players?game=${id}`)
      .then((response) => response.json())
      .then((players) => {
        setPlayers(players)
      })
  }, [id])

  return (
    <div className="container">
      game!
      {players ? (
        <>
          <ul>
            {players
              .sort((a, b) => (a.score / a.games > b.score / b.games ? -1 : 1))
              .map((player) => (
                <li>
                  {player.name} - Games: {player.games} - Score: {player.score}{' '}
                  - Magic: {player.score / player.games}
                </li>
              ))}
          </ul>
          <AddHop players={players} game={id} />
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  )
}
