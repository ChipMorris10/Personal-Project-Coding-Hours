var count = 0;
var startDate = '2015-07-06T09:30:46-0700';
var endDate = new Date().toISOString();
console.log(endDate);

$(document).on('ready', function() {


// Click handler to show/hide my resume
$('#schoolWorkHistory').hide();

    $("#schoolWorkHistory").on("click", function() {
        // $(".logos").hide();         // I DON'T THINK THIS IS NEEDED ANYMORE SINCE I GOT RID OF ALL THE LOGOS
        $('.resume').show();
    });

    $("#showResume").on("click", function() {
        $('#schoolWorkHistory').fadeToggle("slow");
    });

// Github API requirements
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

    $.ajax({
        url: "https://api.github.com/authorizations",
        method:"POST",
        data: JSON.stringify({
            "client_id":config.client_id,
            "client_secret":config.client_secret,
            "note": "Personal Project",
            "scopes": [
            "public_repo"
            ]
        }),
        dataType: "json",
        headers:{
            Authorization:"Basic " + config.basic_auth
        }
    }).done(function(data){
        localStorage.setItem("token", data.token);
        updateGithubCommits();
    });
    console.log('sanity check!');

});

function updateGithubCommits() {
    $.ajax({
        url: 'https://api.github.com/user/repos',
        headers: {
            Authorization: "token " + localStorage.getItem("token")
        }
    }).done(function(data) {
        data.forEach(function(repo) {
            countCommits(repo.name);
        });
        // COUNT IS SET
        console.log(count);
    });
}

function countCommits(repoName) {
    $.ajax({
        url: 'https://api.github.com/repos/ChipMorris10/' + repoName + '/commits?since=' + startDate + '&until=' + endDate,
        headers: {
            Authorization: "token " + localStorage.getItem("token")
        },
        async: false
    }).done(function(data) {
        count += data.length;
    }).fail(function(data) {
        console.log('no commits');
    });
}


