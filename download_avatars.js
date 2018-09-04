var request = require('request');
var secrets = require('./secrets');
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');


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



getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  //console.log("Result:", result);
  result.forEach(function(contrib){
    var path = "avatars/" + contrib.login + ".jpg";
    var url = contrib.avatar_url
    downloadImageByURL(url, path);
  })
});



function downloadImageByURL(url, filePath) {
  //var imageName = filePath.substring(8);
  //console.log("substirng: " + imageName);
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


//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");


