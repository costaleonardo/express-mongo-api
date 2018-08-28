/*
 * Routes/v1.js
 *  - Import modules and setup passport middleware
*/

const express = require('express');
const router = express.Router();

const UserController = require('./../controllers/UserController');
const CompanyController = require('./../controllers/CompanyControllers');
const HomeController = require('./../controllers/HomeController');

const custom = require('./../middleware/custom');

const passport = require('passport');
const path = require('path');

require('./../middleware/passport')(passport);

// @route  POST /v1/users
// @desc   Create new users
// @access Public
router.post('/users', UserController.create);

// @route  GET /v1/users
// @desc   Create all users
// @access Private
router.get('/users', passport.authenticate('jwt', { session: false }), UserController.get);

// @route PUT /v1/users
// @desc  Update user
// @access Private
router.put('/users', passport.authenticate('jwt', { session: false }), UserController.update);

// @route  DELETE /v1/users
// @desc   Delete user
// @access Private
router.delete('/users', passport.authenticate('jwt', { session: false }), UserController.remove);

// @route  POST /v1/users/login
// @desc   Login in as user
// @access Public
router.post('/users/login', UserController.login);

// @route POST /v1/companies
// @desc  Post to companies
// @access Private
router.post('/companies', passport.authenticate('jwt', { session: false }), CompanyController.create);

// @route  GET /v1/companies
// @desc   Get all companies
// @access Private
router.get('/companies', passport.authenticate('jwt', { session: false }), CompanyController.getAll);

// @route  GET /v1/companies/:company_id
// @desc   Get company by id 
// @access Private
router.get('/companies/:company_id', passport.authenticate('jwt', { session: false }), CompanyController.get);

// @route  PUT /v1/companies/:company_id
// @desc   Update company by id
// @access Private
router.put('/companies/:company_id', passport.authenticate('jwt', { session: false }), CompanyController.update);

// @route  DELETE /v1/companies/:company_id
// @desc   Delete company by id
// @access Private
router.delete('/companies/:company_id', passport.authenticate('jwt', { session: false }), CompanyController.remove);

// @route  GET /v1/dash
// @desc   Get dashboard
// @access Private
router.get('/dash', passport.authenticate('jwt', { session: false }), HomeController.Dashboard);

module.exports = router;