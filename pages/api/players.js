const airtable = require('airtable')
const base = airtable.base(process.env.AIRTABLE_BASE)
export default (req, res) => {
  const players = []
  base('Players')
    .select({
      sort: [{ field: 'Player Name' }],
      filterByFormula: `(FIND("${req.query.league}", {League}))`,
    })
    .eachPage(
      (records, fetchNextPage) => {
        records.forEach((record) => {
          players.push({
            id: record.getId(),
            slug: record.get('Player slug'),
            name: record.get('Player Name'),
          })
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
        res.statusCode = 200
        res.json(players)
      }
    )
}
