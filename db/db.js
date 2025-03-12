const mongoose = require('mongoose');

const objectId = mongoose.Schema.Types.ObjectId;
// Creator Schema
const creatorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Invalid email address'] // Email validation using regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // Creator-specific fields
    creatorFirstName: {
        type: String,
        required: true, // Assuming it's required if they are a creator
        minlength: 2
    },
    creatorLastName: {
        type: String,
        required: true,
        minlength: 2
    },
    brandType: {
        type: String,
        required: true
    },
    gstNumber: {
        type: String,
        required: true,
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, 'Invalid GST number'] // Updated GST regex
    },
    address: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, 'Invalid contact number'] // Validates 10-digit phone numbers
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const brandSchema = new mongoose.Schema({
    creatorId: {
        type: objectId,
        ref: 'User', // References the User model
        required: true
    },
    creatorBrandName: {
        type: String,
        required: true,
        minlength: 5
    },
    creatorBrandDescription: {
        type: String,
        required: true
    },
    creatorProducts: [{
        type: objectId,
        ref: 'productSchema'// Assuming products are identified by name or ID. You can replace String with a more complex schema if needed.
    }],

    creatorPageAnalytical: {
        followers: {
            type: Number,
            default: 0 // Default value
        },
        reach: {
            type: Number,
            default: 0 // Default value
        },
        popularity: {
            type: String,
            enum: ['low', 'medium', 'high'], // Define acceptable values
            default: 'low' // Default value
        },
        averageRating: {
            type: Number,
            min: 1,
            max: 5,
            default: 0 // Default value indicating no ratings yet
        },
        totalReviews: {
            type: Number,
            default: 0 // Default value
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const productSchema = new mongoose.Schema({
    image: [
        {
            type: String,
            required: true
        }
    ],
    creatorId: {
        type: objectId,
        ref: 'Creator',
        required: true
    },
    itemName: {
        type: String,
        required: true,
        minlength: 2
    },
    itemDescription: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    productType: {
        type: String,
        required: true
    },
    hashtags: [
        {
            type: String
        }
    ],
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    itemAnalytical: {
        likes: [
            {
                userId: {
                    type: objectId,
                    ref: 'User'
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
    },
    // Reference to reviews
    reviews: [
        {
            type: objectId,
            ref: 'Review'
        }
    ],
    // Reference to comments (mada section)
    comments: [
        {
            type: objectId,
            ref: 'Comment'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const reviewSchema = new mongoose.Schema({
    productId: {
        type: objectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: objectId,
        ref: 'User',
        required: true
    },
    reviewText: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    category: {
        type: String,
        enum: ['Positive', 'Good', 'Satisfied'],
        default: function () {
            if (this.rating >= 5) return 'Positive';
            if (this.rating >= 4) return 'Good';
            return 'Satisfied';
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const commentSchema = new mongoose.Schema({
    productId: {
        type: objectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: objectId,
        ref: 'User',
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email is unique
        trim: true,
        lowercase: true, // Automatically converts email to lowercase
        match: /.+\@.+\..+/ // Basic email validation regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum password length
    },
    firstname: {
        type: String,
        required: true,
        minlength: 2
    },
    lastname: {
        type: String,
        required: true,
        minlength: 2
    },
    mobilenumber: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Regex for 10-digit mobile number
    },
    favouriteBrand: {
        type: String,
        default: null // Optional field
    },
     reviews: [{
        ref:'product',
        type:objectId,
        default:null
     }],
    intrest:[{
        type:String,
    }],
    followers: [{
        type:objectId,
        enum:['User','Creator']
    }],
    following:[{
        type:objectId,
        enum:['User','Creator']
        }
    ]
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});
const purchaseSchema = new mongoose.Schema({
    userId: {
        type: objectId,
        ref: 'User', // Reference to User model
        required: true
    },
    productsList: [{
        type: objectId,
        ref: 'Product' // Reference to Product model
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0 // Total amount cannot be negative
    },
    purchaseDate: {
        type: Date,
        default: Date.now // Automatically set the purchase date to now
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'], // Enum to restrict payment statuses
        default: 'Pending' // Default value is 'Pending'
    }
});
const cartSchema = new mongoose.Schema({
    user: {
        type: objectId,
        ref: "User"
    },
    product: [
        {
            type: objectId,
            ref: "product"
        }
    ],
    totalPrice: Number
});
const orderSchema = new mongoose.Schema({
    user: {
        type: objectId,
        ref: "User"
    },
    product: [
        {
            type: objectId,
            ref: "product"
        }
    ],
    totalPrice: Number,
    address: String,
    status: String,
    payment: {
        type: objectId,
        ref: "payment"
    },
    delivery: {
        type: objectId,
        ref: "delivery"
    }
});
const paymentSchema = new mongoose.Schema({
    order: {
        type: objectId,
        ref: "User"
    },
    amount: Number,
    method: String,
    status: String,
    transactionId: String
});
const deliverySchema = new mongoose.Schema({
    order: {
        type: objectId,
        ref: "User"
    },
    deliveryBoy: String,
    status: String,
    trackingURL: String,
    estimatedDeliveryTime: Number
});

const blacklistSchema = new mongoose.Schema({
    token: { type: String, required: true },
},{timestamps:true})
blacklistSchema.index({ token: 1 }, { unique: true })

// User Score -> Based on these scores we are showing data to user
const UserScoreSchema = new mongoose.Schema({
    userId: { type: objectId, ref: 'User', required: true },
    productId: { type: objectId, ref: 'Product', required: true },
    score: { type: Number, default: 0 } 
});

const UserReccomendScoreSchema= new mongoose.Schema({
    userId: {
        type: objectId,
        ref: 'User', // Reference to the User collection
        required: true
    },
    scoredUserId: {
        type: objectId,
        ref: 'User', // Reference to another User
        required: true
    },
    score: {
        type: Number,
        required: true
    },
 
},{
    timestamps: true
});

// Create Models 
const Creator = mongoose.model('Creator', creatorSchema);
const brandpage = mongoose.model('brandpage', brandSchema);
const Product = mongoose.model('Product', productSchema);



// User Models
const User = mongoose.model('User', userSchema);
const Purchase = mongoose.model('Purchase', userSchema);

// Reviews and comments
const Review = mongoose.model('Review', reviewSchema);
const Comment = mongoose.model('Comment', commentSchema);


const Payment = mongoose.model('Payment', paymentSchema);
const Order = mongoose.model('Order', orderSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);
const UserScore = mongoose.model('userScore', UserScoreSchema);
const UserReccomendScore = mongoose.model('userReccomendScore', UserReccomendScoreSchema);


module.exports = {
    Creator,
    brandpage,
    Product,
    User,
    Purchase,
    Review,
    Comment,
    Payment,
    Order,
    Delivery,
    UserScore,
    UserReccomendScore
};
