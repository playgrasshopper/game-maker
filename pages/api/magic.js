const airtable = require('airtable')
const base = airtable.base(process.env.AIRTABLE_BASE)
export default (req, res) => {
  return new Promise((resolve) => {
    const magic = []
    base('Magic')
      .select()
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            magic.push({
              id: record.getId(),
              name: record.get('Name'),
            })
          })
          fetchNextPage()
        },
        (err) => {
          if (err) {
            console.error(err)
            resolve()
            return
          }
          res.statusCode = 200
          res.json(magic)
          resolve()
        }
      )
  })
}
