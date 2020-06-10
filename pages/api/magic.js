const airtable = require('airtable')
const base = airtable.base(process.env.AIRTABLE_BASE)
export default (req, res) => {
  const magic = []
  base('Magic')
    .select()
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach((record) => {
          magic.push({
            id: record.getId(),
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
        res.json(magic)
      }
    )
}
