const airtable = require('airtable')
const base = airtable.base(process.env.AIRTABLE_BASE)
export default (req, res) => {
  const players = {}
  base('Games').find(req.query.game, (error, game) => {
    const filterFormula = []
    game.get('Players').forEach((id) => {
      filterFormula.push(`RECORD_ID() = '${id}'`)
    })
    const filterByFormula = `OR(${filterFormula.join(',')})`
    base('Players')
      .select({
        fields: ['Player Name', 'Player slug'],
        filterByFormula,
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((player) => {
            players[player.getId()] = {
              id: player.getId(),
              name: player.get('Player Name'),
              slug: player.get('Player slug'),
              games: 0,
              score: 0,
            }
          })
          fetchNextPage()
        },
        (err) => {
          if (err) {
            console.error(err)
            res.status(404)
            res.json({ error: true })
            return
          }
          base('Scores')
            .select({
              fields: ['Player', 'Score'],
              filterByFormula: `OR(${Object.keys(players)
                .map((playerId) => `Player='${players[playerId].slug}'`)
                .join(',')})`,
            })
            .eachPage(
              (scores, fetchNextPage) => {
                scores.forEach((score) => {
                  players[score.get('Player')[0]].games++
                  players[score.get('Player')[0]].score += score.get('Score')
                })
                fetchNextPage()
              },
              (err) => {
                if (err) {
                  console.error(err)
                  res.status(404)
                  res.json({ error: true })
                  return
                }
                const hopGames = {}
                base('Hops')
                  .select({
                    fields: ['Player', 'Game', 'Score', 'Hop #'],
                    filterByFormula: `OR(${Object.keys(players)
                      .map((playerId) => `Player='${players[playerId].slug}'`)
                      .join(',')})`,
                  })
                  .eachPage(
                    (hops, fetchNextPage) => {
                      hops.forEach((hop) => {
                        if (hop.get('Hop #') === 1) {
                          players[hop.get('Player')[0]].games++
                        }
                        players[hop.get('Player')[0]].score += hop.get('Score')
                      })
                      fetchNextPage()
                    },
                    (err) => {
                      if (err) {
                        console.error(err)
                        res.status(404)
                        res.json({ error: true })
                        return
                      }
                      res.status(200)
                      res.json(Object.values(players))
                    }
                  )
              }
            )
        }
      )
  })
}
