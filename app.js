const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const LogInCollection = require('./mongoDB');

const ReserveCollection=require('./mongo');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const publicPath = path.join(__dirname, '/public');
console.log(publicPath);

app.get('/signup', (req, res) => {
     res.sendFile(path.join(publicPath, 'signup.html'));
    
});

app.get('/', (req, res) => {
     res.sendFile(path.join(publicPath, 'login.html'));
    
});

app.post('/signup', async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        };

        const existingUser = await LogInCollection.findOne({ name: data.name });
        if (existingUser) {
            console.log("User details already exist");
            res.status(401).send(`
                    <script>
                    alert('User alerady Exists');
                    window.location.href = '/signup.html'; // Redirect to signup page
                    </script>
                `);
        }

        await LogInCollection.create(data);
        res.status(201).sendFile(path.join(publicPath, 'home.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


app.post('/login', async (req, res) => {
    try {
        // Find a document in the LogInCollection where name matches the name provided in the request body
        const check = await LogInCollection.findOne({ email: req.body.email });

        // If a document is found
        if (check) {
            // Log the retrieved password and the password provided in the request body (for debugging)
            console.log('Retrieved password:', check.password);
            console.log('Provided password:', req.body.password);

            // Check if the retrieved password matches the password provided in the request body
            if (check.password === req.body.password) {
                // If passwords match, send the home.html file as a response
                res.sendFile(__dirname + '/public/home.html');
            } else {
                // Send error message to display in error div
                
                res.status(401).send(`
                    <script>
                    alert('Incorrect Password or Invalid email');
                    window.location.href = '/login.html'; // Redirect to home page
                    </script>
                `);
            }
            
        } else {
            // If no document is found, send a response indicating wrong details
            res.status(401).send(`
            <script>
            alert('User not Found Re-Enter Again');
            window.location.href = '/signup.html'; // Redirect to login page
            </script>
        `);
        }
    } catch (e) {
        // If an error occurs during the database operation or any other part of the code, send a response indicating an error
        console.error(e);
        res.send("An error occurred");
    }
});
app.get('/rest', (req, res) => {
    res.sendFile(path.join(publicPath, 'rest.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(publicPath, 'about.html'));
});
app.get('/contact',(req,res)=>{
    res.sendFile(path.join(publicPath, 'contact.html'));
})

app.post('/reserve', async (req, res) => {
    try {
        const Rdata = {
            Rname: req.body.Rname,
            Rphone: req.body.Rphone,
            Rmember: req.body.Rmembers,
            Rdate: req.body.Rdate,
            Rtime: req.body.Rtime
        };
        await ReserveCollection.create(Rdata);
        
        // Send a response to trigger a modal display in the client-side
        res.status(201).send(`
            <script>
                alert('EazyDine says your Reservation Successful');
                window.location.href = '/home.html'; // Redirect to home page
            </script>
        `);
        
        console.log(Rdata);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
