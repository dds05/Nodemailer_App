const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set("views", "views");

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine(
    "hbs",
    exphbs({
      extname: "hbs",
      defaultLayout: false
    })
  );

app.get('/', (req, res) => {
  res.render('contact',{
    layout: false,
    name: req.body.name,
    quote: req.body.quote
  });
});



app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'damandeep.in@gmail.com', // generated ethereal user
        pass: `${process.env.PASS}`, // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });
 

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <damandeep.in@gmail.com>', // sender address
      to: 'damandeep.in@gmail.com', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      
      res.render('contact', {layout:false ,msg:'Email has been sent'});
    
  });

  


 
  }); 

 const port=process.env.PORT||5000;

app.listen(port, () => console.log('Server started...'));