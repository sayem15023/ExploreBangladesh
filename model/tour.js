const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A tour must have a name'],
        unique:true,
        trim:true,
        maxlength:40,
        minlength:10
    },
    duration:{
        type:Number,
        required:[true, 'A tour must have a duration']
    },
    description:{
        type:String,
        required: [true, 'A tour must have a description']
    },
    maxGroupSize:{
        type:Number,
        required:[true, 'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true, 'A tour must have a difficulty'],
        enum:{
            values:['easy','medium', 'difficult'],
            message:"difficulty us either: easy, medium or difficult"
        }

    },
    ratingAverage:{
        type:Number,
        default:4.5,
        set: val => Math.round(val*10)/10

    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true, 'A tour must have a price']
    },
    slug:String,
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true, 'A tour must have a description']

    },
    imageCover:{
        type:String,
        required:[true, 'A tour must a have cover image']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select: false
    },
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    startDates:[Date],
    startLocation: {
        type: {
            type: String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String

    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ]},
    {
        toJSON: {virtuals:true},
        toObject: { virtuals:true}
    }
);
 
tourSchema.index({
    price:1,
    ratingAverage:-1
})
tourSchema.index({slug:1})
// Virutal Populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField:'_id'
});

tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
});
//Query middleware

tourSchema.pre(/^find/ ,function(next){
    this.populate({
        path:'guides',
        select:'-_v -passwordChangedAt'
    })
    next()
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;