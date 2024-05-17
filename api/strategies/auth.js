const auth = (req,res,next) => {
    if(req.isAuthenticated()){
        // return res.json({auth:true})
        return next()
    }
    return res.json({auth:false})
}

module.exports = {
    auth
}