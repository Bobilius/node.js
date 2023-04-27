const express = require("express"),
  app = express();

require("dotenv")
  .config();
const mongoose = require("mongoose");
const { signup, signin } = require("./authentication");
const verifyToken = require("./autherization");
const Client = require("./models/clients");
const Business = require("./models/business");


const dbURI = `mongodb+srv://${process.env.DBADMIN}:${process.env.DBPASSWORD}@cluster0.qexef3g.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false); // Takes care of depreciated warning


//Connect to database
try {
    mongoose.connect(dbURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log("connected to db");
  } catch (error) {
    handleError(error);
  }
  process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
  });

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

app.post("/register", (req, res) => {
    signup(req, res);
});

app.post("/login", (req, res) => {
    signin(req, res);
});

app.get("/client/:id", async (req, res) => {
    let requester = await verifyToken(req, res);
    if(!requester){
        //response sent in verifyToken
        return;
    }
    let response = await Client.findOne({
        id2: req.params.id
      })
    if (!response) {
        res.status(400)
          .send({
            message: "Client not found"
          });
        return;
      }
    let user = {
    id: response.id2,
    email: response.email,
    fullName: response.fullName,
    role: response.role,
    }
    if(user.role === "business")
    user.businesses = response.businesses;
    //responding to client request with client profile success message and access token.
    res.status(200)
    .send({
        user: user,
    });
});

app.post("/registerBusiness", async (req, res) => {
    let requester = await verifyToken(req, res);
    if(!requester){
        //response sent in verifyToken
        return;
    }

    let business = new Business({
        ownerID: requester.id2,
        businessName: req.body.businessName,
        address: req.body.address,
        phone: req.body.phone,
        description: req.body.description,
        photo: req.body.photo,
    });
    try {
        let response = await business.save();

        //save card to requestor data, and make sure role is now business
        let updated = await Client.findByIdAndUpdate(requester.id, {businesses:[...requester.businesses, response.id],role:"business"});

        res.status(200)
        .send({
            message: "Business registered successfully",
            businessCard: response
        });

    } catch (error) {
        res.status(400)
        .send({
            message: error.message
        });
    }
});

app.get("/business/:id", async (req, res) => {
    let requester = await verifyToken(req, res);
    if(!requester){
        //response sent in verifyToken
        return;
    }
    let response = await Business.findOne({
        _id: req.params.id
      })
    if (!response) {
        res.status(400)
          .send({
            message: "Business not found"
          });
        return;
      }
    res.status(200)
    .send({
        business: response,
    });
});

app.get("/business/byuser/:id", async (req, res) => {
    let requester = await verifyToken(req, res);
    if(!requester){
        //response sent in verifyToken
        return;
    }
    let response = await Client.findOne({
        id2: req.params.id
      })
    if (!response) {
        res.status(400)
          .send({
            message: "Client not found"
          });
        return;
      }
    let businesses = [];
    for(let i = 0; i < response.businesses.length; i++){
        let business = await Business.findOne({
            _id: response.businesses[i]
            })
        if (!response) {
            res.status(400)
                .send({
                message: "Business not found"
                });
            return;
            }
        businesses.push(business);
    }
    res.status(200)
    .send({
        businesses: businesses,
    });
});

app.put("/business/:id", async (req, res) => {
    let requester = await verifyToken(req, res);
    if(!requester){
        //response sent in verifyToken
        return;
    }
    try {
        let updated = await Business.findByIdAndUpdate(req.params.id, req.body);
        res.status(200)
        .send({
            message: "Business updates successfully",
        });

    } catch (error) {
        res.status(400)
        .send({
            message: error.message
        });
    }
});

app.delete("/business/:id", async (req, res) => {
    let requester = await verifyToken(req, res);
    if(!requester){
        //response sent in verifyToken
        return;
    }
    try {
        let deleted = await Business.findByIdAndDelete(req.params.id);
        //remove business from client data
        let updated = await Client.findByIdAndUpdate(requester.id, {businesses:requester.businesses.filter(business => business != req.params.id)});
        res.status(200)
        .send({
            message: "Business deleted successfully",
        });
    }
    catch (error) {
        res.status(400)
        .send({
            message: error.message
        });
    }
});

//setup server to listen on port 8080
app.listen(process.env.PORT || 8080, async () => {
  console.log("Server is live on port 8080");
})