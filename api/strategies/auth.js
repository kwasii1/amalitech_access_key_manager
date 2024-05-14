const auth = (req,res,next) => {
    if(req.isAuthenticated()){
        return res.json({auth:true})
    }
    return res.json({auth:false})
}

module.exports = {
    auth
}