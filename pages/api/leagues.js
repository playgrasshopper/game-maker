const airtable = require('airtable')
const base = airtable.base(process.env.AIRTABLE_BASE)
export default (req, res) => {
  const players = []
  base('Leagues')
    .select()
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach((record) => {
          players.push({
            id: record.getId(),
            slug: record.get('League slug'),
            name: record.get('Name'),
          })
        })
        fetchNextPage()
      },
      function done(err) {
        if (err) {
          console.error(err)
          return
        }
        res.statusCode = 200
        res.json(players)
      }
    )
}
