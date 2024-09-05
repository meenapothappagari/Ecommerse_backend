
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");


app.use(cors());
app.use(bodyParser.json());

mongoose
    .connect("mongodb+srv://meena:meena@cluster0.igx3gzr.mongodb.net/meena?retryWrites=true&w=majority&appName=Cluster0",
        {
            useNewUrlParser: true, // to avoid deprecated warning
            useUnifiedTopology: true, // enable new connection management engine
        }
    )
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((error) => {
        console.log("Connection failed!", error);
    });


const users = [
    {
        email: "meena123@gmail.com",
        password: "meena",
    
    },
    {
        email: "meenakshi12@gmail.com",
        password: "$2b$12$0gHfSl8i0FM1ovm0f8pVXOH6TH.CrSdTXkbM4Jo.L3IlQZcfQ5TFO",
    },
];

app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12); // Hash the password

    users.push({
        email: email,
        password: hashedPassword,
    });

    console.log("New user added:", { email, password: hashedPassword }); // Log the email and hashed password

    res.status(200).send(users);
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("Trying to log in with:", email);

    const user = users.find((user) => user.email === email);

    if (!user) {
        console.log("User not found:", email);
        res.status(404).send("User not found");
    }

    console.log("hashed password:", user.password);
    console.log("Password provided:", password);

    const isValidPassword = bcrypt.compare(password, user.password);

    console.log("Password valid:", isValidPassword);

    if (!isValidPassword) {
        console.log("Invalid password for user:", email);
        res.status(400).send("Invalid password");
    }

    res.status(200).send("Logged in successfully");
});


// Flipcart data starting from here...

// const mongoose = require('mongoose');

const flipcartSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_name: String,
    product_category_tree: [String],
    retail_price: Number,
    discounted_price: Number,
    image: [String],
    description: String,
    product_rating: {
        type: String,
        default: "No rating available"
    },
   
        

});
// const Flipcart = mongoose.model('Flipcart', flipcartSchema);
// const Flipcart = mongoose.model('flipcart', flipcartSchema);
const Flipcart = mongoose.model('Flipcart', flipcartSchema, 'flipcart');

app.get("/flipcart", (req, res) => {
    try {
        Flipcart.find().limit(200)
            .then((result) => {
                res.status(200)
                .send(result)
            })
    } catch (error) {
        res.status(500)
        .send(error)
    }
})

exports.getAllFlipcart = (req,res)=>{
    try{
        Flipcart.find()
        .limit(200)
        .then((result)=>{
            res.status(200).send(result)
        })
    }catch(error){
        res.status(500).send(error)
    }
}
exports.getFlipcartpagination=(req,res)=>{
    try{
            const page = parseInt(req.query.page) || 1;
            // const limit = parseInt(req.query.limit) || 10;
            const limit = 200;
        
            console.log(page, limit);
            const startIndex = (page - 1) * limit; // value of startindex will be 0
    
        Flipcart.find() // FIND THE DOCUMENTS FROM THE DATABASE
          .skip(startIndex) // SKIP THE DOCUMENTS FROM THE DATABASE. // SKIP THE DATA BEFORE THE START INDEX
          .limit(limit) // IT IS USED TO LIMIT THE NUMBER OF DOCUMENTS TO BE FETCHED FROM THE DATABASE.
          .then((result) => {
            res
              .status(200) // STATUS CODE 200 MEANS SUCCESS
              .send(result); // SENDING THE RESPONSE FROM THE SERVER
          });
      } catch (error) {}
    }



// xports.getAllMovies = (req, res) => {
    //   try {
    //     Movies.find()
    //       .limit(10)
    //       .then((result) => {
    //         // using limit to get only 10 documents from the database.
    //         res.status(200).send(result);
    //       });
    //   } catch (error) {
    //     res.status(500).send(error);
    //   }
    // };
    
    
    // exports.getPaginatiedMovies  = (req, res) => {
    //   try {
    //     const page = parseInt(req.query.page) || 1;
    //     // const limit = parseInt(req.query.limit) || 10;
    //     const limit = 10;
    
    //     // console.log(page, limit);
    //     const startIndex = (page - 1) * limit; // value of startindex will be 0
    
    //     Movies.find() // FIND THE DOCUMENTS FROM THE DATABASE
    //       .skip(startIndex) // SKIP THE DOCUMENTS FROM THE DATABASE. // SKIP THE DATA BEFORE THE START INDEX
    //       .limit(limit) // IT IS USED TO LIMIT THE NUMBER OF DOCUMENTS TO BE FETCHED FROM THE DATABASE.
    //       .then((result) => {
    //         res
    //           .status(200) // STATUS CODE 200 MEANS SUCCESS
    //           .send(result); // SENDING THE RESPONSE FROM THE SERVER
    //       });
    //   } catch (error) {}
    
    //   // EXAMPLE
    
    //   // PAGE = 1
    //   // START INDEX = (1-1)*10 = 0 // WE NEED TO START GIVING THE DATA FROM 0 INDEX TO 9
    //   // 0 I START AND  BECAUSE LIMIT IS 10 SO IT WILL GIVE THE DATA UNTIL 9 INDEX start= 0 and limit = 10
    
     
    // }
    
    
    // exports.createMovie = (req, res) => {
    //   const newMovie = new Movies({
    //     _id: new mongoose.Types.ObjectId(), // to create a new object id
    //     title: req.body.title,
    //     director: req.body.director,
    //     genre: req.body.genre,
    //     year: req.body.year,
    //   });
    //   console.log(newMovie, " new movie");
    
    //   newMovie
    //     .save() // save the document to the database or collection, or update the document in the database.
    //     .then((result) => {
    //       res.status(201).send(result);
    //     })
    //     .catch((error) => {
    //       res.status(500).send(error);
    //     });
    // };
    
    
    
    // exports.searchMovies = (req, res) => {
    //   const { search } = req.query;
    //   if (!search) {
    //     return res.status(400).send({ message: "Search query is required" }); // error message
    //   }
    //   try {
    //     Movies.find({
    //       title: new RegExp(search, "i"), // i => case insensitive, it will ignore the case of the string. "g" => global search, "m" => multiline search
    //     }).then((result) => {
    //       res.status(200).send(result);
    //     });
    //   } catch (error) {
    //     res.status(500).send(error);
    //   }
    
    //   // res.status(200).send("hello")
    // };
    
    
    
    // exports.updateMovie = async (req, res) => {
    //   const { id } = req.params;
    //   console.log(id);
    //   try {
    //     const updatedMovie = await Movies.findByIdAndUpdate(id, req.body, {
    //       new: true,
    //     });
    //     if (!updatedMovie) return res.status(404).send("Movie not found");
    //     res.json(updatedMovie);
    //   } catch (err) {
    //     res.status(400).send(err.message);
    //   }
    // };
    
    
    
    
    
    //  exports.deleteMovie = async (req, res) => {
    //    // id =123  DESTRUCTURING req.params = { id: 123 }
    //    // const { id } = req.params.id;   // {id: {id: 123}}}  INCORRECT STATEMENT
    //    const id = req.params.id; //   req.params = { id: 123 } // DESTRUCTURING, CORRECT STATEMENT
    //    console.log(id);
    
    //    try {
    //      const deletedMovie = await Movies.findByIdAndDelete(id); // DELETE THE DOCUMENT FROM THE DATABASE using UNNQUE ID
    //      if (!deletedMovie) return res.status(404).send("Movie not found"); // error handling  404 => NOT FOUND
    //      res.json({ message: "Movie deleted successfully" });
    //    } catch (error) {
    //      res.status(500).send(error);
    //    }
    // };













app.listen(port, () => {
    // console.log(`Example app listening at http://localhost:${port}`);
});
