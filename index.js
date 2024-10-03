
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



mongoose
    .connect(
        'mongodb+srv://meena:meena@cluster0.igx3gzr.mongodb.net/meena?retryWrites=true&w=majority&appName=Cluster0',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log('Connected to the database!');
    })
    .catch((error) => {
        console.log('Connection failed!', error);
    });

const users = [
    {
        email: 'meena123@gmail.com',
        password: 'meena',
    },
    {
        email: 'meenakshi12@gmail.com',
        password: '$2b$12$0gHfSl8i0FM1ovm0f8pVXOH6TH.CrSdTXkbM4Jo.L3IlQZcfQ5TFO',
    },
];

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12); // Hash the password
    users.push({ email, password: hashedPassword });
    console.log('New user added:', { email, password: hashedPassword });
    res.status(200).send(users);
});

app.post('/check-user', (req, res) => {
    const { email } = req.body;
    const userExists = users.some((user) => user.email === email);
    res.json({ exists: userExists });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Trying to log in with:', email);
    const user = users.find((user) => user.email === email);
    if (!user) {
        console.log('User not found:', email);
        return res.status(404).send('User not found');
    }
    console.log('hashed password:', user.password);
    console.log('Password provided:', password);
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        return res.status(400).send('Invalid password');
    }
    res.status(200).send('Logged in successfully');
});

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
        default: 'No rating available',
    },
});

const Flipcart = mongoose.model('Flipcart', flipcartSchema, 'flipcart');

app.get('/flipcart', async (req, res) => {
    try {
        const result = await Flipcart.find().limit(1500);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/flipcart-pagination', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 1500;
        const startIndex = (page - 1) * limit;
        const result = await Flipcart.find().skip(startIndex).limit(limit);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const address = [
    {
        name: "John Doe",
        email: "john.doe@example.com",
        city: "New York",
        state: "NY",
        houseNumber: "123",
        landmark: "Near Central Park",
        alternatePhoneNumber: "1234567890",
        pincode: "10001"
    }

];


// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// });

// module.exports = mongoose.model('User', userSchema);


// app.post('/api/user', async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Log the request body to debug
//         console.log('Request body:', req.body);

//         if (!name || !email || !password) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const newUser = new User({ name, email, password });
//         await newUser.save();

//         res.status(200).json({
//             message: 'User details saved successfully!',
//             userDetails: newUser,
//         });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// });

app.post('/api/user', (req, res) => {
    const userDetails = req.body;

    // Log the user details to check the incoming request
    console.log('Received user details:', userDetails);

    // Simulate saving the data and send a response back
    res.status(200).json({
        message: 'User details saved successfully!',
        userDetails: userDetails,
    });
});


// Delivery Address Schema


// const deliveryAddressSchema = new mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     name: [String], // This will now accept an array of strings
//     email: [String],
//     city: [String],
//     state: [String],
//     houseNumber: [String],
//     landmark: [String],
//     alternatePhoneNumber: [String],
//     pincode: [String]
// });

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
