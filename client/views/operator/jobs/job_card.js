Template.jobCard.helpers({
  finishingSelection: function(){
    var job = Template.instance().data;
    var finishing = null;
    var string = ""
    if (!_.isUndefined(job)) {
      finishing = job.settings.finishing.collate;

      if (finishing.type === 'Bind') {
        string +=  finishing.bind + " binding, ";
      } else if (finishing.type === 'Fold' && !_.isUndefined(finishing.fold)) {
        string += finishing.fold + " fold";
      } else {
        string += finishing.type;
        if (finishing.type === 'Staple') {
          string += ", ";
        }
    }

      if (finishing.type !== "Don't collate" && finishing.type !== "Fold") {
        string += "Front: " + finishing.frontCover + ", ";
        string += "Back: " + finishing.backCover;
      }
    }
    return string;
  },
  stale: function() {
    var now = moment();
    var submitted = moment(Template.instance().data.submitted);
    var diff = now.diff(submitted, 'hours');
    var cssClass = 'grey';
    if (diff > 1 && diff <= 12) {
      cssClass = 'yellow';
    } else if (diff > 12) {
      cssClass = 'orange';
    }

    return cssClass;
  },
  downloadLink: function() {
    return Template.instance().data.files[0].downloadLink;
  },
  threeD: function() {
    var job = Template.instance().data;
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype === "application/sla" ? true : false;
  },
  not3D: function() {
    var job = Template.instance().data;
    var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
    return fileObj && fileObj.mimetype !== "application/sla" ? true : false;
  }
});

Template.jobCard.events({
  "click .job-link-label": function(event, template){
    var path = '/operator/jobs/' + this._id;
    FlowRouter.go(path);
  }
});
