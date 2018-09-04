var args = process.argv.slice(2);
var request = require('request');
var secrets = require('./secrets');
const fs = require('fs');

var owner = args[0];
var repo = args[1];

console.log('Welcome to the GitHub Avatar Downloader!');
console.log(owner);
console.log(repo);


function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };
  console.log(options);
  request(options, function(err, res, body) {
    var contributors = JSON.parse(body);
    cb(err, contributors);
  });
}


function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
         console.log('Response message: ', response.statusMessage);
         console.log('Content type: ', response.headers['content-type']);
       })
       .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(owner, repo, function(err, result) {
  console.log("Errors:", err);
  //console.log("Result:", result);
  result.forEach(function(contrib){
    var path = "avatars/" + contrib.login + ".jpg";
    var url = contrib.avatar_url
    downloadImageByURL(url, path);
  })
});


