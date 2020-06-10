const airtable = require('airtable')
const base = airtable.base(process.env.AIRTABLE_BASE)
export default (req, res) => {
  const records = []
  Object.keys(req.body.playerHop).forEach((id) => {
    records.push({
      fields: {
        'Hop #': 1,
        Game: [req.body.game],
        Player: [id],
        Score: parseInt(req.body.playerHop[id].score, 10),
        Magic: req.body.playerHop[id].magic
          ? [req.body.playerHop[id].magic]
          : null,
      },
    })
  })

  base('Hops').create(records, function (err, records) {
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
  })
}
