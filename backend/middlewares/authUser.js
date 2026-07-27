import jwt from 'jsonwebtoken'

const authUser = async(req,res,next)=> {
    try {
        const {token}=req.headers
        if(!token) {
            return res.json({
                success:false,
                message:'Not Authorized! Login again'
            })
        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET)
        req.userId = token_decode.id
        next()
    } catch(e) {
        console.log('Error in admin login')
        res.json({
                success:false,
                message:e.message
            })
    }
}
export default authUser