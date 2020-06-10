const airtable = require('airtable')
const base = airtable.base(process.env.AIRTABLE_BASE)
export default (req, res) => {
  base('Leagues')
    .select({
      filterByFormula: `{League slug} = "${req.body.leagueName}"`,
    })
    .eachPage((records, fetchNextPage) => {
      let leagueId = false
      records.forEach((record) => {
        leagueId = record.getId()
      })
      if (!leagueId) {
        res.statusCode = 404
        res.json({ error: true })
      }
      base('Games').create(
        [
          {
            fields: {
              'Game League': [leagueId],
              Date: req.body.date,
              Name: req.body.date,
              Complete: false,
              Players: req.body.selectedPlayers,
            },
          },
        ],
        function (err, records) {
          if (err) {
            console.error(err)
            res.statusCode = 404
            res.json({ error: true })
            return
          }
          let gameId = false
          records.forEach(function (record) {
            gameId = record.getId()
          })
          res.statusCode = 200
          res.json({ game: gameId })
        }
      )
    })
}
