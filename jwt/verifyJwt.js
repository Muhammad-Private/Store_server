const jwt = require('jsonwebtoken');
 
const VerifyJwt=(req, res,next) =>
{
  try {
    const authHeader = req.heaeders.authorization  ||  req.headers.Authorization;
    if (!authHeader?.startsWith(`Bearer `)) 
    {
      return res.status(401).json({ message: 'Uauthorized' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.nv.access_key,(error,decoded)=>
    {
      if(error)
      {
        res.status(401).json({message:"forbidden"});
      }
      next();
    })
  }
  catch (error) 
  {
    if (error.name === 'TokenExpiredError') 
    {
      return res.status(401).json({ message: 'Token has expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports=VerifyJwt