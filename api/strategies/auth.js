const auth = (req,res,next) => {
    if(req.isAuthenticated()){
        // return res.json({auth:true})
        return next()
    }
    return res.json({auth:false})
}

const guest = (req,res,next) => {
    if(req.isAuthenticated()){
        return res.json({guest:false})
    }
    return next();
}

module.exports = {
    auth,
    guest
}