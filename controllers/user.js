const User = require('../models/User.js');

const bcrypt = require("bcrypt");
const auth = require('../auth.js');

const { errorHandler } = auth;

module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")){
        return res.status(400).send({message : 'Invalid email format'});
    }else if (req.body.password.length < 8) {
        return res.status(400).send({message: 'Password must be atleast 8 characters long'});
    } else {
        let newUser = new User({
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({message: 'Registered Successfully'}))
        .catch(error => errorHandler(error, req, res));
    }
};


module.exports.loginUser = (req, res) => {
	if(req.body.email.includes('@')){
		return User.findOne({email: req.body.email})
		.then(result => {
			if(result === null){
				return res.send({message: 'No email found'});
			}
			else{
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if(isPasswordCorrect){
					return res.status(200).send({access : auth.createAccessToken(result)})
				}else{
					return res.status(401).send({ message: 'Incorrect email or password' });
				}

			}
		})
		.catch(err => errorHandler(err, req, res));
	}else{
		return res.status(400).send({ message: 'Invalid email format' });
	}
}

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {

        if(!user){
            return res.status(403).send({ message: 'invalid signature' })
        }else {
            user.password = "";
            return res.status(200).send({user: user});
        }  
    })
    .catch(error => errorHandler(error, req, res));
};


