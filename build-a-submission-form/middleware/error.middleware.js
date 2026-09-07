const notFoundHandler = (req,res,next)=> {
    const error = new Error(`Cannot fine ${req.originalUrl}`)
    error.status = 404
    next(error)
}

const finalErrorHandler = (err,req,res,next)=> {
    const status = err.status || 500
    console.log(err);
    res.status(status).json({
        error : true ,
        status,
        message : err.status==500 ? "Internal Server Error (Check Server Logs)" : err.message
    })
    
}

export {notFoundHandler , finalErrorHandler}