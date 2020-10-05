var express = require('express');
var router = express.Router();

var fs = require('fs');

var _ = require('lodash');

/* GET home page. */
router.get('/', async function(req, res, next) {

  var commits = JSON.parse(fs.readFileSync("commits.json", "utf8"));
  var builts = JSON.parse(fs.readFileSync("builts.json", "utf8"))

  var bx = []

  builts.forEach(x => bx.push(_.find(commits, {sha: x})))

  let latestCommit = fs.readFileSync("latest_id", {encoding: 'utf-8'});
  res.render('index', {
    title: 'vgmstream builds',
    latest: latestCommit,
    latestCommitData: _.find(commits, {sha: latestCommit}),
    olderCommits: _.orderBy(_.compact(bx),[(o) => Date.parse(o.commit.author.date)],["desc"])
  });
});

router.get('/latest', (req, res, next) => {
  res.redirect('/')
})

router.get('/:sha', async (req, res, next) => {
  var commits = JSON.parse(fs.readFileSync("commits.json", "utf8"));
  var builts = JSON.parse(fs.readFileSync("builts.json", "utf8"))
  if (!_.includes(builts,req.params.sha)) {
    res.status(404).render('error', {
      message: "Commit not found or not built.",
      error: {
        status: 404
      }
    })
  } else {
    var bx = []
    builts.forEach(x => bx.push(_.find(commits, {sha: x})))
    let lci = fs.readFileSync("latest_id", {encoding: 'utf-8'});
    let latestCommit = req.params.sha;
    res.render('index', {
      title: 'vgmstream builds',
      latest: latestCommit,
      notLatest: lci !== latestCommit,
      latestCommitData: _.find(commits, {sha: latestCommit}),
      olderCommits: _.orderBy(_.compact(bx),[(o) => Date.parse(o.commit.author.date)],["desc"])
    });
  }
})


module.exports = router;
