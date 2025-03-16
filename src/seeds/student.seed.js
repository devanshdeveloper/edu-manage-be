const mongoose = require('mongoose');
const { Student } = require('../models');

const studentSeeds = {
  Model: Student,
  data: [
    {
      studentId: 'STU1001',
      phone: '+1234567890',
      dateOfBirth: new Date('2000-05-15'),
      address: '789 Student Avenue, College Town, ST 12345',
      admissionDate: new Date('2022-09-01'),
      class: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId()
    },
    {
      studentId: 'STU1002',
      phone: '+1987654321',
      dateOfBirth: new Date('2001-03-20'),
      address: '321 Learning Lane, University City, ST 12345',
      admissionDate: new Date('2022-09-01'),
      class: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId()
    }
  ]
};

module.exports = studentSeeds;