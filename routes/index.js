var express = require('express');
var router = express.Router();
var firebase = require('firebase')
var config = {
    apiKey: "AIzaSyD_IH6x5BpWea9rV-lhoXiIPVaIdHLec6E",
    authDomain: "skill-spread.firebaseapp.com",
    databaseURL: "https://skill-spread.firebaseio.com",
    projectId: "skill-spread",
    storageBucket: "skill-spread.appspot.com",
    messagingSenderId: "219913114759"
};
var data = []
var change  = {}
var key = ''
var app = firebase.initializeApp(config);
/* GET home page. */
function isAuth() {
    var user = firebase.auth().currentUser;
    if(user)
    {
        return true;

    }
    else
    {
        return false;
    }
}
function getdata() {
    if(isAuth())

    {
        user = firebase.auth().currentUser
        console.log(user)
        var p = new Promise(function (resolve,reject) {
            firebase.database().ref().child("details").orderByChild("email").equalTo(user.email).once('value', function (snap) {
                key = Object.keys(snap.val()).map(function (k) {
                    return k
                })
                change = Object.keys(snap.val()).map(function (k) {
                    return snap.val()[k]

                })[0]

                resolve(change)
            })
        })
        return p
    }


}

router.get('/', function(req, res, next) {
    var loggedin = false
    if(isAuth())
    {
        loggedin = true
    }
  res.render('index', { log : loggedin });
});
router.get('/login',function (req,res,next) {

    if(isAuth())
    {
        res.redirect(['/'])
    }
    else
    {
        res.render('login')
    }

})
router.get('/spreads',function (req,res,next) {
    var loggedin = false
    if(isAuth())
    {
        loggedin = true
    }
firebase.database().ref("details").on('value',function (snap) {
  data = Object.keys(snap.val()).map(function (k) {
      return snap.val()[k]
  })
  res.render('spreads',{log :loggedin})
})
})
router.get('/blog',function (req,res,next) {
    var loggedin = false
    if(isAuth())
    {
        loggedin = true
    }
firebase.database().ref("details").on('value',function (snap) {
  data = Object.keys(snap.val()).map(function (k) {
      return snap.val()[k]
  })
    res.render('blog',{log :loggedin})
})
})
router.post('/search',function (req,res,next) {

    if(data)
    {

        var str = ''
        img = ["/images/avatar2/large/matthew.png","/images/avatar/large/elliot.jpg","/images/avatar/large/steve.jpg","/images/avatar/large/helen.jpg","/images/avatar/large/jenny.jpg"]

        data.forEach(function (e) {
            console.log(req.body.name)
            if(e.name.includes(req.body.name))
            {
                str = str + '<div class="col-lg-3" style="margin: 4%"> <div class="card h-100" style="width: 20rem;"><img class="card-img-top" src="https://semantic-ui.com'+ img[Math.floor(Math.random() * 5) + 0] + '" alt="Card image cap"><div class="card-body">'+
                    '<h4 class="card-title">'+e.name +'</h4>' + '<p class="card-text">Email : '+ e.email+'</p><p  class="card-text">No. of Publications : '+e.publications.length+'</p></div> </div></div>'

            }
        })

        res.send({str:str})
    }
    else
    {
        firebase.database().ref("details").on('value',function (snap) {
            data = Object.keys(snap.val()).map(function (k) {
                return snap.val()[k]
            })

            var str = ''
            img = ["/images/avatar2/large/matthew.png","/images/avatar/large/elliot.jpg","/images/avatar/large/steve.jpg","/images/avatar/large/helen.jpg","/images/avatar/large/jenny.jpg"]

            data.forEach(function (e) {
                if(e.name.includes(req.body.name))
                {
                    str = str + '<div class="col-lg-3" style="margin: 4%;"> <div class="card h-100" style="width: 20rem;"><img class="card-img-top" src="https://semantic-ui.com'+ img[Math.floor(Math.random() * 5) + 0] + '" alt="Card image cap"><div class="card-body">'+
                            '<h4 class="card-title">'+e.name +'</h4>' + '<p class="card-text">Email : '+ e.email+'</p><p  class="card-text">No. of Publications : '+e.publications.length+'</p></div> </div></div>'
                }
            })

           res.send({str:str})
        })
    }
})
router.post('/blogsearch',function (req,res,next) {
    if(data)
    {
        em = []
        var str = ''

        data.forEach(function (e) {
            e.publications.forEach(function (d) {
                if(d.course.includes(req.body.name))
                {
                    str = str + '<div class="col-lg-3" style="margin: 4%"> <div class="card h-100" style="width: 20rem;"> <div class="card-body">'+
                        '<h4 class="card-title">'+d.course +'</h4>' + '<p class="card-text">'+ d.content+'</p></div>' +
                        '<blockquote style="margin: 4%" class="blockquote mb-0"><footer class="blockquote-footer">'+d.type+' in <cite title="Source Title">'+e.name+'</cite></footer></blockquote><div class="card-footer text-muted">' +
                        '<button type="button" class="btn btn-primary btn-sm">Read More</button></div></div> </div>'
                }
            })

        })
        res.send({str:str})
    }
    else
    {
        firebase.database().ref("details").on('value',function (snap) {
            data = Object.keys(snap.val()).map(function (k) {
                return snap.val()[k]
            })
            em = []
            var str = ''

            data.forEach(function (e) {
                e.publications.forEach(function (d) {
                    if(d.course.includes(req.body.name))
                    {
                        str = str + '<div class="col-lg-3" style="margin: 4%;"> <div class="card h-100" style="width: 20rem;"> <div class="card-body">'+
                            '<h4 class="card-title">'+d.course +'</h4>' + '<p class="card-text">'+ d.content+'</p></div>' +
                            '<blockquote style="margin: 4%" class="blockquote mb-0"><footer class="blockquote-footer">'+d.type+' in <cite title="Source Title">'+e.name+'</cite></footer></blockquote><div class="card-footer text-muted">' +
                            '<button type="button" class="btn btn-primary btn-sm">Read More</button></div></div> </div>'
                    }
                })

            })
            res.send({str:str})
        })
    }
})
router.get('/logout',function (req ,res ,next) {
    var errorMessage = ''
    firebase.auth().signOut().catch(function (error) {
        errorMessage = error.message
        res.render('index')
    }).then(function () {

        if(errorMessage == '')
        {res.redirect(['/spreads'])}
        else
        {
            errorMessage = ''
        }
    });
})
router.get('/profile',function (req ,res ,next) {
    var loggedin = false
    if(isAuth())
    {
        loggedin = true
        getdata().then(function (change) {
            console.log(change)
            res.render('profile', { log : loggedin ,change : change});
        })

    }
    else
    {
        res.redirect(['/'])
    }

})
router.post('/service',function (req,res,next) {
    if(req.body.usage == 'qualdel')
    {
        change.qualifications.splice(change.qualifications.indexOf(req.body.del),1)
    }
    else if( req.body.usage == 'qualadd')
    {
        change.qualifications.push(req.body.add)
    }
    else if(req.body.usage == 'pubdel' )
    {
        change.publications.splice(change.publications.indexOf(JSON.parse(req.body.del)),1)

    }
    else if ( req.body.usage == 'pubadd')
    {
        change.publications.push(JSON.parse(req.body.add))
    }
    else  if( req.body.usage == 'news')
    {

        firebase.database().ref("news").push({email : req.body.email})
    }
    else
    {
        var changed = change;

        firebase.database().ref("details/" + key).remove();
        changed.name = req.body.name;
        changed.comapny = req.body.company;
        changed.about = req.body.about;
        changed.phone = req.body.phone;
        firebase.database().ref("details").push(changed)
    }
    console.log(change)
    res.send("success")
});
router.get('/company',function (req,res,next) {
    var loggedin = false
    if(isAuth())
    {
        loggedin = true
    }
    res.render('company', { log : loggedin });
})
module.exports = router;
