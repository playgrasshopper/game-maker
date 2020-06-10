import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { DateTime } from 'luxon'

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
    <div className="container">
      {players && (
        <>
          {players.map((player) => (
            <div>
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
            </div>
          ))}
          <button
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
          </button>
        </>
      )}
    </div>
  )
}
