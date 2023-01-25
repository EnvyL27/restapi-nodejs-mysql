const e = require('express');
var express = require('express')
var router = express.Router();
const Validator = require('fastest-validator');
const v = new Validator();
const {Notes} = require("../models")

router.get("/env", function(req, res, next) {
    res.send(process.env.APP_NAME);
});

//GET
router.get("/", async (req, res, next) => {
    const notes = await Notes.findAll();
    return res.json({
        status: 200, 
        message: "Success get data", 
        data: notes
    });

})

//GET BY ID
router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    let note = await Notes.findByPk(id);
    if(!note){
        return res.status(404).json({status: 404, message: "data not found"});
    }else{
        return res.json({
            status: 200,
            message: "Data get",
            data: note
        })
    }    
});


//POST
router.post("/", async (req, res, next) => {
    //validation
    const schema = {
        title: "string",
        description: "string|optional"
    }
    const validate = v.validate(req.body, schema);
    if(validate.length) {
        return res.status(400).json(validate);
    }
    //create table
    const note = await Notes.create(req.body)
    res.json({
        status: 200,
        message: "success",
        data: note,
    })
})

//PUT
router.put("/:id", async (req, res, next) => {
    const id = req.params.id;
    let note = await Notes.findByPk(id);
    if(!note){
        return res.status(404).json({status: 404, message: "data not found"});
    }
    //validation
    const schema = {
        title: "string|optional",
        description: "string|optional",
    };
    const validate = v.validate(req.body, schema)
    if(validate.length){
        return res.status(400).json(validate)
    }

    //Update process
    note = await note.update(req.body);
    res.json({
        status: 200,
        message: "Update success",
        data: note,
    });
});

module.exports = router;