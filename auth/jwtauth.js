import jwt from 'jsonwebtoken'


const authenticateUser = (req, res) => {

//not used currently
  const secret = 'secretkey here' //set secret key when finalized.
  const user = {
    id: 123,
    name: 'Rean Nuenay',
    accessToken: 'testing'
  }
  const token = jwt.sign({id: user.id}, secret, {expiresIn: '1d'})
  res.status(200).send(token)
}

export default authenticateUser