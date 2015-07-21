$(document).ready(function() {
  var nameGame = (function() {
    var users;
    var person;
    var randomUsers;
    var nameCorrect = false;
    var roleCorrect = false;
    var score = 0;
    var attempts = 0;
    var recent = [];
    var NUM_CHOICES = 5;
    var MAX_RECENT = 35;

    var loadPeople = function() {
      $.getJSON("employees.json", function(data) {
        users = data["users"];
        showCurrentPerson();
      });
    };

    var showCurrentPerson = function() {
      randomUsers = _.shuffle(users);
      if (recent.length > MAX_RECENT) recent.shift();
      while (recent.indexOf(randomUsers[0].name) > 0) {
        randomUsers.shift();
      }
      person = randomUsers[0];
      recent.push(person.name);
      showNames();
      showRoles();

      var picture = new Image();
      picture.src = 'http://www.gravatar.com/avatar/' + md5((person.email).trim().toLowerCase()) + '?s=256&d=404';
      picture.onload = function() {
        $('#person').empty();
        $(picture).appendTo('#person');
      };
      picture.onerror = function() {
        $('#person').text(person.name + ' has no picture :( Tell him/her to add it to gravatar!');
        $("button:contains('" + person.name + "')").removeClass('btn-default').addClass('btn-success');
        nameCorrect = true;
      };
      $('button').on('click', function() {
        judge($(this));
      });
    };

    var showNames = function() {
      var choices = _.first(randomUsers, NUM_CHOICES);
      choices = _.shuffle(choices);
      $('#name-choices').empty();
      _.each(choices, function(choice) {
        $('#name-choices').append("<li><button class='btn btn-default btn-block'>" + choice.name + "</button></li>");
      });
    };

    var showRoles = function () {
      var roles = [], choices = [], i = 0;
      while (choices.length < NUM_CHOICES) {
        if (roles.indexOf(randomUsers[i].role) < 0) {
          choices.push(randomUsers[i]);
          roles.push(randomUsers[i].role);
        }
        i++;
      }
      choices = _.shuffle(choices);
      $('#role-choices').empty();
      _.each(choices, function(choice) {
        $('#role-choices').append("<li><button class='btn btn-default btn-block'>" + choice.role + "</button></li>");
      });
    };

    var judge = function (button) {
      if (button.parent().parent().attr('id') === 'name-choices') {
        if (!nameCorrect) {
          attempts++;
          if (button.text() === person.name) {
            button.removeClass('btn-default').addClass('btn-success');
            nameCorrect = true;
            score++;
          }
          else {
            button.removeClass('btn-default').addClass('btn-danger');
          }
        }
      }
      else if (button.parent().parent().attr('id') === 'role-choices') {
        if (!roleCorrect) {
          attempts++;
          if (button.text() === person.role) {
            button.removeClass('btn-default').addClass('btn-success');
            roleCorrect = true;
            score++;
          }
          else {
            button.removeClass('btn-default').addClass('btn-danger');
          }
        }
      }

      updateScore();
      
      if (nameCorrect && roleCorrect) {
        nameCorrect = false;
        roleCorrect = false;
        showCurrentPerson();
      }
    };

    var updateScore = function () {
      $('#score').text(score + " / " + attempts + " correct");
    };

    return {
      loadPeople: loadPeople
    };
  })();

  nameGame.loadPeople();
});


