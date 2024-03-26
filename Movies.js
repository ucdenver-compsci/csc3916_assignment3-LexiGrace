var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Movie schema
const MovieSchema = new mongoose.Schema({
    title: {type: String, required: true, index: true},
    releaseDate: Date,
    genre: {
        type: String,
        enum:[
            'Action','Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Western', 'Science Fiction'
        ],
    },
    actors: [{
        actorName: String,
        characterName: String,
    }],
});

const Movie = mongoose.model('Model', MovieSchema);

// const movies= [
//     {
//         title: "La La Land",
//         releaseDate: new Date('2016-12-09'), 
//         genre: 'Drama',
//         actors: [
//             { actorName: 'Ryan Gosling', characterName: 'Sebastian' },
//             { actorName: 'Emma Stone', characterName: 'Mia' },
//             { actorName: 'John Legend', characterName: 'Keith' }
//         ]
//     },

//     {
//         title: "Proof",
//         releaseDate: new Date('2005-09-16'), 
//         genre: 'Drama',
//         actors: [
//             { actorName: 'Gwyneth Paltrow', characterName: 'Catherine' },
//             { actorName: 'Anthony Hopkins', characterName: 'Robert' },
//             { actorName: 'Jake Gyllenhaal', characterName: 'Hal' }
//         ]
//     },

//     {
//         title: "Harry Potter and the Prisoner of Azkaban",
//         releaseDate: new Date('2004-06-04'), 
//         genre: 'Fantasy',
//         actors: [
//             { actorName: 'Daniel Radcliffe', characterName: 'Harry Potter' },
//             { actorName: 'Emma Watson', characterName: 'Hermione Granger' },
//             { actorName: 'Rupert Grint', characterName: 'Ron Weasley' }
//         ]
//     },

//     {
//         title: "Inception",
//         releaseDate: new Date('2010-07-16'), 
//         genre: 'Action',
//         actors: [
//             { actorName: 'Leonardo DiCaprio', characterName: 'Dom Cobb' },
//             { actorName: 'Joseph Gordon-Levitt', characterName: 'Arthur' },
//             { actorName: 'Ellen Page', characterName: 'Ariadne' }
//         ]
//     },
// ];

// return the model
module.exports = mongoose.model('Movie', MovieSchema);
module.exports = Movie;