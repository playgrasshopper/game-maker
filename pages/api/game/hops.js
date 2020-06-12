const airtable = require('airtable')
const base = airtable.base(process.env.AIRTABLE_BASE)
export default (req, res) => {
  const hops = {}
  const magic = {}
  base('Games').find(req.query.game, (error, game) => {
    base('Magic')
      .select()
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            magic[record.getId()] = record.get('Name')
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
          base('Hops')
            .select({
              filterByFormula: `({Game} = '${game.get('Game id')}')`,
            })
            .eachPage(
              (records, fetchNextPage) => {
                records.forEach((record) => {
                  if (typeof hops[record.get('Hop #')] === 'undefined') {
                    hops[record.get('Hop #')] = []
                  }
                  hops[record.get('Hop #')].push({
                    id: record.getId(),
                    player: record.get('Player')[0],
                    score: record.get('Score'),
                    magic: magic[record.get('Magic')],
                    juiced: record.get('Beetlejuice')
                      ? record.get('Beetlejuice')[0]
                      : null,
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
                res.json(hops)
              }
            )
        }
      )
  })
}
