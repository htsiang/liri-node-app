console.log("liri.js loaded");
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
const fs = require('fs');
var spotify = new Spotify(keys.spotify);

let command = process.argv[2];
let searchItem = process.argv;
searchItem.splice(0, 3);
console.log(command);
console.log(searchItem);

apiCalls(command, searchItem);


function apiCalls(command, searchItem) {
    switch (command) {
        case "concert-this": // use bands in town api
            let urlBands = "https://rest.bandsintown.com/artists/" + searchItem.join("+") + "/events?app_id=codingbootcamp";
            console.log(urlBands);

            axios
                .get(urlBands)
                .then(function (response) {
                    for (let i = 0; i < response.data.length; i++) {
                        console.log(`Upcoming concert #${i + 1}:`)
                        console.log(`Venue Name: ${response.data[i].venue.name}`);
                        console.log(`Venue Location: ${response.data[i].venue.city}, ${response.data[i].venue.country}`)
                        console.log(`Date of Event: ${response.data[i].datetime}`)
                    }

                    if (response.data.length === 0) {
                        console.log(`There are no upcoming concerts for ${searchItem.join(" ")}.`);
                    }
                });
            break;
        case "spotify-this-song": // spotify npm
            spotify
                .search({ type: 'track', query: searchItem.join(" "), limit: 10 })
                .then(function (response) {

                    for (let i = 0; i < response.tracks.items.length; i++) {
                        console.log(`Search result #${i + 1}:`);
                        console.log(`Artist(s): `);
                        for (let n = 0; n < response.tracks.items[i].artists.length; n++) {
                            console.log(response.tracks.items[i].artists[n].name);
                        };
                        console.log(`Song name: ${response.tracks.items[i].name}`)
                        console.log(`Preview Link: ${response.tracks.items[i].preview_url}`)
                        console.log(`Spotify Song Link: ${response.tracks.items[i].external_urls.spotify}`)
                        console.log(`Album: ${response.tracks.items[i].album.name}`)
                        // console.log(response.tracks.items[i]);
                        console.log(" ");
                    }

                    if (response.tracks.items.length === 0) {
                        console.log("No tracks were found.");
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
            break;
        case "movie-this": // use OMDB api
            let urlOMDB = `http://www.omdbapi.com/?t=${searchItem.join("+")}&y=&plot=short&apikey=trilogy`;

            axios
                .get(urlOMDB)
                .then(function (response) {
                    console.log(`Title: ${response.data.Title}`);
                    console.log(`Year of release: ${response.data.Year}`);
                    console.log(`IMDB rating: ${response.data.imdbRating}`);
                    console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
                    console.log(`Country of production: ${response.data.Country}`);
                    console.log(`Language(s): ${response.data.Language}`);
                    console.log(`Plot: ${response.data.Plot}`);
                    console.log(`Actors: ${response.data.Actors}`);
                });
            break;
        case "do-what-it-says": // use fs to read random.txt
            fs.readFile('random.txt', 'utf8', (err, data) => {
                if (err) throw err;

                console.log(data);
                let fileCommand = data.split(',');
                console.log(fileCommand);

                apiCalls(fileCommand[0], fileCommand[1].split(" "));
            })
            break;
        default:
            console.log("That is not a valid command.");
    };
};