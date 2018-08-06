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

function searchPhraseOrHashtag(images) {

    var d = new Date();
    console.log("MOMENT : " + d);
    console.log();

    //var TWITTER_SEARCH_PHRASE = 'gripa OR resfriado OR me quiere dar gripa OR gripa y yo en el trabajo OR maldita gripa';
    var TWITTER_SEARCH_PHRASE = 'gripa OR resfriado';
    // Set up your search parameters
    var params = {      
      q: TWITTER_SEARCH_PHRASE,
      count: 1,
      result_type: 'recent',
      lang: 'es',
      //place_country: 'ISO 3166-2:MX',
      geocode: '19.3910036,-99.2840424,1000km', //Comentar para hacer pruebas de proximidad      
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

              console.log('Text: ' + tweetText);
              console.log();
              console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`);              

              var image_path,
                  b64content;

              var randomIndexText = "";              

              console.log('Opening an gif...');

              if (tweetText.includes("dar")) {
                console.log("DAR");
                console.log();

                var imagesFolderDar = [
                  path.join(__dirname, '/images/dar/' + 'denada.gif'),
                  path.join(__dirname, '/images/dar/' + 'lagripateama.gif'),
                  path.join(__dirname, '/images/dar/' + 'tevoyadar.gif'),
                  path.join(__dirname, '/images/dar/' + 'tevoyadarcontodo.gif')
                ];

                var randomIndexImageDar = Math.floor(Math.random()*imagesFolderDar.length);
                image_path = imagesFolderDar[randomIndexImageDar];

                b64content = fs.readFileSync(image_path, { encoding: 'base64' });

              } else if(tweetText.includes("trabajo")) {
                console.log("TRABAJO");
                console.log();
                
                var imagesFolderTrabajo = [
                  path.join(__dirname, '/images/trabajo/' + 'alagripalegustatucomentario.gif'),
                  path.join(__dirname, '/images/trabajo/' + 'arruinaretufin.gif'),
                  path.join(__dirname, '/images/trabajo/' + 'ganandocomosiempre.gif'),
                  path.join(__dirname, '/images/trabajo/' + 'notedejaretrabajar.gif'),
                  path.join(__dirname, '/images/trabajo/' + 'odiamemas.gif')
                ];

                var randomIndexImageTrabajo = Math.floor(Math.random()*imagesFolderTrabajo.length);
                image_path = imagesFolderTrabajo[randomIndexImageTrabajo];

                b64content = fs.readFileSync(image_path, { encoding: 'base64' });                

              } else if (tweetText.includes("maldita")) {
                console.log("MALDITA");
                console.log();
                
                var imagesFolderMaldita = [
                  path.join(__dirname, '/images/maldita/' + 'arruinaretusplanes.gif'),
                  path.join(__dirname, '/images/maldita/' + 'askiusmi.gif'),
                  path.join(__dirname, '/images/maldita/' + 'odiamemas.gif'),
                  path.join(__dirname, '/images/maldita/' + 'yoque.gif'),
                  path.join(__dirname, '/images/maldita/' + 'yotambienteodio.gif')
                ];

                var randomIndexImageMaldita = Math.floor(Math.random()*imagesFolderMaldita.length);
                image_path = imagesFolderMaldita[randomIndexImageMaldita];

                b64content = fs.readFileSync(image_path, { encoding: 'base64' });                

              } else {
                console.log("GRIPA");
                console.log();

                var imagesFolder = [
                  path.join(__dirname, '/images/' + 'arruinaretufin.gif'),
                  path.join(__dirname, '/images/' + 'disculpa.gif'),
                  path.join(__dirname, '/images/' + 'lagripateama.gif'),
                  path.join(__dirname, '/images/' + 'maquinaescribirinvisible.gif'),
                  path.join(__dirname, '/images/' + 'noparaqueoque.gif'),
                  path.join(__dirname, '/images/' + 'porquemeniegas.gif'),                  
                  path.join(__dirname, '/images/' + 'tevoyadar.gif'),
                  path.join(__dirname, '/images/' + 'tevoyadarcontodo.gif')
                ];

                var randomIndexImage = Math.floor(Math.random()*imagesFolder.length);
                image_path = imagesFolder[randomIndexImage];

                b64content = fs.readFileSync(image_path, { encoding: 'base64' });
                                
              }

              if (tweetId == '904578457769795584') {

                console.log("Soy La Gripa XD");

              } else {

                T.post('media/upload', { media_data: b64content }, function (err, data, response) {
                  if (err){
                    console.log('ERROR:');
                    console.log(err);
                  } else {
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
                          }

                    });
                    
                  }
                });

              }

            }
          });
        } //End for      

      } else {
        console.log(err);
      }
    })

}

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);          
        }
      });
    });    

  });
};

setInterval(function(){
      
  walk(__dirname + '/images', function(err, results) {
    if (err) throw err;
    console.log(results);    
    searchPhraseOrHashtag(results);
    http.get('http://young-citadel-41224.herokuapp.com/');
  });

}, 20*60*1000);