const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async(req, res) => {
  const contacts = await Contact.find({user_id:req.user.id});
  res.status(200).json(contacts);
});

//@desc Create New contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id:req.user.id
  });

  res.status(201).json(contact);
});


//@des get Contacts
//@route POST /api/contacts/:id
//@access Public

const getContact = asyncHandler( async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
      res.status(404);
      throw new Error("Contact not found");
    }
    res.status(200).json(contact);
})

//@des update Contacts
//@route  PUT /api/contacts/:id
//@access Public

const updateContact = asyncHandler(async(req,res)=>{
  const contact = await Contact.findById(req.params.id);
    if(!contact){
      res.status(404);
      throw new Error("Contact not found");
    }
    if(contact.user_id.toString()==req.user.id){
      res.status(401);
      throw new Error("User not authorized");
    }
    const updatedContact= await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );
    res.status(200).json(updatedContact);
}
)

//@des delete Contacts
//@route  delete /api/contacts/:id
//@access Public

const deleteContact = asyncHandler(async (req,res)=>{
  const contact = await Contact.findById(req.params.id);
    if(!contact){
      res.status(404);
      throw new Error("Contact not found");
    }
    if(contact.user_id.toString()==req.user.id){
      res.status(401);
      throw new Error("User not authorized");
    }
    await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json(contact);
});

module.exports ={ getContacts ,createContact ,getContact,updateContact,deleteContact};