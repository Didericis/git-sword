Slices = new Mongo.Collection('Slices');
PullRequests = new Mongo.Collection('PullRequests');

if (Meteor.isClient) {
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    Template.header.events({
        'click #get-stuff': function() {
            Meteor.call('getRepos', function(err, result) {
                if (err) console.log(err.stack);
                if (result) console.log(result);
            });
        }
    });

    Template.hello.helpers({
        pullRequestList() {
            return PullRequests.find();
        }
    });

    Template.pullRequest.onRendered(function() {
        new Audio('fight.wav').play();
        var scream = new Audio('scream.wav');
        var locked = false;
        var pieces = 70,
            speed = 1,
            pieceW = 30,
            pieceH = 30;

        for (var i = pieces - 1; i >= 0; i--) {
            $('#popup').prepend('<div class="piece" style="width:'+pieceW+'px; height:'+pieceH+'px"></div>');
        };

        Template.instance().autorun(function(){
            if ((Slices.find().count() > 0) && !locked) {
                locked = true;
                TweenLite.to($('#popup h1'),0.2,{opacity:0});

                scream.play();
                $('.piece').each(function(){
                    var distX = getRandomArbitrary(-250, 250),
                        distY = getRandomArbitrary(-250, 250),
                        rotY  = getRandomArbitrary(-720, 720),
                        rotX  = getRandomArbitrary(-720, 720),
                        z = getRandomArbitrary(-500, 500);

                    TweenLite.to($(this), speed, {x:distX, y:distY, rotationX:rotX, rotationY:rotY, opacity: 0, z: z});
                });

                setTimeout(function() { Meteor.call('clearSlices', function(err, result) { locked = false; });}, 2000);
            }
        });
    });
}

if (Meteor.isServer) {
    let locked = false;
    Meteor.startup(function() {
        const state = (Math.random() * 1000).toString();

        if (!PullRequests.findOne()) {
            PullRequests.insert({name: 'PULL ME'});
        }
    });
    HTTP.methods({
        slice(data) {
            if (this.method === 'POST') {
                Slices.insert({slice: true});
            }
        }
    });
    Meteor.methods({
        clearSlices() {
            Slices.remove({});
            if (!locked) {
                locked = true;
                PullRequests.remove({});
                setTimeout(Meteor.bindEnvironment(function(){
                    locked = false;
                    PullRequests.insert({name: 'EVIL BUG'});
                }), 1000);
            }
        },
        getRepos() {
            return HTTP.call('GET', 'http://www.github.com/user/didericis/repos');
        }
    });
}
