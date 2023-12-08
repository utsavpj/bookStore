import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {

  next();
  // const token = req.header('Authorization');

  // if (!token) {
  //   return res.status(401).json({ message: 'User not authorized' });
  // }

  // jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
  //   if (error) {
  //     return res.status(403).json({ message: 'Invalid token' });
  //   }
  //   console.log("IN auth token", user);
  //   req.user = user;
  //   next();
  // });
};

// --- POST/Books only for Admin
export const isAdmin  = (req, res, next) => {

    next();
  // console.log('CHECKING',req.user); 
  // if(req.user.role =="admin") {
  //   console.log("i am admin");
  //   next();
  // } 
  // res.status(403).send({message:"Not Authorized"});
  
  
}

