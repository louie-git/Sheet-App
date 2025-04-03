import jwt from 'jsonwebtoken'


const authorizeUser = (req,res,next) => {

  try {
    
    const secret = 'this-is-the-secret-key'
    const authBearer = req.headers.authorization
    const token  = authBearer && authBearer.split(' ')[1]
    if(!token)return res.status(200).send({message: 'Unauthorized'})
    // jwt.verify()

    jwt.verify(token, secret, (err,decoded)=> {
      if(err) return res.status(401).send({message: 'Unauthorized', error: err.message})
      const user = decoded
      next()
    })
  } catch (error) {
    res.status(500)
  }
}

export { authorizeUser }