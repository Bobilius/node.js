const jwt = require("jsonwebtoken");
const Client = require("./models/clients");


const verifyToken = async (req, res) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')) {
    try{
      let j = jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET)

      let client = await Client.findOne({
          email: j.email
        })
      if (!client) {
        res.status(403)
        .send({
          message: "Invalid JWT token"
        });
        return;
      }
      return client;
    }
    catch(err){
      res.status(403)
        .send({
          message: err.message
        });
    }
  }
  else{
    res.status(403)
      .send({
        message: "No JWT token"
      });
      return;
    }
    
};

module.exports = verifyToken;