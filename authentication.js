let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
const Client = require("./models/clients");

exports.signup = async (req, res) => {
  if(!req.body.password || req.body.password.length < 6){
    res.status(400)
      .send({
        message: "must provie a password and it must be at least 6 characters long"
      });
    return;
  }
  
  //all other validations done in schema
  const client = new Client({
    id2: req.body.id,
    fullName: req.body.fullName,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  try{
    let result = await client.save();
    res.status(200)
        .send({
          message: "Client Registered successfully", 
          client: {
            id: client.id2,
            email: client.email,
            fullName: client.fullName,
            role: client.role,
          },
        })
    }
  catch(err){
      res.status(400)
        .send({
          message: err.message
        });
      return;
    }
};

exports.signin = async (req, res) => {

  if(!req.body.email || !req.body.password){
    res.status(400)
      .send({
        message: "Please provide all required fields"
      });
    return;
  }

  if(req.body.password.length < 6){
    res.status(400)
      .send({
        message: "Password must be at least 6 characters long"
      });
    return;
  }

  if( /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email) === false){
    res.status(400)
      .send({
        message: "Invalid email address"
      });
    return;
  }

  let client;
  try{
    client = await Client.findOne({
      email: req.body.email
    })
  }
  catch {
    if (err) {
      res.status(400)
        .send({
          message: err
        });
      return;
    }
  }
    if (!client) {
      return res.status(401)
        .send({
          message: "Client Not found."
        });
    }

      //comparing passwords
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        client.password
      );
      // checking if password was valid and send response accordingly
      if (!passwordIsValid) {
        return res.status(401)
          .send({
            accessToken: null,
            message: "Invalid Password!"
          });
      }
      //signing token with client id
      let token = jwt.sign({
        email: client.email
      }, process.env.API_SECRET, {
        expiresIn: 86400
      });

      let user = {
        id: client.id2,
        email: client.email,
        fullName: client.fullName,
        role: client.role,
      }
      if(user.role === "business")
        user.businesses = client.businesses;
      //responding to client request with client profile success message and access token.
      res.status(200)
        .send({
          user: user,
          message: "Login successfull",
          accessToken: token,
        });
  };