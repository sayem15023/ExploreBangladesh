const AppError = require('../utility/appError');
const Tour=require('./../model/tour');
const APIFeatures=require('./../utility//apiFeature')
const asyncHandler = require('./../utility/asyncHandler');


exports.getAllTours=asyncHandler(async (req,res,next)=>{

    const feature= new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().pagination();
    const tours = await feature.query;

    res.status(200).json({
        status:"success",
        result: tours.length,
        Data:{
            tours
        }
    });
});

exports.getTour=asyncHandler(async (req,res,next)=>{
    const tour = await Tour.findById(req.params.id).populate('reviews');
    if(!tour){
        return next(new AppError('No tour found with that name'),404)
    };
 
    res.status(200).json({
        status:"success",
        Data:{
            tour
        }
    });
});

exports.createTour=asyncHandler(async (req,res,next)=>{

    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status:"success",
        Data:{
            tour: newTour
        }
    });

});

exports.updateTour=asyncHandler(async (req,res,next)=>{

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    });

    if(!tour){
        return next(new AppError('No tour found with that id'),404)
    };

    res.status(200).json({
        status:"success",
        Data:{
            tour
        }
    });
});

exports.deleteTour=asyncHandler(async (req,res,next)=>{

    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour){
        return next(new AppError('No tour found with that id'),404)
    };
    res.status(200).json({
        status:"success",
        data: null
    });

});
