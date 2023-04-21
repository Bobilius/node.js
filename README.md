server using node.js in JS and MongoDB for database

to register a client, send request to /register
a valid registrationg includes client id, fullName, email, role (two options only, normal and business) and a password


to login, sed a request to /login


to use any protected route, the JWT token should be in the first value bearer header


to get client data, send client id entered during regisrtration to /client/:id


to reister a new business card, send a request to /registerBusiness
notice that the registerered card automatically uses the token to get the owner ID
registering a business on a normal account changed the account type to business
a valid registration must include: businessName, address, phone, photo, description


to get a business card's data, send request to /business/:id


to get all business cards of a client, send request to /business/byuser/:id
notice the id is the id of the client on registration


to update the business card, send a PUT request to /business/:id
notice no error is given if user sends differently named data to update, it simply doesnt update/add this data in


to delete a business card, send a DELETE request to /business/:id
notice a successful respone is give even if the card doesnt exist. as it technically count as successful deletion.
