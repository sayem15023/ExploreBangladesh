const AppError = require("../utility/appError");

const handleDuplicateFieldError= err=>{
    const value =  err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)
    const message =`Duplicate field value: ${value}. Please use another value`
    return new AppError(message,400);
}
const handleCastError= err=>{
    const message = `Invalid ${err.path}:${err.value}`;
    return new AppError(message,400);

};
const handleJsonWebTokenError= err=>{
    const message = `Invalid token. please log in again`;
    return new AppError(message,400);

};
const handleTokenExpiredError= err=>{
    const message = `your token has expired. please log in again`;
    return new AppError(message,400);

};
const handleValidatorError = err =>{
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Validation Error: ${errors.join('.')}`    

    return new AppError(message, 400);
} 

const sendErrorDev = (err,req,res)=>{
    if (req.originalUrl.startsWith('/api')){

        res.status(err.statusCode).json({
            status:err.status,
            error:err,
            stack:err.stack,
            message:err.message
        });
    }
    else{
        res.status(err.statusCode).render('error',{
            title:'Something went wrong',
            msg: err.message
        })
    }
};

const sendErrorProd = (err,req,res)=>{
    if(req.originalUrl.startsWith('/api')){
        if (err.isOperational){
            res.status(err.statusCode).json({
                status:err.status,
                message:err.message
            });
        }else{
            comsole.error(`Error: `, err)
            res.status(500).json({
                status:'error',
                message:'Internal server error'
            });
        }
    }else {
        if (err.isOperational){
            res.status(err.statusCode).render('error',{
                title:'Something went wrong',
                msg: err.message
            });
        }else{
            comsole.error(`Error: `, err)
            res.status(err.statusCode).render('error',{
                title:'Something went wrong',
                msg: "Please try again later       "
            });
        }
        
    }

}

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    console.log(err)
    if(process.env.NODE_ENV==='development'){
        sendErrorDev(err,req,res)
    
    }else if(process.env.NODE_ENV==='production'){
        let error = {...err}
        error.message=err.message
        
        if (error.name ==='CastError'){
            error= handleCastError(error)
        };
        if(error.name==='MongoError' && error.code ===11000){
            error= handleDuplicateFieldError(error)
        }
        if(error.name==='ValidatorError'){
            error = handleValidatorError(error);
        }
        if(error.name==="JsonWebTokenError"){
            error = handleJsonWebTokenError(error);
        }
        if(error.name==="TokenExpiredError"){
            error = handleTokenExpiredError(error);
        }
        sendErrorProd(error,req,res)
    }   
    next()
}