const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
// const slugify = require('slugify');
const validator = require('validator');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'A project Must Have  a Name'],
      minlength: [3, 'A project Name must be larger than 3 Charcter']
    },
    nameEN: {
      type: String,
      require: [true, 'A project Must Have  a Name'],
      minlength: [3, 'A project Name must be larger than 3 Charcter']
    },
    videos: { type: String },
    description: {
      type: String,
      require: [true, 'A project Must Have  a Description'],
      minlength: [20, 'project description is too small']
    },
    descriptionEN: {
      type: String,
      require: [true, 'A project Must Have  a Description'],
      minlength: [20, 'project description is too small']
    },
    imageCover: {
      type: [String],
      require: [true, 'A project Must Have  a cover image']
    },
    images: {
      type: [String],
      require: [true, 'A project Must Have  a images']
    },
    imagePlan: {
      type: [String],
      require: [true, 'A project Must Have  a images']
    },
    imageService: {
      type: [String],
      require: [true, 'A project Must Have  a images']
    },
    housingUnits: [
      {
        imageCover: { type: String },
        name: { type: String },
        nameEN: { type: String },
        description: { type: String },
        descriptionEN: { type: String }
      }
    ],
    establishDate: {
      type: Date,
      validate: [validator.isDate, 'please enter a valid establish date'],
      require: [true, 'establishing date is required']
    },

    locationEN: {
      type: String,
      enum: ['egypt', 'saudi arbia']
    },
    parsure: {
      type: String
    },
    parsureDownloads: {
      type: Number,
      default: 0
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    Timestamp: true
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
/*

1-create project  --------------------->done 
2-resize images from tarek code ----------->done
3-add phone in user schema------------->done
4-signup with google ------------------>done
5-uploaad images on cloud ------------------->done
6-schema validation /joi validation---------->done
7-put the status of the appointement
8-make the user able to book an appointement after the passed appointements---------->done
9-delete the appointement if the user is deleted ------------>delete
10-upload the cv to the drive------------>done
11-finalize auth & authrization------------>tarek,yasser(done)
12-test the error message in production
13-\\projects\:id\:fieldName\:imageName //delete images---------->done
14-dark Mode
15-arabic &english ------------->me&tarek(error messages)-------->done
16-download parsure ----------->done
17-reset password "logged out"------->done
18-404 error page
19-show error message
20-search 
21-resize image





**/
