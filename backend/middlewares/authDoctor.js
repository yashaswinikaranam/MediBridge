import jwt from 'jsonwebtoken'
//doctor authentication middleware
/*const authDoctor = async(req,res,next)=> {
    try {
        console.log("authDoctor middleware reached");
        const {dToken}=req.headers
        console.log(req.headers);
        if(!dToken) {
            return res.json({
                success:false,
                message:'Not Authorized! Login again'
            })
        }
        const token_decode=jwt.verify(dToken,process.env.JWT_SECRET)
        req.docId = token_decode.id
        next()
    } catch(e) {
        console.log('Error in admin login')
        res.json({
                success:false,
                message:e.message
            })
    }
} */
const authDoctor = async (req, res, next) => {
    try {

        const dToken = req.headers.dtoken;
        if(!dToken) {
            return res.json({
                success:false,
                message:'Not Authorized! Login again'
            })
        }

        const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);


        req.docId = token_decode.id;
        next();
    } catch (e) {

        res.json({
            success: false,
            message: e.message
        });
    }
}
export default authDoctor