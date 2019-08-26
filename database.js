var mongoClient = require('mongodb');

var connectToDatabase = (callback) =>
    {
        mongoClient.connect("mongodb://localhost:27017/DataManager", { useNewUrlParser: true }, function(err, client)
        {                       
            if(err)
            {
                callback(err);
            }
            else
            {
                var db = client.db('trainingdb');
                callback(undefined, db);
            }
        });
    };


module.exports = 
{
    connectToDatabase
};   