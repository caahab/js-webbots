//##### SEND #####//
var email 	= require("emailjs");
const nodemailer = require('nodemailer');

//emailjs
var server 	= email.server.connect({
   user:    "username", 
   password:"password", 
   host:    "smtp.your-email.com", 
   ssl:     true
});
// send the message and get a callback with an error or details of the message that was sent
server.send({
   text:    "i hope this works", 
   from:    "you <username@your-email.com>", 
   to:      "someone <someone@your-email.com>, another <another@your-email.com>",
   cc:      "else <else@your-email.com>",
   subject: "testing emailjs"
}, function(err, message) { console.log(err || message); });


//nodemailer
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'username@example.com',
        pass: 'userpass'
    }
});
// setup email data with unicode symbols
let mailOptions = {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});



//##### RECEIVE #####//
var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'mygmailname@gmail.com',
  password: 'mygmailpassword',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('1:3', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      imap.end();
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});

imap.connect();
