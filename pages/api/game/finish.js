const airtable = require('airtable')
const base = airtable.base(process.env.AIRTABLE_BASE)
export default (req, res) => {
  base('Games').update(
    [
      {
        id: req.query.game,
        fields: {
          Complete: true,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err)
        res.status(404)
        res.json({ error: true })
        return
      }
      res.status(404)
      res.json({ success: true })
      fetch(process.env.WEBSITE_BUILD, {
        method: 'post',
        body: '{}',
        headers: { 'Content-Type': 'application/json' },
      })
    }
  )
}
