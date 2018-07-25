var express = require("express")
var path = require('path')
var app     = express()
var port    = process.env.PORT || 5000

var http = require("http");

app.get("/", function(req, res) {
  res.send("Node JS Bot to search a specific word to reply a comment. La Gripa.");
});

app.listen(port);

console.log("Bot ready!");
console.log();

var fs = require('fs')

var Twit = require("twit");
var config = require("./config");

console.log(config);
console.log();

var T = new Twit(config);

var config = {    
    text_to_tweet_short: '#TeOdiamosGripa' // short text to tweet
};

function random_from_array(images){
  return images[Math.floor(Math.random() * images.length)];
}


function upload_random_image(images){
  console.log('Opening an image...');
  var image_path = path.join(__dirname, '/images/' + random_from_array(images)),
      b64content = fs.readFileSync(image_path, { encoding: 'base64' });

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      T.post('statuses/update', {
        media_ids: new Array(data.media_id_string)
      },
        function(err, data, response) {
          if (err){
            console.log('ERROR:');
            console.log(err);
          }
          else{
            console.log('Posted an image!');
          }
        }
      );
    }
  });
}


function searchPhraseOrHashtag(images) {

    var d = new Date();
    console.log("MOMENT : " + d);
    console.log();
    
    var TWITTER_SEARCH_PHRASE = 'gripa OR resfriado';
    // Set up your search parameters
    var params = {
      //q: TWITTER_SEARCH_PHRASE.toLowerCase(),
      q: TWITTER_SEARCH_PHRASE,
      count: 1,
      result_type: 'recent',
      lang: 'es',
      geocode: '19.3910036,-99.2840424,1000km', //Comentar para hacer pruebas de proximidad
      //until: '2018-07-01'
    }

    // Initiate your search using the above paramaters
    T.get('search/tweets', params, function(err, data, response) {
      // If there is no error, proceed
      if(!err){        

        // Loop through the returned tweets
        for(let i = 0; i < data.statuses.length; i++){
          // Get the tweet Id from the returned data
          let id = { id: data.statuses[i].id_str }          

          // Try to Favorite the selected Tweet
          T.post('favorites/create', id, function(err, response){
            // If the favorite fails, log the error message
            if(err){
              //console.log(err[0].message);
              console.log("No recent twitter");
            }
            // If match is successful, send tweet response
            else{

              let username  = response.user.screen_name;
              let tweetId   = response.id_str;
              let tweetText = response.text;              
              
              console.log();
              console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`)

              /* Here TODO ALL */
              console.log('Opening an gif...');
              var image_path = path.join(__dirname, '/images/' + random_from_array(images)),
              b64content = fs.readFileSync(image_path, { encoding: 'base64' });

              if (tweetId == '904574215260602369') {                
                console.log("Soy La Gripa XD");
              } else {

                T.post('media/upload', { media_data: b64content }, function (err, data, response) {
                  if (err){
                    console.log('ERROR:');
                    console.log(err);
                  }
                  else{
                    console.log('Image uploaded!');
                    console.log('Now tweeting it...');          

                    var status = {
                          in_reply_to_status_id: tweetId,
                          status: "@" + username + " " + config.text_to_tweet_short,
                          media_ids: new Array(data.media_id_string)
                    };

                    T.post('statuses/update', status, function (err, tweet, response){

                          if (err) {
                              reject(err);
                          } else {
                              console.dir("exit");
                              //resolve(tweet);
                          }

                    });
                    
                  }
                });

              }

            }
          });
        } //End for
      /*}) //End Database*/

      } else {
        console.log(err);
      }
    })

}


fs.readdir(__dirname + '/images', function(err, files) {
  if (err){
    console.log(err);
  }
  else{
    var images = [];
    files.forEach(function(f) {
      images.push(f);
    });

    // run the function every 29 minutos. Heroku's free count condition
    setInterval(function(){
      searchPhraseOrHashtag(images);
      http.get('http://young-citadel-41224.herokuapp.com/');
    }, 20*60*1000);
  }
});