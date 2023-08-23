const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://jhaabhijeet4518:Abhi4518@cluster0.vqfqx9b.mongodb.net/food-app?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(mongoURI, { useNewUrlParser: true }, (err, result) => {
    if (err) console.log(err);
    else {
      console.log("connected db");
      const fetched_data = mongoose.connection.db.collection("food_data");
      fetched_data.find({}).toArray(async function (err, data) {
        const foodItems = await mongoose.connection.db.collection("food_items");
        foodItems.find({}).toArray(function (err, catData) {
          if (err) console.log(err);
          else {
            global.food_data = data;
            global.food_items = catData;

            // console.log(global.food_data);
          }
        });
      });
    }
  });
};

// // mongoose.set("strictQuery", true);
// // module.exports = {
// //   uri: "mongodb+srv://jabhi414:Abhi@4518@cluster0.3bzaiit.mongodb.net/",
// // };
module.exports = connectDB;
